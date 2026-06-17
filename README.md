# 🎓 Sankalp Teaching Center - Student Management System

A production-ready Student Management System rebuilt as a full-stack application using **React (TypeScript, Vite)** for the frontend, **Node.js (Express, TypeScript, Prisma)** for the backend API layer, and **PostgreSQL** for database storage. 

This application is containerized using **Docker** and **Docker Compose** for easy, immediate deployment.

---

## 📦 Tech Stack

- **Frontend**: React 18, TypeScript, Vite, React Router 6, React Hook Form, Chart.js
- **Backend**: Node.js, Express, TypeScript, JWT (JSON Web Tokens), Multer (image uploads)
- **Database & ORM**: PostgreSQL, Prisma ORM
- **Aesthetics**: Extracted custom CSS rules matching the original design language exactly
- **Containerization**: Docker, Nginx (frontend server), PostgreSQL (database)

---

## 🚀 Getting Started with Docker Compose

Ensure you have **Docker** and **Docker Compose** installed on your system.

### 1. Build and Run the Containers
Navigate to the root directory `c:\student-management-system-STC--main` and run:

```bash
docker-compose up --build -d
```

This command will:
1. Boot up a PostgreSQL database instance.
2. Build the Node.js Express backend, push the database schema, seed it with the default admin/academic records, and expose the API on port `5000`.
3. Build the React frontend, host it via Nginx, and expose the portal interface on port `3000`.

### 2. Access the Application
Open your web browser and navigate to:
- **Frontend Portal**: [http://localhost:3000](http://localhost:3000)
- **Backend Health Check**: [http://localhost:5000/health](http://localhost:5000/health)

### 3. Log In (Admin Credentials)
- **Username**: `admin`
- **Password**: `admin`

---

## 🛠️ Local Development (Without Docker)

If you prefer to run the application components locally:

### Prerequisites
- Node.js (v18+)
- Running PostgreSQL database instance

### Setup Backend
1. Go to the backend folder:
   ```bash
   cd backend
   ```
2. Configure `.env` with your PostgreSQL connection string:
   ```env
   PORT=5000
   DATABASE_URL="postgresql://user:password@localhost:5432/student_db"
   JWT_SECRET="sankalp_teaching_center_super_secret"
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Push database schema and seed:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```
5. Start development server:
   ```bash
   npm run dev
   ```

### Setup Frontend
1. Go to the frontend folder:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run development server:
   ```bash
   npm run dev
   ```
4. Open your browser at [http://localhost:5173](http://localhost:5173).

---

## 🗂️ Project Structure

```
c:\student-management-system-STC--main\
├── backend/
│   ├── src/
│   │   ├── controllers/      # Route controllers (Auth, Student, Teacher, Attendance, Reports)
│   │   ├── middleware/       # JWT Auth and file uploads (Multer)
│   │   ├── routes/           # REST endpoints mapping
│   │   ├── services/         # Prisma database context client
│   │   └── utils/            # Auto-generated IDs (STU-/TCH-) and log helpers
│   ├── prisma/
│   │   ├── schema.prisma     # Postgres database schema model mapping
│   │   └── seed.ts           # Demo database seeds loader
│   ├── uploads/              # Local storage uploads destination
│   └── Dockerfile            # Container config for production server build
│
├── frontend/
│   ├── src/
│   │   ├── assets/           # Extracted styles
│   │   ├── components/       # Common components (Sidebar, Topnav, Modals)
│   │   ├── pages/            # Core views (Dashboard, Logs, Forms, Lists)
│   │   └── services/         # API fetch request handlers
│   ├── index.html
│   ├── nginx.conf            # Nginx config with React route support
│   └── Dockerfile            # Container config for static files serving
│
└── docker-compose.yml        # Services orchestrator (db, backend, frontend)
```
