import { Expense, SimplifiedDebt } from '../types';

type BalanceViewProps = {
  people: string[];
  expenses: Expense[];
};

const roundMoney = (value: number) => Math.round(value * 100) / 100;

// turns a number into money format like $5.50
const moneyText = (value: number) => `$${value.toFixed(2)}`;

function BalanceView({ people, expenses }: BalanceViewProps) {
  // these maps store money information
  const allMoney = new Map<string, number>();
  const paidMap = new Map<string, number>();
  const owedMap = new Map<string, number>();

  // helper function to add a person to all the maps
  const makePerson = (person: string) => {
    if (!allMoney.has(person)) {
      allMoney.set(person, 0);
      paidMap.set(person, 0);
      owedMap.set(person, 0);
    }
  };

  // initialize all people with zero balance
  people.forEach(makePerson);

  // calculate total amount spent by everyone
  const allSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // go through each expense and update who paid and who owes
  expenses.forEach((expense) => {
    makePerson(expense.paidBy);
    paidMap.set(
      expense.paidBy,
      (paidMap.get(expense.paidBy) ?? 0) + expense.amount,
    );

    const splitCount = expense.splitBetween.length;
    if (splitCount === 0) {
      return;
    }

    // divide equally among the people
    if (expense.splitType === 'equal') {
      const share = expense.amount / splitCount;
      expense.splitBetween.forEach((person) => {
        makePerson(person);
        owedMap.set(person, (owedMap.get(person) ?? 0) + share);
      });
      return;
    }

    // use the amounts that were specified
    if (expense.customAmounts) {
      expense.splitBetween.forEach((person) => {
        makePerson(person);
        const customAmount = expense.customAmounts?.[person] ?? 0;
        owedMap.set(person, (owedMap.get(person) ?? 0) + customAmount);
      });
    }
  });

  // calculate final balance for each person (paid minus owed)
  for (const [person] of allMoney) {
    const paid = paidMap.get(person) ?? 0;
    const owed = owedMap.get(person) ?? 0;
    allMoney.set(person, roundMoney(paid - owed));
  }

  // make a list of who needs to pay who
  const smallDebts: SimplifiedDebt[] = [];
  // people who get money back
  const peopleOwed = Array.from(allMoney.entries())
    .filter(([, balance]) => balance > 0.01)
    .map(([name, balance]) => ({ name, amount: balance }));
  // people who owe money
  const peopleOwe = Array.from(allMoney.entries())
    .filter(([, balance]) => balance < -0.01)
    .map(([name, balance]) => ({ name, amount: -balance }));

  // pair up people who owe with people who get money
  let i = 0;
  let j = 0;
  while (i < peopleOwe.length && j < peopleOwed.length) {
    const debtor = peopleOwe[i];
    const creditor = peopleOwed[j];
    // pick the smaller amount to transfer
    const payNow = Math.min(debtor.amount, creditor.amount);

    // record this payment
    smallDebts.push({
      from: debtor.name,
      to: creditor.name,
      amount: roundMoney(payNow),
    });

    // subtract the payment from both people
    debtor.amount = roundMoney(debtor.amount - payNow);
    creditor.amount = roundMoney(creditor.amount - payNow);

    // if someone is done, move to the next person
    if (debtor.amount <= 0.01) {
      i += 1;
    }
    if (creditor.amount <= 0.01) {
      j += 1;
    }
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
      <h2 className="text-gray-700 mb-4 text-2xl border-b-2 border-gray-200 pb-2">
        💰 Balances
      </h2>

      <div className="flex justify-between items-center p-4 bg-gradient-to-br  from-indigo-500 to-purple-600 text-white rounded-lg mb-6">
        <span>Total Group Spending:</span>
        <strong className="text-2xl">{moneyText(roundMoney(allSpent))}</strong>
      </div>

      <div className="mb-6">
        <h3 className="text-gray-600 my-2 text-lg">Individual Balances</h3>
        {Array.from(allMoney.entries()).map(([person, balance]) => {
          const getsMoney = balance > 0.01;
          const needsPay = balance < -0.01;
          const rowLook = getsMoney
            ? 'bg-green-100 border-green-200 text-green-900'
            : needsPay
              ? 'bg-red-100 border-red-200 text-red-900'
              : 'bg-gray-100 border-gray-200 text-gray-700';

          return (
            <div
              key={person}
              className={`flex justify-between items-center px-3 py-3 mb-2 rounded-md border ${rowLook}`}
            >
              <span className="font-medium">{person}</span>
              <span className="flex items-center gap-2 text-sm">
                <span>
                  {getsMoney ? 'is owed' : needsPay ? 'owes' : 'settled up'}
                </span>
                <strong className="text-base">
                  {moneyText(Math.abs(balance))}
                </strong>
              </span>
            </div>
          );
        })}
      </div>

      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h3 className="text-gray-700 text-lg mb-2">💸 Suggested Settlements</h3>
        <p className="text-gray-500 text-sm mb-3">
          Minimum transactions to settle all debts:
        💸 </p>
        {smallDebts.length === 0 ? (
          <p className="text-green-700 bg-green-100 px-3 py-2 rounded-md">
            ✅ All balances are settled!
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {smallDebts.map((debt, index) => (
              <div
                key={`${debt.from}-${debt.to}-${index}`}
                className="flex justify-between items-center bg-white rounded-md px-3 py-2 border border-gray-200"
              >
                <span className="text-sm">
                  <span className="text-red-600 font-medium">{debt.from}</span>{' '}
                  →{' '}
                  <span className="text-green-600 font-medium">{debt.to}</span>
                </span>
                <strong className="text-gray-700">{moneyText(debt.amount)}</strong>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BalanceView;
