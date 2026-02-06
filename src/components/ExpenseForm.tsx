import { FormEvent, useMemo, useState } from 'react';
import { Expense } from '../types';

type ExpenseFormProps = {
  people: string[];
  onAddExpense: (expense: Expense) => void;
};

type Feedback = string | null;

const getTodayDate = () => new Date().toISOString().slice(0, 10);

function ExpenseForm({ people, onAddExpense }: ExpenseFormProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(getTodayDate());
  const [paidBy, setPaidBy] = useState('');
  const [splitType, setSplitType] = useState<'equal' | 'custom'>('equal');
  const [splitBetween, setSplitBetween] = useState<string[]>([]);
  const [customAmounts, setCustomAmounts] = useState<Record<string, string>>({});
  const [error, setError] = useState<Feedback>(null);

  const peoplePicked = useMemo(() => new Set(splitBetween), [splitBetween]);

  // when you click someone, add or remove them from the split
  const clickPerson = (person: string) => {
    if (person === paidBy) {
      return;
    }
    setSplitBetween((prev) => {
      if (prev.includes(person)) {
        const next = prev.filter((name) => name !== person);
        setCustomAmounts((now) => {
          const nextAmounts = { ...now };
          delete nextAmounts[person];
          return nextAmounts;
        });
        return next;
      }
      return [...prev, person];
    });
  };

  // update the custom amount for a person
  const changeMoney = (person: string, value: string) => {
    setCustomAmounts((now) => ({ ...now, [person]: value }));
  };
// when someone is picked as who paid, add them to the split too
  
  const whoPaid = (value: string) => {
    setPaidBy(value);
    if (!value) {
      return;
    }
    setSplitBetween((prev) => (prev.includes(value) ? prev : [...prev, value]));
  // checks if all the form info is valid
  };

  const checkStuff = () => {
    if (!description.trim()) {
      return 'Please provide a description.';
    }

    const amountNum = Number(amount);
    if (!amount || Number.isNaN(amountNum) || amountNum <= 0) {
      return 'Amount must be greater than 0.';
    }

    if (!date) {
      return 'Please select a date.';
    }

    if (!paidBy) {
      return 'Please select who paid for this expense.';
    }

    if (splitBetween.length === 0) {
      return 'Select at least one person to split the expense with.';
    }

    if (!splitBetween.includes(paidBy)) {
      return 'The payer must be included in the split.';
    }

    if (splitType === 'custom') {
      let total = 0;
      for (const person of splitBetween) {
        const value = customAmounts[person];
        const amountValue = Number(value);
        if (!value || Number.isNaN(amountValue) || amountValue < 0) {
          return `Enter a valid amount for ${person}.`;
        }
        total += amountValue;
      }

      if (Math.abs(total - amountNum) > 0.01) {
        return 'Custom amounts must add up to the total expense.';
      }
    }

    return null;
  };
// disable add button if something is missing or wrong
  
  const amountNum = Number(amount);
  // clears all the fields in the form
  const cantAdd =
    !paidBy || splitBetween.length === 0 || !amount || Number.isNaN(amountNum) || amountNum <= 0;

  const clearAll = () => {
    setDescription('');
    setAmount('');
    setDate(getTodayDate());
    setPaidBy('');
    setSplitType('equal');
    setSplitBetween([]);
  // handles when the form is submitted
    setCustomAmounts({});
  };

  const submitIt = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const msg = checkStuff();
    if (msg) {
      setError(msg);
      return;
    }

    const expense: Expense = {
      id: Date.now(),
      description: description.trim(),
      amount: amountNum,
      paidBy,
      splitBetween,
      date,
      splitType,
      customAmounts:
        splitType === 'custom'
          ? Object.fromEntries(
              splitBetween.map((person) => [person, Number(customAmounts[person])]),
            )
          : undefined,
    };

    onAddExpense(expense);
    setError(null);
    clearAll();
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all ">
      <h2 className="text-gray-700 mb-4 text-2xl border-b-2 border-gray-200 pb-2">
        💸 Add Expense
      </h2>

      <form onSubmit={submitIt}>
        <div className="mb-4">
          <label htmlFor="description" className="block mb-1 text-gray-700 font-medium text-sm">
            Description
          </label>
          <input
            id="description"
            type="text"
            placeholder="What was the expense for?"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-md text-base transition-colors focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 mb-4">
            <label htmlFor="amount" className="block mb-1 text-gray-700 font-medium text-sm">
              Amount ($)
            </label>
            <input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-md text-base transition-colors focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex-1 mb-4">
            <label htmlFor="date" className="block mb-1 text-gray-700 font-medium text-sm">
              Date
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-md text-base transition-colors focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="paidBy" className="block mb-1 text-gray-700 font-medium text-sm">
            Paid By
          </label>
            <select
              id="paidBy"
              value={paidBy}
              onChange={(event) => whoPaid(event.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-md text-base transition-colors focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
            <option value="">Select person...</option>
            {people.map((person) => (
              <option key={person} value={person}>
                {person}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-gray-700 font-medium text-sm">Split Type</label>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer px-1 py-1 rounded transition-colors hover:bg-gray-50">
              <input
                type="radio"
                value="equal"
                name="splitType"
                checked={splitType === 'equal'}
                onChange={() => setSplitType('equal')}
                className="cursor-pointer"
              />
              <span>Equal Split</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer px-1 py-1 rounded transition-colors hover:bg-gray-50">
              <input
                type="radio"
                value="custom"
                name="splitType"
                checked={splitType === 'custom'}
                onChange={() => setSplitType('custom')}
                className="cursor-pointer"
              />
              <span>Custom Amounts</span>
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-gray-700 font-medium text-sm">Split Between</label>
          <div className="flex flex-col gap-2">
            {people.map((person) => {
              const isPayer = person === paidBy;
              return (
              <div key={person} className="flex items-center justify-between py-2 px-2 bg-gray-50 rounded">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="cursor-pointer"
                    checked={peoplePicked.has(person)}
                    onChange={() => clickPerson(person)}
                    disabled={isPayer}
                  />
                  <span>{person}</span>
                </label>
                {splitType === 'custom' && peoplePicked.has(person) && (
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={customAmounts[person] ?? ''}
                    onChange={(event) => changeMoney(person, event.target.value)}
                    className="w-28 px-2 py-1 border border-gray-200 rounded text-sm"
                  />
                )}
              </div>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={cantAdd}
          className={`w-full px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-1 ${
            cantAdd
              ? 'bg-indigo-300 text-white cursor-not-allowed'
              : 'bg-indigo-500 text-white cursor-pointer hover:bg-indigo-600 hover:-translate-y-px'
          }`}
        >
          Add Expense
        </button>
      </form>

      {error && (
        <div className="mt-4 px-3 py-2 rounded-md text-sm bg-red-100 text-red-800">
          {error}
        </div>
      )}
    </div>
  );
}

export default ExpenseForm;
