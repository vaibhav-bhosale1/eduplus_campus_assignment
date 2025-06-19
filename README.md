
# 🛒 RateNest- Store Ratings App - Full-Stack MERN Application

## 🚀 Deployment

The application is deployed and available at:  
🔗 [https://ratenest-eight.vercel.app](https://ratenest-eight.vercel.app)

---

## 🧪 Testing Credentials

You can use the following credentials to log in as a **System Administrator** for testing purposes:

- **Email:** `system@gmail.com`  
- **Password:** `System@12345`


A robust full-stack web application designed to manage stores and user ratings, featuring distinct roles for system administrators, store owners, and normal users.

Built with:
- **Frontend**: React (Vite), TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL using Prisma ORM

---

## ✨ Features

- 🔐 **User Authentication & Authorization**: Secure JWT-based login with role-based access.
- 🛠️ **System Administrator**: Manage all users, stores, and ratings.
- 🧑‍💼 **Store Owner**: Manage store details and view who rated their store.
- 🙋‍♂️ **Normal User**: View and rate stores, edit submitted ratings.
- 🏪 **Store Management**: CRUD operations on stores.
- ⭐ **Rating System**: 1–5 star rating system with average rating display.
- 🔍 **Search & Filtering**: Easily find stores or users by name and location.
- 📱 **Responsive Design**: Fully responsive and mobile-friendly.
- 🔑 **Password Management**: Users can update their passwords securely.
- 📊 **Dynamic Dashboards**: Role-based UI with relevant features and stats.

---

## 🛠️ Technologies Used

### Frontend
- **React (Vite)**
- **TypeScript**
- **Tailwind CSS**
- **React Router DOM**
- **Axios**

### Backend
- **Node.js**
- **Express.js**
- **TypeScript**
- **Prisma ORM**
- **PostgreSQL**
- **JWT (jsonwebtoken)**
- **Bcryptjs**
- **Zod**

### Deployment & Tools
- **Vercel** (Frontend)
- **Render.com** (Backend + PostgreSQL)
- **Git + GitHub**

---

## 🚀 Getting Started

### ✅ Prerequisites

Ensure you have the following installed:
- Node.js (v18+)
- npm or yarn
- PostgreSQL (local or Docker)
- Git

---

### 📦 Installation

```bash
# Clone the repository
git clone https://github.com/your-username/store-ratings-app.git
cd store-ratings-app
````

> Replace `your-username` with your GitHub username.

#### Install Frontend Dependencies

```bash
cd frontend
npm install
```

#### Install Backend Dependencies

```bash
cd ../backend
npm install
```

---

### ⚙️ Environment Variables

Create `.env` files in both frontend and backend directories:

#### backend/.env

```env
DATABASE_URL="postgresql://user:password@localhost:5432/your_database_name?schema=public"
JWT_SECRET="YOUR_SUPER_SECRET_JWT_KEY_HERE"
PORT=5000
```

#### frontend/.env

```env
VITE_BACKEND_URL=http://localhost:5000/api
```

---

### 🗃️ Database Setup (Local)

```bash
# Navigate to backend directory
cd backend

# Run Prisma migrations
npx prisma migrate dev --name init
```

---

## ▶️ Running the Application

#### Start Backend Server

```bash
cd backend
npm run dev
```

> Backend runs at `http://localhost:5000`

#### Start Frontend Server

```bash
cd frontend
npm run dev
```

> Frontend runs at `http://localhost:5173`

---

## ☁️ Deployment

### 🔼 Frontend Deployment (Vercel)

1. Push `frontend/` to GitHub
2. Import project into [Vercel](https://vercel.com/)
3. Set root directory as `frontend/`
4. Add environment variable:

   ```env
   VITE_BACKEND_URL=https://your-backend-app.onrender.com/api
   ```
5. Deploy

### 🔼 Backend + DB Deployment (Render.com)

1. Create a **PostgreSQL DB** on Render
2. Copy the External DB URL
3. Create a **Web Service** for `backend/`
4. Set:

   * **Root Directory**: `backend/`
   * **Build Command**:

     ```bash
     npm install && npm run build && npx prisma migrate deploy
     ```
   * **Start Command**:

     ```bash
     node dist/server.js
     ```
   * **Environment Variables**:

     ```env
     DATABASE_URL=your_render_db_url
     JWT_SECRET=your_jwt_secret
     PORT=5000
     ```

---

## 🔑 Adding SYSTEM\_ADMIN User Manually

After deployment, your database will be empty. You'll need to manually insert the first `SYSTEM_ADMIN` user.

### 1. Generate a Hashed Password

Create a temporary script:

```js
// backend/hashPassword.js
const bcrypt = require('bcryptjs');

const plainTextPassword = 'YourSuperSecureAdminPassword123!';
const saltRounds = 10;

bcrypt.hash(plainTextPassword, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
    return;
  }
  console.log('Hashed Password:', hash);
});
```

Run it:

```bash
node hashPassword.js
```

Copy the output hash.

---

### 2. Connect to Render DB (using psql or pgAdmin)

Use the External DB URL from Render to connect.

---

### 3. Insert Admin User

```sql
INSERT INTO "User" (
    name, email, password, address, role
) VALUES (
    'System Administrator',
    'admin@example.com',
    'PASTE_HASHED_PASSWORD_HERE',
    'Admin HQ, 123 Main St',
    'SYSTEM_ADMIN'
) ON CONFLICT (email) DO NOTHING;
```

---

## 💡 Usage

* Visit your frontend URL (Vercel)
* Log in as admin using the credentials you set
* Register normal users or store owners
* Manage users, stores, and ratings from role-based dashboards

---

## 📂 Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── server.ts
│   ├── prisma/
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   └── vite.config.ts
├── .gitignore
└── README.md
```

---

## 👋 Contributing

1. Fork the repo
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make changes and commit: `git commit -m 'Add feature'`
4. Push to your fork: `git push origin feature/your-feature-name`
5. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License.

```

Let me know if you want to include **shields.io badges**, **demo images**, or **live links**!
```
