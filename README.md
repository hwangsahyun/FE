# UNIS 💰

> A mobile-first personal finance app for young adults.  
> 20대를 위한 가계부 앱 — 예산, 지출, 저축, 캐릭터 성장까지.

---

## Tech Stack

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-v7-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![npm](https://img.shields.io/badge/npm-11-CB3837?style=for-the-badge&logo=npm&logoColor=white)

---

## Features

| Feature | Description | Status |
|---------|-------------|--------|
| 🏠 Home Dashboard | Monthly budget overview, category breakdown, character status | ✅ Done |
| 💸 Expense Tracking | Daily logging by category and payment method | 🔲 Planned |
| 📊 Budget Management | Monthly budget planning by category | 🔲 Planned |
| 🐣 Character System | Attendance check with a status-changing character | 🔲 Planned |
| 💰 Savings Management | Savings account and deposit tracking | 🔲 Planned |
| 📈 Consumption Report | Visual reports with AI-powered feedback | 🔲 Planned |

---

## Project Structure
```
UNIS/
├── public/
├── src/
│   ├── components/        # Shared components
│   │   └── BottomNav.jsx
│   ├── data/              # Dummy data for prototyping
│   │   └── dummy.js
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Expense.jsx
│   │   ├── Budget.jsx
│   │   ├── Savings.jsx
│   │   ├── Report.jsx
│   │   ├── Character.jsx
│   │   └── MyPage.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── vite.config.js
└── package.json
```

---

## Getting Started
```bash
cd UNIS
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.
