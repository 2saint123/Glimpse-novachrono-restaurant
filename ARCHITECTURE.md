# 🏗️ System Architecture - Glimpse Restaurant Backend

## 📊 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  React   │  │ Postman  │  │  Mobile  │  │   cURL   │       │
│  │ Frontend │  │   API    │  │   App    │  │  Testing │       │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘       │
└───────┼─────────────┼─────────────┼─────────────┼──────────────┘
        │             │             │             │
        └─────────────┴─────────────┴─────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MIDDLEWARE LAYER                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │     CORS     │  │ Rate Limiter │  │    Error     │         │
│  │  Protection  │  │ 100 req/15m  │  │   Handler    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │     JWT      │  │  Validation  │  │    Upload    │         │
│  │     Auth     │  │   Middleware │  │   (Multer)   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                       ROUTING LAYER                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │   Auth   │  │ Payments │  │ Messages │  │Analytics │       │
│  │  Routes  │  │  Routes  │  │  Routes  │  │  Routes  │       │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘       │
│  ┌────┴─────┐  ┌────┴─────┐  ┌────┴─────┐  ┌────┴─────┐       │
│  │   Menu   │  │  Orders  │  │Reserv.   │  │  Admin   │       │
│  │  Routes  │  │  Routes  │  │  Routes  │  │  Routes  │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
└─────────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CONTROLLER LAYER                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │    Auth      │  │   Payment    │  │   Message    │         │
│  │  Controller  │  │  Controller  │  │  Controller  │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  Analytics   │  │     Menu     │  │    Order     │         │
│  │  Controller  │  │  Controller  │  │  Controller  │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│  ┌──────────────┐  ┌──────────────┐                            │
│  │ Reservation  │  │    Admin     │                            │
│  │  Controller  │  │  Controller  │                            │
│  └──────────────┘  └──────────────┘                            │
└─────────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                     UTILITY LAYER                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Activity   │  │    Email     │  │     File     │         │
│  │    Logger    │  │   Service    │  │   Storage    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE LAYER                              │
│                         MySQL 8.0                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  users   │  │ payments │  │ messages │  │activity_ │       │
│  │          │  │          │  │          │  │  logs    │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  orders  │  │order_    │  │reserv.   │  │  menu_   │       │
│  │          │  │ items    │  │          │  │  items   │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                     │
│  │categories│  │restaurant│  │ waiters  │                     │
│  │          │  │ _tables  │  │          │                     │
│  └──────────┘  └──────────┘  └──────────┘                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Request Flow Diagram

### Example: Payment Approval Flow

```
┌─────────┐
│  Admin  │
│ Client  │
└────┬────┘
     │
     │ 1. PATCH /api/payments/1/approve
     │    Authorization: Bearer <token>
     ▼
┌─────────────────┐
│  Rate Limiter   │ ◄── Check: < 100 requests?
└────┬────────────┘
     │ ✓ Pass
     ▼
┌─────────────────┐
│   JWT Auth      │ ◄── Verify token
└────┬────────────┘
     │ ✓ Valid
     ▼
┌─────────────────┐
│  Authorization  │ ◄── Check: Is admin?
└────┬────────────┘
     │ ✓ Admin
     ▼
┌─────────────────┐
│    Payment      │
│   Controller    │
└────┬────────────┘
     │
     │ 2. Get payment from DB
     ▼
┌─────────────────┐
│     MySQL       │
│   Database      │
└────┬────────────┘
     │ 3. Return payment data
     ▼
┌─────────────────┐
│    Payment      │ ◄── Validate: Is pending?
│   Controller    │
└────┬────────────┘
     │ ✓ Pending
     │
     │ 4. Update payment status
     ▼
┌─────────────────┐
│     MySQL       │
│   Database      │
└────┬────────────┘
     │ 5. Update order status
     ▼
┌─────────────────┐
│     MySQL       │
│   Database      │
└────┬────────────┘
     │ 6. Log activity
     ▼
┌─────────────────┐
│  Activity Log   │
│     Utility     │
└────┬────────────┘
     │ 7. Send email
     ▼
┌─────────────────┐
│  Email Service  │
│   (Nodemailer)  │
└────┬────────────┘
     │ 8. Return success
     ▼
┌─────────┐
│  Admin  │ ◄── { message: "Payment approved" }
│ Client  │
└─────────┘
```

---

## 🔐 Authentication Flow

