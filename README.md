# 🚀 CareConnect - Backend API Server

Backend server for the **CareConnect - Social Development Events Platform**, built with Express.js, TypeScript, MongoDB, and JWT authentication.

---

## 🌟 Key Features
* **Strict TypeScript Architecture:** Zero usage of `any`, ensuring comprehensive end-to-end type safety.
* **JWT Protected APIs:** Secure authorization middleware protecting event creation, updates, deletions, and volunteer join actions.
* **Strict Future Date Validation:** Automatic validation preventing past-dated events from being created or updated.
* **Optimized MongoDB Queries:** Uses `.limit(6)` and date filters (`eventDate >= today`) for fast query execution.
* **Owner-Only Mutations:** Built-in creator verification ensuring only organizers can modify or delete their respective events.

---

## 🛠️ Tech Stack
* **Runtime:** Node.js
* **Framework:** Express.js
* **Language:** TypeScript
* **Database:** MongoDB (Native Driver)
* **Security:** JSON Web Tokens (`jsonwebtoken`), `cors`, `dotenv`

---

## 📡 API Endpoints Reference

### Public Routes
* `GET /` - Health check status and server uptime
* `GET /api/events/recent` - Returns 6 recent upcoming events (`.limit(6)`)
* `GET /api/events/upcoming` - Returns upcoming events with search & category filtering
* `GET /api/events/:id` - Fetch single event details by MongoDB ObjectId

### Protected Routes (Requires `Authorization: Bearer <token>`)
* `POST /api/auth/jwt` - Generates JWT token upon user authentication
* `POST /api/events` - Host a new community event (Future date validated)
* `GET /api/events/user/my-events` - Fetch events organized by the authenticated user
* `PUT /api/events/:id` - Update existing event (Creator only)
* `DELETE /api/events/:id` - Delete an event (Creator only)
* `POST /api/events/action/join` - Join a community event as a volunteer
* `GET /api/events/user/joined-by-me` - Fetch all events joined by current user

---

## ⚙️ Local Development Setup

1. Clone the repository and navigate to `server/`:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_uri
   DB_NAME=social_development_db
   JWT_SECRET=your_jwt_secret_key
   CLIENT_URL=http://localhost:3000
   ```

4. (Optional) Seed realistic community events:
   ```bash
   npm run seed
   ```

5. Run development server:
   ```bash
   npm run dev
   ```

6. Build for production:
   ```bash
   npm run build
   npm start
   ```

