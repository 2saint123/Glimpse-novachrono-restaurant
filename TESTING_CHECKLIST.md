# ✅ Testing Checklist - Glimpse Restaurant Backend

## 🎯 Pre-Testing Setup

- [ ] MySQL server is running
- [ ] Database schema imported (`ENHANCED_DATABASE_SCHEMA.sql`)
- [ ] Backend dependencies installed (`npm install`)
- [ ] `.env` file configured correctly
- [ ] Backend server started (`npm run dev`)
- [ ] Postman collection imported
- [ ] Admin credentials ready (rwetoussanthony@gmail.com / 2saint123)

---

## 🔐 Authentication Tests

### Register User
- [ ] Register as customer (success)
- [ ] Register with duplicate email (should fail)
- [ ] Register with invalid email format (should fail)
- [ ] Register with missing fields (should fail)
- [ ] Register as waiter (pending status)

### Login
- [ ] Login with admin credentials (success)
- [ ] Login with customer credentials (success)
- [ ] Login with wrong password (should fail)
- [ ] Login with non-existent email (should fail)
- [ ] Verify JWT token received

### Profile Management
- [ ] Get current user profile
- [ ] Update profile information
- [ ] Change password (success)
- [ ] Change password with wrong current password (should fail)

---

## 💳 Payment System Tests

### Create Payment
- [ ] Create payment as customer (success)
- [ ] Create payment without authentication (should fail)
- [ ] Create payment with invalid order_id (should fail)
- [ ] Create payment with negative amount (should fail)
- [ ] Create payment with missing fields (should fail)

### View Payments
- [ ] Admin view all payments (success)
- [ ] Customer view own payments (success)
- [ ] Customer cannot view all payments (should fail)
- [ ] Filter payments by status (pending/approved/declined)
- [ ] Search payments by customer name
- [ ] Filter by date range
- [ ] Test pagination (page 1, 2, etc.)

### Approve Payment
- [ ] Admin approve pending payment (success)
- [ ] Check email notification sent
- [ ] Verify order payment_status updated to 'paid'
- [ ] Verify activity log created
- [ ] Try to approve already processed payment (should fail)
- [ ] Customer cannot approve payment (should fail)

### Decline Payment
- [ ] Admin decline pending payment with reason (success)
- [ ] Check email notification sent with reason
- [ ] Verify activity log created
- [ ] Try to decline without reason (should fail)
- [ ] Try to decline with short reason (<10 chars) (should fail)
- [ ] Try to decline already processed payment (should fail)

### Upload Receipt
- [ ] Upload valid image file (success)
- [ ] Upload PDF file (success)
- [ ] Try to upload without file (should fail)
- [ ] Verify file saved in uploads folder
- [ ] Verify receipt_url updated in database

---

## 💬 Message System Tests

### Send Message
- [ ] Send message without authentication (success - public)
- [ ] Send message with authentication (success)
- [ ] Send message with all fields (success)
- [ ] Send message with missing fields (should fail)
- [ ] Send message with invalid email (should fail)
- [ ] Verify message saved in database

### View Messages
- [ ] Admin view all messages (success)
- [ ] Customer cannot view messages (should fail)
- [ ] Filter by read status (is_read=true/false)
- [ ] Search by name/email/subject
- [ ] Filter by date range
- [ ] Test pagination
- [ ] Verify unread count displayed

### Mark as Read
- [ ] Admin mark message as read (success)
- [ ] Verify is_read updated to 1
- [ ] Verify activity log created
- [ ] Customer cannot mark as read (should fail)

### Reply to Message
- [ ] Admin reply to message (success)
- [ ] Check email sent to customer
- [ ] Verify reply saved in database
- [ ] Verify replied_by and replied_at set
- [ ] Verify message auto-marked as read
- [ ] Try to reply without message (should fail)
- [ ] Try to reply with short message (<10 chars) (should fail)

### Delete Message
- [ ] Admin delete message (success)
- [ ] Verify deleted_at timestamp set (soft delete)
- [ ] Verify message not in list queries
- [ ] Verify activity log created