```
┌─────────┐
│  User   │
└────┬────┘
     │ POST /api/auth/login
     │ { email, password }
     ▼
┌─────────────────┐
│      Auth       │
│   Controller    │
└────┬────────────┘
     │ 1. Find user by email
     ▼
┌─────────────────┐
│     MySQL       │
└────┬────────────┘
     │ 2. Return user
     ▼
┌─────────────────┐
│      Auth       │ ◄── 3. Compare password
│   Controller    │     (bcrypt.compare)
└────┬────────────┘
     │ ✓ Match
     │ 4. Generate JWT token
     ▼
┌─────────────────┐
│   JWT Service   │
└────┬────────────┘
     │ 5. Return token
     ▼
┌─────────┐
│  User   │ ◄── { token, user }
└─────────┘
     │
     │ Subsequent requests
     │ Authorization: Bearer <token>
     ▼
┌─────────────────┐
│   JWT Auth      │ ◄── Verify & decode token
│   Middleware    │
└────┬────────────┘
     │ ✓ Valid
     │ req.user = decoded
     ▼
┌─────────────────┐
│   Controller    │ ◄── Access req.user
└─────────────────┘
```

---

## 💳 Payment System Architecture

```
┌──────────────────────────────────────────────────────────┐
│                   PAYMENT SYSTEM                          │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  ┌────────────┐      ┌────────────┐      ┌────────────┐│
│  │  Customer  │      │   Admin    │      │   System   ││
│  │   Actions  │      │  Actions   │      │  Actions   ││
│  └─────┬──────┘      └─────┬──────┘      └─────┬──────┘│
│        │                   │                   │        │
│        │ Create            │ Approve           │ Email  │
│        │ Payment           │ Payment           │ Notify │
│        │                   │                   │        │
│        │ Upload            │ Decline           │ Log    │
│        │ Receipt           │ Payment           │ Activity│
│        │                   │                   │        │
│        │ View Own          │ View All          │ Update │
│        │ Payments          │ Payments          │ Order  │
│        │                   │                   │        │
│        └───────────┬───────┴───────────────────┘        │
│                    ▼                                     │
│         ┌──────────────────────┐                        │
│         │  Payment Controller  │                        │
│         └──────────┬───────────┘                        │
│                    ▼                                     │
│         ┌──────────────────────┐                        │
│         │   MySQL Database     │                        │
│         │   payments table     │                        │
│         └──────────────────────┘                        │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## 💬 Message System Architecture

```
┌──────────────────────────────────────────────────────────┐
│                   MESSAGE SYSTEM                          │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  ┌────────────┐      ┌────────────┐      ┌────────────┐│
│  │  Customer  │      │   Admin    │      │   System   ││
│  │   Actions  │      │  Actions   │      │  Actions   ││
│  └─────┬──────┘      └─────┬──────┘      └─────┬──────┘│
│        │                   │                   │        │
│        │ Send              │ View All          │ Email  │
│        │ Message           │ Messages          │ Notify │
│        │                   │                   │        │
│        │                   │ Mark as           │ Log    │
│        │                   │ Read              │ Activity│
│        │                   │                   │        │
│        │                   │ Reply to          │        │
│        │                   │ Message           │        │
│        │                   │                   │        │
│        │                   │ Delete            │        │
│        │                   │ Message           │        │
│        │                   │                   │        │
│        └───────────┬───────┴───────────────────┘        │
│                    ▼                                     │
│         ┌──────────────────────┐                        │
│         │  Message Controller  │                        │
│         └──────────┬───────────┘                        │
│                    ▼                                     │
│         ┌──────────────────────┐                        │
│         │   MySQL Database     │                        │
│         │   messages table     │                        │
│         └──────────────────────┘                        │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## 📊 Analytics System Architecture

```
┌──────────────────────────────────────────────────────────┐
│                  ANALYTICS SYSTEM                         │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  ┌─────────────────────────────────────────────────┐    │
│  │              Admin Dashboard                     │    │
│  └───────────────────┬─────────────────────────────┘    │
│                      │                                   │
│         ┌────────────┼────────────┐                     │
│         │            │            │                     │
│         ▼            ▼            ▼                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐               │
│  │ Revenue  │ │  Sales   │ │ Activity │               │
│  │Analytics │ │Analytics │ │   Logs   │               │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘               │
│       │            │            │                      │
│       └────────────┼────────────┘                      │
│                    ▼                                    │
│         ┌──────────────────────┐                       │
│         │ Analytics Controller │                       │
│         └──────────┬───────────┘                       │
│                    ▼                                    │
│         ┌──────────────────────┐                       │
│         │   MySQL Database     │                       │
│         │  Multiple Tables     │                       │
│         │  - payments          │                       │
│         │  - orders            │                       │
│         │  - order_items       │                       │
│         │  - activity_logs     │                       │
│         └──────────────────────┘                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🔒 Security Layers

```
┌─────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Layer 1: CORS Protection                               │
│  ├─ Allowed origins only                                │
│  └─ Credentials support                                 │
│                                                          │
│  Layer 2: Rate Limiting                                 │
│  ├─ 100 requests per 15 minutes                         │
│  └─ Per IP tracking                                     │
│                                                          │
│  Layer 3: JWT Authentication                            │
│  ├─ Token verification                                  │
│  └─ Token expiration                                    │
│                                                          │
│  Layer 4: Role-Based Authorization                      │
│  ├─ Customer, Admin, Waiter roles                       │
│  └─ Route-level protection                              │
│                                                          │
│  Layer 5: Input Validation                              │
│  ├─ Required fields check                               │
│  ├─ Data type validation                                │
│  └─ Format validation                                   │
│                                                          │
│  Layer 6: Password Security                             │
│  ├─ bcrypt hashing (10 rounds)                          │
│  └─ No plain text storage                               │
│                                                          │
│  Layer 7: SQL Injection Prevention                      │
│  ├─ Parameterized queries                               │
│  └─ Prepared statements                                 │
│                                                          │
│  Layer 8: XSS Protection                                │
│  ├─ Input sanitization                                  │
│  └─ Output encoding                                     │
│                                                          │
│  Layer 9: Error Handling                                │
│  ├─ No sensitive data in errors                         │
│  └─ Centralized error middleware                        │
│                                                          │
│  Layer 10: Activity Logging                             │
│  ├─ Audit trail                                         │
│  └─ Action tracking                                     │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 📧 Email Notification Flow

