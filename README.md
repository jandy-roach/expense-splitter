# Expense Splitter

This is a simple expense sharing app.  
It helps a group of people keep track of shared expenses and see who needs to pay whom.

The app starts empty.  
Users first add people, then add expenses, and finally check balances.

---

## What this app can do

### 1. Manage People
- Add people to a group by entering their name
- Remove people from the group
- Show the list of all people
- Show how many people are in the group

> A person cannot be removed if they are already used in an expense.

---

### 2. Manage Expenses
- Add a new expense with:
  - Description (what the expense was for)
  - Amount
  - Date
  - Who paid for it
  - Who should share the expense
- Split expenses in two ways:
  - **Equal split** (everyone pays the same amount)
  - **Custom split** (different amounts for each person)
- View all added expenses
- Delete an expense if needed

---

### 3. View Balances
- See total money spent by the group
- For each person, see:
  - How much they paid
  - How much they owe
  - Whether they should receive money or pay money
- See suggested payments to settle all balances with minimum transactions

---

## How to run the project

### Requirements
Make sure you have:
- Node.js (version 16 or higher)
- npm or yarn

---

### Setup

1. Clone the project:
```bash
git clone https://github.com/jandy-roach/expense-splitter.git
```

2. Go to the project folder:

```bash
cd expense-splitter
```

3. Install dependencies:

```bash
npm install
```

---

### Start the app

Run:

```bash
npm run dev
```


Open your browser and visit:

```
http://localhost:5173
```

(or the link shown in the terminal)

---

## How to use the app

1. Add at least two people in the **Manage People** section
2. Go to **Add Expense** and fill in the expense details
3. Choose how the expense should be split
4. Check the **Balances** section to see who owes money and who should receive money

---

## Important Notes

* The app does not start with any demo data
* All people and expenses must be added by the user
* The app handles empty states safely

---

## Future Improvements

* Edit expenses
* Save data using local storage or backend
* Improve mobile design

---

## About

This project was built as a practice / assessment project to understand React, TypeScript, and basic state management.
