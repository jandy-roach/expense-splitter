import { useEffect, useRef, useState } from 'react';
import BalanceView from './components/BalanceView';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './settlements/ExpenseList';
import PeopleManager from './components/PeopleManager';
import { Expense } from './types';

type Toast = { type: 'success' | 'error'; message: string } | null;

// tries to get something from localStorage, if it doesn't exist or breaks just use the fallback
const getStuff = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') {
    return fallback;
  }
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

function App() {
  const [people, setPeople] = useState<string[]>(
    () => getStuff<string[]>('people', []),
  );
  const [expenses, setExpenses] = useState<Expense[]>(
    () => getStuff<Expense[]>('expenses', []),
  );
  const [toast, setToast] = useState<Toast>(null);
  const toastThing = useRef<number | null>(null);

  // displays a popup message and makes it disappear after 2.5 seconds
  const showPop = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ type, message });
    if (toastThing.current) {
      window.clearTimeout(toastThing.current);
    }
    toastThing.current = window.setTimeout(() => setToast(null), 2500);
  };
// whenever the people list changes, save it to localStorage
  
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem('people', JSON.stringify(people));
  }, [people]);
// whenever the expenses list changes, save it to localStorage
  
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem('expenses', JSON.stringify(expenses));
  // adds a new person to the people list
  }, [expenses]);

  const addPersonNow = (name: string) => {
    setPeople((prev) => [...prev, name]);
    showPop('Person added');
  // removes a person from the people list
  };

  const removePersonNow = (name: string) => {
    setPeople((prev) => prev.filter((person) => person !== name));
  // adds a new expense to the top of the list
    showPop('Person removed');
  };

  const addExpenseNow = (expense: Expense) => {
  // removes an expense from the list using its id
    setExpenses((prev) => [expense, ...prev]);
    showPop('Expense added');
  };

  const deleteExpenseNow = (id: number) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
    showPop('Expense deleted');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600">
      <header className="bg-white/10 backdrop-blur-md p-6 text-center border-b border-white/20">
        <h1 className="text-white text-4xl font-bold drop-shadow-lg">💰 Expense Splitter</h1>
      </header>

      <main className="p-6 sm:p-8">
        {toast && (
          <div className="max-w-7xl mx-auto mb-6">
            <div
              className={`px-4 py-3 rounded-md text-sm shadow ${
                toast.type === 'success'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
              role="status"
            >
              {toast.message}
            </div>
          </div>
        )}
        <div className="max-w-7xl mx-auto grid gap-8 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <PeopleManager
              people={people}
              expenses={expenses}
              onAddPerson={addPersonNow}
              onRemovePerson={removePersonNow}
            />
            <ExpenseForm people={people} onAddExpense={addExpenseNow} />
          </div>

          <div className="flex flex-col gap-6">
            <BalanceView people={people} expenses={expenses} />
            <ExpenseList expenses={expenses} onDeleteExpense={deleteExpenseNow} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