```
┌─────────────────────────────────────────────────────────┐
│              EMAIL NOTIFICATION SYSTEM                   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Trigger Events:                                        │
│  ┌──────────────────────────────────────────────┐      │
│  │ • Payment Approved                            │      │
│  │ • Payment Declined                            │      │
│  │ • Message Reply                               │      │
│  │ • Waiter Approved                             │      │
│  │ • Reservation Approved/Rejected               │      │
│  │ • Order Confirmation                          │      │
│  └────────────────┬─────────────────────────────┘      │
│                   ▼                                     │
│         ┌──────────────────────┐                       │
│         │   Email Service      │                       │
│         │   (Nodemailer)       │                       │
│         └──────────┬───────────┘                       │
│                    ▼                                    │
│         ┌──────────────────────┐                       │
│         │   Gmail SMTP         │                       │
│         │   Server             │                       │
│         └──────────┬───────────┘                       │
│                    ▼                                    │
│         ┌──────────────────────┐                       │
│         │   Customer Email     │                       │
│         │   Inbox              │                       │
│         └──────────────────────┘                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema Relationships

```
┌─────────────────────────────────────────────────────────┐
│                DATABASE RELATIONSHIPS                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│         ┌──────────┐                                    │
│         │  users   │                                    │
│         └────┬─────┘                                    │
│              │                                          │
│      ┌───────┼───────┬───────┬───────┬───────┐        │
│      │       │       │       │       │       │        │
│      ▼       ▼       ▼       ▼       ▼       ▼        │
│  ┌────────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐      │
│  │payments│ │msgs│ │logs│ │ords│ │resv│ │wait│      │
│  └────────┘ └────┘ └────┘ └──┬─┘ └────┘ └────┘      │
│                               │                        │
│                               ▼                        │
│                          ┌─────────┐                   │
│                          │order_   │                   │
│                          │items    │                   │
│                          └────┬────┘                   │
│                               │                        │
│                               ▼                        │
│                          ┌─────────┐                   │
│                          │menu_    │                   │
│                          │items    │                   │
│                          └────┬────┘                   │
│                               │                        │
│                               ▼                        │
│                          ┌─────────┐                   │
│                          │categor. │                   │
│                          └─────────┘                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                 PRODUCTION DEPLOYMENT                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────┐      │
│  │           Load Balancer (Optional)            │      │
│  └────────────────────┬─────────────────────────┘      │
│                       │                                 │
│         ┌─────────────┼─────────────┐                  │
│         │             │             │                  │
│         ▼             ▼             ▼                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │ Backend  │  │ Backend  │  │ Backend  │            │
│  │Instance 1│  │Instance 2│  │Instance 3│            │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘            │
│       │             │             │                   │
│       └─────────────┼─────────────┘                   │
│                     ▼                                  │
│         ┌──────────────────────┐                      │
│         │   MySQL Database     │                      │
│         │   (Master/Replica)   │                      │
│         └──────────────────────┘                      │
│                                                        │
│  External Services:                                   │
│  ┌──────────────┐  ┌──────────────┐                  │
│  │ Gmail SMTP   │  │ File Storage │                  │
│  │   Server     │  │   (S3/Local) │                  │
│  └──────────────┘  └──────────────┘                  │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

**This architecture supports:**
- ✅ Horizontal scaling
- ✅ High availability
- ✅ Load balancing
- ✅ Database replication
- ✅ Microservices ready
- ✅ Cloud deployment
- ✅ Container orchestration

---

*Architecture designed for Glimpse Restaurant Kigali*
*Version 2.0 - Enhanced Edition*
