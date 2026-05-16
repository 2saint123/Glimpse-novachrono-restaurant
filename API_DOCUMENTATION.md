# Glimpse Restaurant - Complete API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected routes require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## 🔐 Authentication Routes

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "full_name": "John Doe",
  "email": "john@example.com",
  "phone": "0780000000",
  "password": "password123",
  "role": "customer"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

### Update Profile
```http
PUT /auth/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "full_name": "John Updated",
  "phone": "0781111111"
}
```

### Change Password
```http
PUT /auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldpass",
  "newPassword": "newpass"
}
```

---

## 💳 Payment Routes

### Create Payment
```http
POST /payments
Authorization: Bearer <token>
Content-Type: application/json

{
  "order_id": 1,
  "amount": 50000,
  "method": "Mobile Money"
}
```

### Get All Payments (Admin)
```http
GET /payments?status=pending&page=1&limit=10&search=john&startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <admin_token>
```

### Get User Payments
```http
GET /payments/mine
Authorization: Bearer <token>
```

### Approve Payment (Admin)
```http
PATCH /payments/:id/approve
Authorization: Bearer <admin_token>
```

### Decline Payment (Admin)
```http
PATCH /payments/:id/decline
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "reason": "Invalid receipt or payment proof"
}
```

### Upload Receipt
```http
POST /payments/:id/receipt
Authorization: Bearer <token>
Content-Type: multipart/form-data

receipt: <file>
```

---

## 💬 Message Routes

### Send Message (Contact Form)
```http
POST /messages
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "0780000000",
  "subject": "Inquiry about reservation",
  "message": "I would like to know about..."
}
```

### Get All Messages (Admin)
```http
GET /messages?is_read=false&page=1&limit=10&search=john&startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <admin_token>
```

### Get Single Message (Admin)
```http
GET /messages/:id
Authorization: Bearer <admin_token>
```

### Mark as Read (Admin)
```http
PATCH /messages/:id/read
Authorization: Bearer <admin_token>
```

### Reply to Message (Admin)
```http
POST /messages/:id/reply
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "reply": "Thank you for your inquiry. We would be happy to..."
}
```

### Delete Message (Admin)
```http
DELETE /messages/:id
Authorization: Bearer <admin_token>
```

---

## 📊 Analytics Routes

### Get Dashboard Analytics (Admin)
```http
GET /analytics/dashboard
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "summary": {
    "total_revenue": 5000000,
    "pending_payments": 15,
    "unread_messages": 8,
    "total_orders": 250,
    "total_customers": 120,
    "pending_reservations": 10
  },
  "revenue_by_month": [...],
  "recent_payments": [...],
  "recent_activities": [...],
  "payment_status": [...]
}
```

### Get Sales Analytics (Admin)
```http
GET /analytics/sales?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "sales_by_category": [...],
  "top_items": [...],
  "daily_sales": [...]
}
```

### Get Activity Logs (Admin)
```http
GET /analytics/logs?page=1&limit=20&action=APPROVE_PAYMENT&entity_type=payment&user_id=1
Authorization: Bearer <admin_token>
```

---

## 🍽️ Menu Routes

### Get All Menu Items
```http
GET /menu?category=Dinner&search=steak
```

### Get Menu Categories
```http
GET /menu/categories
```

### Create Menu Item (Admin)
```http
POST /menu
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data

name: Grilled Steak
description: Premium beef steak
price: 28000
category_id: 3
image: <file>
```

### Update Menu Item (Admin)
```http
PUT /menu/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Updated Name",
  "price": 30000
}
```

### Delete Menu Item (Admin)
```http
DELETE /menu/:id
Authorization: Bearer <admin_token>
```

---

## 📅 Reservation Routes

### Check Availability
```http
GET /reservations/availability?date=2024-12-25&time=19:00&guests=4
```

### Create Reservation
```http
POST /reservations
Authorization: Bearer <token>
Content-Type: application/json

{
  "table_id": 5,
  "reservation_date": "2024-12-25",
  "reservation_time": "19:00",
  "guests": 4,
  "notes": "Window seat preferred"
}
```

### Get My Reservations
```http
GET /reservations/mine
Authorization: Bearer <token>
```

