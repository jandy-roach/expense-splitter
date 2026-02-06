import { useState } from 'react';
import { Expense } from '../types';

type ExpenseListProps = {
  expenses: Expense[];
  onDeleteExpense: (id: number) => void;
};

const dateToText = (dateString: string) => {
  // turns a date like "2024-01-28" into "Jan 28, 2024"
  const theDate = new Date(dateString);
  return theDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

function ExpenseList({ expenses, onDeleteExpense }: ExpenseListProps) {
  // keeps track of which expense is open/expanded
  const [openOne, setOpenOne] = useState<number | null>(null);

  // toggles whether an expense is shown expanded or collapsed
  const openClose = (id: number) => {
    setOpenOne((prev) => (prev === id ? null : id));
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
      <h2 className="text-gray-700 mb-4 text-2xl border-b-2 border-gray-200 pb-2">
        Expense History
      </h2>

      {expenses.length === 0 ? (
        <p className="text-center text-gray-400 py-8 italic">
          No expenses added yet. Add your first expense to get started!
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {expenses.map((expense) => {
            const showMore = openOne === expense.id;
            const extraSplit =
              expense.splitType === 'custom' ? expense.customAmounts : null;
            return (
              <div
                key={expense.id}
                className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => openClose(expense.id)}
                  className="w-full p-4 flex justify-between items-center text-left hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="text-gray-800 mb-1 text-lg whitespace-nowrap overflow-hidden text-ellipsis">
                      {expense.description}
                    </h4>
                    <div className="flex gap-4 text-gray-600 text-sm">
                      <span>{dateToText(expense.date)}</span>
                      <span>Paid by {expense.paidBy}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-semibold text-gray-700">
                      ${expense.amount.toFixed(2)}
                    </span>
                    <span className="text-gray-500"></span>
                  </div>
                </button>

                {showMore && (
                  <div className="border-t border-gray-200 bg-white px-4 py-3">
                    {extraSplit ? (
                      <div className="mb-3">
                        <p className="text-sm text-gray-600 mb-2">
                          Split Details (custom)
                        </p>
                        <div className="flex flex-col gap-2">
                          {Object.entries(extraSplit).map(([person, amount]) => (
                            <div
                              key={person}
                              className="flex justify-between text-sm text-gray-700"
                            >
                              <span>{person}</span>
                              <span className="text-red-600">
                                owes ${amount.toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600 mb-3">
                        Split equally between:{' '}
                        <span className="text-gray-800 font-medium">
                          {expense.splitBetween.join(', ')}
                        </span>
                      </p>
                    )}

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => onDeleteExpense(expense.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition-colors"
                      >
                        Delete Expense
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="text-center p-4 bg-gray-50 rounded-lg text-gray-700 mt-6">
        <p>
          Total Expenses: <strong>{expenses.length}</strong>
        </p>
      </div>
    </div>
  );
}

export default ExpenseList;