---

## 📊 Analytics Tests

### Dashboard Analytics
- [ ] Admin view dashboard (success)
- [ ] Verify total_revenue calculated correctly
- [ ] Verify pending_payments count
- [ ] Verify unread_messages count
- [ ] Verify total_orders count
- [ ] Verify total_customers count
- [ ] Verify pending_reservations count
- [ ] Check revenue_by_month data
- [ ] Check recent_payments list
- [ ] Check recent_activities list
- [ ] Check payment_status breakdown

### Sales Analytics
- [ ] Get sales analytics (success)
- [ ] Filter by date range
- [ ] Verify sales_by_category data
- [ ] Verify top_items list
- [ ] Verify daily_sales data
- [ ] Test with different date ranges

### Activity Logs
- [ ] View activity logs (success)
- [ ] Filter by action type
- [ ] Filter by entity_type
- [ ] Filter by user_id
- [ ] Test pagination
- [ ] Verify all logged actions present

---

## 🍽️ Menu Tests

### View Menu
- [ ] Get all menu items (success)
- [ ] Filter by category
- [ ] Search menu items
- [ ] Get categories list

### Manage Menu (Admin)
- [ ] Create menu item (success)
- [ ] Create with image upload
- [ ] Update menu item
- [ ] Delete menu item (soft delete)
- [ ] Customer cannot create menu item (should fail)

---

## 📅 Reservation Tests

### Create Reservation
- [ ] Check table availability (success)
- [ ] Create reservation (success)
- [ ] View own reservations
- [ ] Cancel reservation
- [ ] Try to reserve unavailable table (should fail)

### Manage Reservations (Admin)
- [ ] View all reservations
- [ ] Approve reservation (success)
- [ ] Reject reservation (success)
- [ ] Check email notifications sent

---

## 🛒 Order Tests

### Create Order
- [ ] Create order with items (success)
- [ ] Verify subtotal calculated
- [ ] Verify tax calculated
- [ ] Verify total calculated
- [ ] View own orders

### Manage Orders
- [ ] Waiter view assigned orders
- [ ] Update order status (waiter)
- [ ] Admin view all orders
- [ ] Admin update order status
- [ ] Get order details

---

## 👨💼 Admin Tests

### Dashboard
- [ ] View admin dashboard (success)
- [ ] Check all statistics present
- [ ] View analytics with different periods

### Customer Management
- [ ] List all customers
- [ ] View customer details
- [ ] Check customer order history
- [ ] Check customer reservations

### Waiter Management
- [ ] List waiters
- [ ] Approve waiter (success)
- [ ] Check email sent with temp password
- [ ] Reject waiter
- [ ] Verify status updated

### Table Management
- [ ] List all tables
- [ ] Update table status
- [ ] Verify status changed

---

## 🔒 Security Tests

### Rate Limiting
- [ ] Make 100 requests quickly (should succeed)
- [ ] Make 101st request (should return 429)
- [ ] Wait 15 minutes and try again (should succeed)

### Authentication
- [ ] Access protected route without token (should fail - 401)
- [ ] Access protected route with invalid token (should fail - 401)
- [ ] Access admin route as customer (should fail - 403)
- [ ] Access admin route as waiter (should fail - 403)

### Input Validation
- [ ] Send invalid email format (should fail - 400)
- [ ] Send negative numbers where positive required (should fail - 400)
- [ ] Send missing required fields (should fail - 400)
- [ ] Send SQL injection attempt (should be prevented)
- [ ] Send XSS attempt (should be sanitized)

### Soft Delete
- [ ] Delete payment (verify deleted_at set)
- [ ] Delete message (verify deleted_at set)
- [ ] Verify deleted items not in queries
- [ ] Verify data still in database

---

## 📧 Email Notification Tests

### Payment Emails
- [ ] Payment approved email received
- [ ] Payment declined email received with reason
- [ ] Email contains correct information

