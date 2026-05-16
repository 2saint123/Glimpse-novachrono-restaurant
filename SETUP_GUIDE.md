# 🚀 Glimpse Restaurant Backend - Complete Setup Guide

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

---

## 🛠️ Installation Steps

### 1. Database Setup

```bash
# Login to MySQL
mysql -u root -p

# Run the enhanced schema
mysql -u root -p < ENHANCED_DATABASE_SCHEMA.sql
```

The schema includes:
- ✅ Users table with soft delete
- ✅ Enhanced payments table (approve/decline)
- ✅ Messages table (contact system)
- ✅ Activity logs table (audit trail)
- ✅ All existing tables (orders, reservations, menu, etc.)

### 2. Backend Installation

```bash
cd backend
npm install
```

### 3. Environment Configuration

Create `.env` file in backend folder:

```env
PORT=5000
CLIENT_URL=http://localhost:5173

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=glimpse_restaurant_kigali

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Email (Gmail)
MAIL_SERVICE=gmail
MAIL_USER=your_email@gmail.com
MAIL_APP_PASSWORD=your_gmail_app_password
```

**How to get Gmail App Password:**
1. Go to Google Account Settings
2. Security → 2-Step Verification (enable it)
3. App Passwords → Generate new password
4. Copy and paste in `.env`

### 4. Start Backend Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server will run on: `http://localhost:5000`

---

## 🧪 Testing the API

### Test with cURL

```bash
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Test User",
    "email": "test@example.com",
    "phone": "0780000000",
    "password": "password123",
    "role": "customer"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test with Postman

1. Import the API collection (see API_DOCUMENTATION.md)
2. Set environment variable: `base_url = http://localhost:5000/api`
3. After login, save the token
4. Use token in Authorization header for protected routes

---

## 👤 Default Admin Account

```
Email: rwetoussanthony@gmail.com
Password: 2saint123
```

**⚠️ IMPORTANT:** Change this password in production!

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js              # MySQL connection
│   │   └── mailer.js          # Email configuration
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── menuController.js
│   │   ├── orderController.js
│   │   ├── reservationController.js
│   │   ├── adminController.js
│   │   ├── paymentController.js      # NEW
│   │   ├── messageController.js      # NEW
│   │   └── analyticsController.js    # NEW
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── upload.js
│   │   ├── validation.js             # NEW
│   │   ├── rateLimiter.js            # NEW
│   │   └── errorHandler.js           # NEW
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── menuRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── reservationRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── paymentRoutes.js          # NEW
│   │   ├── messageRoutes.js          # NEW
│   │   └── analyticsRoutes.js        # NEW
│   ├── utils/
│   │   └── logger.js                 # NEW - Activity logging
│   ├── app.js
│   └── server.js
├── uploads/                           # File uploads
├── .env
├── .env.example
└── package.json
```

---

## 🔥 New Features Added

### 1. 💳 Payment Management System
- Create payments
- Admin approve/decline payments
- Upload payment receipts
- Email notifications
- Payment analytics
- Audit logging

**Endpoints:**
- `POST /api/payments` - Create payment
- `GET /api/payments` - List all (admin)
- `GET /api/payments/mine` - User payments
- `PATCH /api/payments/:id/approve` - Approve
- `PATCH /api/payments/:id/decline` - Decline with reason
- `POST /api/payments/:id/receipt` - Upload receipt

### 2. 💬 Customer Messaging System
- Contact form submission
- Admin view all messages
- Mark as read/unread
- Reply to messages
- Email notifications
- Soft delete

**Endpoints:**
- `POST /api/messages` - Send message
- `GET /api/messages` - List all (admin)
- `GET /api/messages/:id` - Get single message
- `PATCH /api/messages/:id/read` - Mark as read
- `POST /api/messages/:id/reply` - Reply to message
- `DELETE /api/messages/:id` - Delete message

### 3. 📊 Analytics & Dashboard
- Total revenue calculation
- Pending payments count
- Unread messages count
- Sales by category
- Top selling items
- Daily/monthly revenue charts
- Activity logs

**Endpoints:**
- `GET /api/analytics/dashboard` - Dashboard stats
- `GET /api/analytics/sales` - Sales analytics
- `GET /api/analytics/logs` - Activity logs

### 4. 🔒 Security Features
- Rate limiting (100 req/15min)
- Input validation
- Error handling middleware
- Activity logging (audit trail)
- Soft delete (data preservation)

### 5. 📧 Email Notifications
- Payment approved/declined
- Message replies
- Waiter approval
- Reservation updates

### 6. 📦 Additional Features
- File upload for receipts
- Pagination for all lists
- Search and filter
- Date range filtering
- Soft delete for all entities

---

## 🎯 API Endpoints Summary

### Authentication (6 routes)
- Register, Login, Get Profile, Update Profile, Change Password

### Payments (6 routes)
- Create, List, Approve, Decline, Upload Receipt, User Payments

### Messages (6 routes)
- Create, List, Get, Mark Read, Reply, Delete

### Analytics (3 routes)
- Dashboard, Sales, Activity Logs

### Menu (5 routes)
- List, Create, Update, Delete, Categories

### Reservations (6 routes)
- Create, List, Approve, Reject, Cancel, Check Availability

### Orders (4 routes)
- Create, List, Update Status, Get Details

### Admin (15+ routes)
- Dashboard, Analytics, Customers, Payments, Orders, Waiters, Tables, Users

**Total: 50+ API endpoints**

---

## 🧪 Testing Checklist

### Payment System
- [ ] Create payment
- [ ] Admin view all payments
- [ ] Approve payment (check email sent)
- [ ] Decline payment with reason (check email sent)
- [ ] Upload receipt
- [ ] Filter payments by status
- [ ] Search payments

### Message System
- [ ] Send message from contact form
- [ ] Admin view all messages
- [ ] Mark message as read
- [ ] Reply to message (check email sent)
- [ ] Filter by read/unread
- [ ] Search messages
- [ ] Delete message

### Analytics
- [ ] View dashboard stats
- [ ] Check revenue calculations
- [ ] View sales by category
- [ ] View top selling items
- [ ] View activity logs
- [ ] Filter logs by action/entity

### Security
- [ ] Rate limiting works (try 101 requests)
- [ ] Validation errors return 400
- [ ] Unauthorized access returns 401
- [ ] Admin-only routes protected

---

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Check MySQL is running
mysql -u root -p

# Verify credentials in .env
DB_USER=root
DB_PASSWORD=your_password
```

### Email Not Sending
```bash
# Check Gmail App Password
# Enable 2-Step Verification
# Generate new App Password
# Update MAIL_APP_PASSWORD in .env
```

### Port Already in Use
```bash
# Change PORT in .env
PORT=5001

# Or kill process on port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:5000 | xargs kill -9
```

### CORS Error
```bash
# Add your frontend URL to .env
CLIENT_URL=http://localhost:5173

# Or update app.js allowedOrigins array
```

---

## 📚 Additional Resources

- [API Documentation](./API_DOCUMENTATION.md)
- [Database Schema](./ENHANCED_DATABASE_SCHEMA.sql)
- [Original README](./README.md)

---

## 🎉 Success!

Your backend is now running with:
✅ JWT Authentication
✅ Payment Management
✅ Customer Messaging
✅ Analytics Dashboard
✅ Activity Logging
✅ Email Notifications
✅ File Uploads
✅ Rate Limiting
✅ Input Validation
✅ Error Handling

**Ready for production deployment!** 🚀
