# 🚀 CareConnect - Backend API Server

> 🚀 **Live API Base URL:** [https://care-connect-server-smoky.vercel.app](https://care-connect-server-smoky.vercel.app)<br />
> 💻 **Client Repository:** [https://github.com/NooreAlamCoder/careConnect-client](https://github.com/NooreAlamCoder/careConnect-client)

High-performance REST API backend for the **CareConnect** platform, built with Express.js, TypeScript, MongoDB Atlas native driver, and JWT authorization.

---

## 🌟 Backend Core Capabilities

* **Strict TypeScript Architecture:** 100% type safety with custom interfaces (`IEvent`, `IJoinedEvent`, `ApiResponse`), with zero usage of `any`.
* **JWT Protected APIs:** Secure authorization middleware protecting event creation, updates, deletions, and volunteer join actions.
* **Strict Future Date Validation:** Server-side boundary check preventing past-dated events from ever being created or updated in the database.
* **Optimized MongoDB Queries:** Efficient indexing and queries using `.limit(6)` for recent events and indexed date filtering (`eventDate >= today`).
* **Owner-Only Mutations:** Built-in creator verification ensuring only the organizing user can edit or delete their respective events.
* **Duplicate Join Prevention:** Verification logic preventing a user from joining the same initiative multiple times.
* **10MB Extended Payload Support:** Configured Express JSON and urlencoded body parsers to smoothly handle base64 image uploads.
* **Serverless / Vercel Ready:** Seamless deployment on Vercel with `@vercel/node` and automated database connection pooling.

---

## 🛠️ Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js 5
* **Language:** TypeScript (Node16 module resolution)
* **Database:** MongoDB (Official Native Driver `mongodb`)
* **Security & Utilities:** `jsonwebtoken`, `cors`, `dotenv`, `tsx`
* **Deployment:** Vercel

---

## 📡 API Endpoints Reference

### Public Routes
* `GET /` - Health check status, uptime, and server timestamp
* `GET /api/events/recent` - Returns 6 recent upcoming events (`.limit(6)`)
* `GET /api/events/upcoming` - Returns upcoming events with keyword search (`?search=`) and category filtering (`?category=`)
* `GET /api/events/:id` - Fetch single event details by MongoDB ObjectId

### Protected Routes (Requires `Authorization: Bearer <token>`)
* `POST /api/auth/jwt` - Generates signed JWT token upon user authentication
* `POST /api/events` - Host a new community event (Strict future date validated)
* `GET /api/events/user/my-events` - Fetch events organized by the authenticated user
* `PUT /api/events/:id` - Update existing event (Owner verification enforced)
* `DELETE /api/events/:id` - Delete an event (Owner verification enforced)
* `POST /api/events/action/join` - Join a community event as a volunteer (Duplicate prevention checked)
* `GET /api/events/user/joined-by-me` - Fetch all events joined by the current user (Sorted chronologically by event date)

---

## ⚙️ Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/NooreAlamCoder/careConnect-server.git
   cd careConnect-server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables in `.env`:**
   ```env
   PORT=5050
   MONGODB_URI=your_mongodb_atlas_connection_string
   DB_NAME=CareConnectDB
   JWT_SECRET=your_jwt_secret_key_here
   CLIENT_URL=http://localhost:3001
   ```

4. **(Optional) Seed realistic community events:**
   ```bash
   npm run seed
   ```

5. **Run development server:**
   ```bash
   npm run dev
   ```

6. **Build for production:**
   ```bash
   npm run build
   npm start
   ```