### Message Emails
- [ ] Message reply email received
- [ ] Email contains admin's reply
- [ ] Email formatted correctly

### Reservation Emails
- [ ] Reservation approved email received
- [ ] Reservation rejected email received

### Waiter Emails
- [ ] Waiter approval email received
- [ ] Email contains temporary password

---

## 📦 File Upload Tests

### Receipt Upload
- [ ] Upload JPG image (success)
- [ ] Upload PNG image (success)
- [ ] Upload PDF file (success)
- [ ] Try to upload large file >5MB (should fail)
- [ ] Try to upload invalid file type (should fail)
- [ ] Verify file saved in uploads folder
- [ ] Verify file accessible via URL

---

## 🔍 Search & Filter Tests

### Payment Search
- [ ] Search by customer name (partial match)
- [ ] Search by email (partial match)
- [ ] Filter by status
- [ ] Filter by date range
- [ ] Combine search and filters

### Message Search
- [ ] Search by name
- [ ] Search by email
- [ ] Search by subject
- [ ] Filter by read status
- [ ] Filter by date range

### Order Filter
- [ ] Filter by status
- [ ] Filter by payment status
- [ ] Filter by date

---

## 📄 Pagination Tests

### Payments Pagination
- [ ] Get page 1 with limit 10
- [ ] Get page 2 with limit 10
- [ ] Verify total count correct
- [ ] Verify pages count correct
- [ ] Test with different limit values

### Messages Pagination
- [ ] Test pagination with different page sizes
- [ ] Verify pagination metadata

### Activity Logs Pagination
- [ ] Test with large dataset
- [ ] Verify performance

---

## 🐛 Error Handling Tests

### Database Errors
- [ ] Test with invalid order_id (foreign key)
- [ ] Test with duplicate entry
- [ ] Test with database connection error

### Validation Errors
- [ ] Test all validation rules
- [ ] Verify error messages clear
- [ ] Verify 400 status code returned

### Authorization Errors
- [ ] Test unauthorized access
- [ ] Verify 401 status code
- [ ] Test forbidden access
- [ ] Verify 403 status code

### Not Found Errors
- [ ] Access non-existent resource
- [ ] Verify 404 status code
- [ ] Access invalid route

---

## 📊 Performance Tests

### Response Time
- [ ] All endpoints respond < 1 second
- [ ] Pagination queries optimized
- [ ] Search queries fast

### Database
- [ ] Check query execution time
- [ ] Verify indexes used
- [ ] Check connection pool working

---

## ✅ Final Checks

### Documentation
- [ ] All endpoints documented
- [ ] Examples provided
- [ ] Setup guide complete

### Code Quality
- [ ] No console errors
- [ ] No warnings
- [ ] Clean code structure

### Production Ready
- [ ] Environment variables used
- [ ] Secrets not in code
- [ ] Error handling complete
- [ ] Logging implemented

---

## 🎯 Test Results Summary

**Total Tests**: 150+

**Categories**:
- Authentication: 10 tests
- Payments: 20 tests
- Messages: 15 tests
- Analytics: 10 tests
- Menu: 8 tests
- Reservations: 8 tests
- Orders: 8 tests
- Admin: 15 tests
- Security: 15 tests
- Email: 8 tests
- File Upload: 6 tests
- Search & Filter: 12 tests
- Pagination: 8 tests
- Error Handling: 10 tests
- Performance: 5 tests
- Final Checks: 8 tests

---

## 📝 Notes

- Use Postman collection for easier testing
- Save admin token after login
- Check email inbox for notifications
- Monitor console for errors
- Check database after each test
- Verify activity logs created

---

## 🎉 Success Criteria

✅ All authentication tests pass
✅ All payment workflows work
✅ All message workflows work
✅ All analytics display correctly
✅ All security features active
✅ All emails sent successfully
✅ All validations working
✅ All error handling correct
✅ Performance acceptable
✅ Documentation complete

**When all tests pass, your backend is production-ready!** 🚀
