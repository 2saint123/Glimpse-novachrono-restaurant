# GLIMPSE RESTAURANT KIGALI

Full-stack luxury restaurant management and reservation platform.

## Stack

- Frontend: React (Vite), Tailwind CSS, Axios, React Router DOM, Framer Motion, React Icons
- Backend: Node.js, Express.js, MySQL, JWT, Nodemailer, Multer, bcryptjs
- Database: MySQL

## Project Structure

- `frontend` - luxury public website + customer/admin/waiter interfaces
- `backend` - REST API with MVC-style folders
- `DATABASE_SCHEMA.sql` - complete schema + seed data

## Setup

### 1) Database

1. Create MySQL database and tables:
   - Run `DATABASE_SCHEMA.sql`
   - Use the `categories` and `menu_items` tables for the menu system
   - Store image paths in `menu_items.image_url` as relative paths like `images/steak.jpg`
2. The admin seed is:
   - Email: `rwetoussanthony@gmail.com`
   - Password: `2saint123`

### 2) Backend

```bash
cd backend
npm install
```

Create `.env` from `.env.example`:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=glimpse_restaurant_kigali
JWT_SECRET=super_secret_jwt_key
MAIL_SERVICE=gmail
MAIL_USER=your_email@gmail.com
MAIL_APP_PASSWORD=your_generated_app_password
```

Run backend:

```bash
npm run dev
```

### 3) Frontend

```bash
cd frontend
npm install
```

Create `.env` from `.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
```

Run frontend:

```bash
npm run dev
```

## Core Features Included

- Role-based JWT auth (`customer`, `admin`, `waiter`)
- Waiter self-registration with admin approval and email of temporary credentials
- Luxury home/about/menu/reservation/contact pages
- Visual table reservation status (available/reserved/occupied)
- Menu search and category filtering
- Customer ordering with tax and totals
- Admin dashboard stats + waiter approval flow
- Waiter dashboard for assigned orders and status updates
- Email events for registration, reservation approval/rejection, waiter approval, and new orders
- Multer image upload support for menu/gallery endpoints

## API Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PUT /api/auth/me`
- `PUT /api/auth/change-password`
- `GET /api/menu`
- `GET /api/menu/categories`
- `POST /api/menu` (admin)
- `PUT /api/menu/:id` (admin)
- `DELETE /api/menu/:id` (admin)
- `GET /api/reservations/availability`
- `POST /api/reservations` (customer)
- `GET /api/reservations/mine` (customer)
- `PATCH /api/reservations/:id/cancel` (customer)
- `PATCH /api/reservations/:id/approve` (admin)
- `PATCH /api/reservations/:id/reject` (admin)
- `POST /api/orders` (customer)
- `GET /api/orders/mine` (customer)
- `GET /api/orders/waiter` (waiter)
- `PATCH /api/orders/:id/status` (waiter/admin)
- `GET /api/admin/dashboard`
- `GET /api/admin/waiters`
- `PATCH /api/admin/waiters/:id/approve`
- `PATCH /api/admin/waiters/:id/reject`