### Cancel Reservation
```http
PATCH /reservations/:id/cancel
Authorization: Bearer <token>
```

### Approve Reservation (Admin)
```http
PATCH /reservations/:id/approve
Authorization: Bearer <admin_token>
```

### Reject Reservation (Admin)
```http
PATCH /reservations/:id/reject
Authorization: Bearer <admin_token>
```

---

## 🛒 Order Routes

### Create Order
```http
POST /orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "reservation_id": 1,
  "items": [
    { "menu_item_id": 5, "quantity": 2 },
    { "menu_item_id": 8, "quantity": 1 }
  ],
  "notes": "No onions please"
}
```

### Get My Orders
```http
GET /orders/mine
Authorization: Bearer <token>
```

### Get Waiter Orders (Waiter)
```http
GET /orders/waiter
Authorization: Bearer <waiter_token>
```

### Update Order Status (Waiter/Admin)
```http
PATCH /orders/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "preparing"
}
```

---

## 👨‍💼 Admin Routes

### Dashboard Stats
```http
GET /admin/dashboard
Authorization: Bearer <admin_token>
```

### Get Analytics
```http
GET /admin/analytics?period=30
Authorization: Bearer <admin_token>
```

### List Customers
```http
GET /admin/customers
Authorization: Bearer <admin_token>
```

### Get Customer Details
```http
GET /admin/customers/:id
Authorization: Bearer <admin_token>
```

### List Payments
```http
GET /admin/payments
Authorization: Bearer <admin_token>
```

### Payment Stats
```http
GET /admin/payments/stats
Authorization: Bearer <admin_token>
```

### List Orders
```http
GET /admin/orders?status=pending
Authorization: Bearer <admin_token>
```

### Get Order Details
```http
GET /admin/orders/:id
Authorization: Bearer <admin_token>
```

### Update Order Status
```http
PATCH /admin/orders/:id/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "completed"
}
```

### List Reservations
```http
GET /admin/reservations
Authorization: Bearer <admin_token>
```

### List Waiters
```http
GET /admin/waiters
Authorization: Bearer <admin_token>
```

### Approve Waiter
```http
PATCH /admin/waiters/:id/approve
Authorization: Bearer <admin_token>
```

### Reject Waiter
```http
PATCH /admin/waiters/:id/reject
Authorization: Bearer <admin_token>
```

### List Tables
```http
GET /admin/tables
Authorization: Bearer <admin_token>
```

### Update Table Status
```http
PATCH /admin/tables/:id/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "occupied"
}
```

### List All Users
```http
GET /admin/users
Authorization: Bearer <admin_token>
```

---

## 📝 Activity Log Actions

The system tracks the following actions:
- `CREATE_PAYMENT` - Payment created
- `APPROVE_PAYMENT` - Payment approved by admin
- `DECLINE_PAYMENT` - Payment declined by admin
- `CREATE_MESSAGE` - Message sent
- `MARK_MESSAGE_READ` - Message marked as read
- `REPLY_MESSAGE` - Admin replied to message
- `DELETE_MESSAGE` - Message deleted

---

## 🔒 Security Features

1. **JWT Authentication** - Secure token-based auth
2. **Password Hashing** - bcrypt with salt rounds
3. **Rate Limiting** - 100 requests per 15 minutes
4. **Input Validation** - All inputs validated
5. **Soft Delete** - Data preserved with deleted_at timestamp
6. **Activity Logging** - Complete audit trail
7. **CORS Protection** - Configured allowed origins
8. **Error Handling** - Centralized error middleware

---

## 📧 Email Notifications

Emails are sent for:
- Payment approved
- Payment declined
- Waiter account approved
- Reservation approved/rejected
- Message reply
- New order notification

---

## 🎯 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `429` - Too Many Requests
- `500` - Internal Server Error

---

## 🚀 Advanced Features Included

✅ Payment Management System
✅ Customer Messaging System
✅ Activity Logs (Audit Trail)
✅ Email Notifications
✅ File Upload (Receipts)
✅ Pagination
✅ Search & Filter
✅ Soft Delete
✅ Rate Limiting
✅ Sales Analytics
✅ Revenue Tracking
✅ Dashboard Stats
