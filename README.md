💊 Medication Management App

A full-stack medication tracking application for patients and caretakers. Patients can mark medications taken, view adherence history, and assign caretakers. Caretakers can assign medications, monitor patient adherence, and view analytics.

🛠️ Tech Stack
| Frontend            | Backend              | Database      | Others                   |
| ------------------- | -------------------- | ------------- | ------------------------ |
| React + Vite        | Node.js + Express.js | PostgreSQL    | Prisma ORM               |
| Redux Toolkit (RTK) | REST API             | Neon/Cloud DB | Tailwind CSS + ShadCN UI |
| React Calendar      | JWT Authentication   |               | Framer Motion, Recharts  |

## 📦 Features
🧑 Patient
View today's medication schedule

Mark medications as taken (with optional photo proof)

Visual adherence calendar

Assign caretaker

View adherence summary (streaks, % taken, missed)

View medication history

🧑‍⚕️ Caretaker
Assign medications to patients

View adherence analytics for each patient

Manage multiple patients

View calendar-based adherence data

📁 Project Structure
medication-app/
├── backend/                  # Node.js + Express + Prisma backend
│   ├── controllers/          # API controllers
│   ├── routes/               # Route definitions
│   ├── prisma/               # Prisma schema & migrations
│   ├── middleware/           # Auth & error handlers
│   ├── utils/                # Helper functions
│   ├── app.js                # Express app setup
│   └── index.js             # Entry point
│
├── frontend/                 # React + Redux frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── patient/      # Patient-facing UI components
│   │   │   └── caretaker/    # Caretaker-facing UI components
│   │   ├── features/         # Redux slices (auth, patient, caretaker)
│   │   ├── pages/            # Route-level components (Dashboards)
│   │   ├── services/         # Axios API setup
│   │   └── App.jsx
│   └── index.html
│
├── .env
├── README.md
└── package.json

1. Setup Backend
cd backend
## npm install

2. Setup .env:
DATABASE_URL=your_postgres_url
JWT_SECRET=your_jwt_secret

3. Run Prisma:
npx prisma generate
npx prisma migrate dev --name init

4. Start server:
## npm run dev

5. Setup Frontend
cd frontend
## npm install

6. Start Vite dev server:
## npm run dev 

🔐 Auth Flow
JWT-based authentication (signup/login)
Role-based dashboard rendering (Patient vs Caretaker)
Role is stored in Redux + localStorage



