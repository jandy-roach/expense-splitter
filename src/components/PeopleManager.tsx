import { FormEvent, useState } from 'react';
import { Expense } from '../types';

type PeopleManagerProps = {
  people: string[];
  expenses: Expense[];
  onAddPerson: (name: string) => void;
  onRemovePerson: (name: string) => void;
};

function PeopleManager({ people, expenses, onAddPerson, onRemovePerson }: PeopleManagerProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  // when form is submitted, check if name is valid and add it
  const doAdd = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nameClean = name.trim();

    if (!nameClean) {
      setError('Please enter a name.');
      return;
    }

    if (people.some((person) => person.toLowerCase() === nameClean.toLowerCase())) {
      setError('That person is already in the group.');
      return;
    }

    onAddPerson(nameClean);
    setName('');
    setError(null);
  };

  // tries to delete a person but only if they dont have expenses attached
  const removeOne = (person: string) => {
    if (
      expenses.some(
        (expense) => expense.paidBy === person || expense.splitBetween.includes(person),
      )
    ) {
      setError(`${person} is attached to an expense and cannot be removed.`);
      return;
    }

    onRemovePerson(person);
    setError(null);
  };
// disable the button if the name field is empty
  
  const cantAdd = !name.trim();

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all ">
      <h2 className="text-gray-700 mb-4 text-2xl border-b-2 border-gray-200 pb-2">
        👥 Manage People
      </h2>

      <form className="flex gap-2 mb-4" onSubmit={doAdd}>
        <input
          type="text"
          placeholder="Enter person's name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-md text-base transition-colors focus:outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          disabled={cantAdd}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            cantAdd
              ? 'bg-indigo-300 text-white cursor-not-allowed'
              : 'bg-indigo-500 text-white cursor-pointer hover:bg-indigo-600'
          }`}
        >
          Add Person
        </button>
      </form>

      <h3 className="text-gray-500 text-sm mb-2">Current Members ({people.length})</h3>

      {people.length === 0 ? (
        <p className="text-center text-gray-400 py-6 italic">No people added yet</p>
      ) : (
        <ul className="list-none">
          {people.map((person) => (
            <li
              key={person}
              className="flex justify-between items-center px-3 py-2 mb-1 bg-gray-50 rounded-md border border-gray-100"
            >
              <span className="font-medium text-gray-800">{person}</span>
              <button
                type="button"
                onClick={() => removeOne(person)}
                className="text-red-400 px-2 py-1 rounded hover:text-red-600 hover:bg-red-50"
                aria-label={`Remove ${person}`}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      {people.length < 2 && (
        <p className="bg-red-100 text-red-900 px-3 py-3 rounded-md mt-4 flex items-center gap-2">
          ⚠️ Add at least 2 people to start tracking expenses
        </p>
      )}

      {error && (
        <div className="mt-4 px-3 py-2 rounded-md text-sm bg-red-100 text-red-800">
          {error}
        </div>
      )}
    </div>
  );
}

export default PeopleManager;
