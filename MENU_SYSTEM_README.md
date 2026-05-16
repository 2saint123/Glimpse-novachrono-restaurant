# GLIMPSE RESTAURANT - Modern Luxury Menu System

Complete fullstack restaurant menu application using React.js, Node.js, Express.js, MySQL, and Tailwind CSS.

## 🎯 Features

- Dynamic menu fetching from MySQL database
- Category filtering (All, Foods, Drinks, Desserts)
- Beautiful responsive cards with images
- Luxury design (Black, Gold, White theme)
- Smooth animations and hover effects
- Professional navbar
- Loading states
- Mobile responsive
- Ready for admin CRUD dashboard

## 📁 Project Structure

```
glimpse-restaurant-menu/
├── frontend/                 # React application
│   ├── public/
│   │   └── images/          # Menu item images
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── MenuCard.jsx
│   │   │   ├── CategoryFilter.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── pages/
│   │   │   └── MenuPage.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── backend/                  # Node.js + Express API
│   ├── config/
│   │   └── database.js      # MySQL connection
│   ├── controllers/
│   │   └── menuController.js
│   ├── routes/
│   │   └── menuRoutes.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── database/
    └── schema.sql           # Database structure + sample data
```

## 🚀 Installation & Setup

### 1. Prerequisites

- Node.js (v16 or higher)
- MySQL (v8 or higher)
- npm or yarn

### 2. Database Setup

1. Open MySQL Workbench or command line
2. Create database:
```sql
CREATE DATABASE glimpse_restaurant;
```

3. Run the schema.sql file (provided below)

### 3. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=glimpse_restaurant
```

Start backend:
```bash
npm run dev
```

Backend runs on: http://localhost:5000

### 4. Frontend Setup

```bash
cd frontend
npm install
```

Start frontend:
```bash
npm run dev
```

Frontend runs on: http://localhost:5173

## 📦 Dependencies

### Backend
- express
- mysql2
- cors
- dotenv
- nodemon (dev)

### Frontend
- react
- react-dom
- axios
- react-router-dom
- tailwindcss
- vite

## 🎨 Design Features

- **Colors**: Black (#0a0a0a), Gold (#d4af37), White (#f8f6f3)
- **Animations**: Smooth hover effects, scale transforms
- **Typography**: Modern luxury fonts
- **Layout**: Responsive grid system
- **Cards**: Glass morphism effect with shadows

## 🔌 API Endpoints

```
GET  /api/menu              - Get all menu items
GET  /api/menu/categories   - Get all categories
GET  /api/menu?category=id  - Filter by category
```

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔮 Future Features (Ready for)

- Admin dashboard for CRUD operations
- Image upload functionality
- Search functionality
- Price range filters
- User authentication
- Order system integration

## 🎯 How to Use

1. Start MySQL server
2. Run backend: `cd backend && npm run dev`
3. Run frontend: `cd frontend && npm run dev`
4. Open browser: http://localhost:5173
5. Browse menu, filter by categories, enjoy!

## 📸 Adding Menu Images

Place images in `frontend/public/images/` folder:
- breakfast-1.jpg
- lunch-1.jpg
- dinner-1.jpg
- drinks-1.jpg
- dessert-1.jpg

## 🛠️ Troubleshooting

**Backend won't start:**
- Check MySQL is running
- Verify .env credentials
- Check port 5000 is available

**Frontend won't connect:**
- Ensure backend is running first
- Check API URL in api.js
- Verify CORS is enabled

**Database errors:**
- Run schema.sql again
- Check database name matches .env
- Verify MySQL user permissions

## 📝 Notes

- All prices in RWF (Rwandan Francs)
- Images are served from public folder
- API uses RESTful conventions
- Code is beginner-friendly with comments
- Ready for production deployment

## 🎓 Learning Resources

This project demonstrates:
- React hooks (useState, useEffect)
- API integration with Axios
- MySQL database design
- Express.js routing
- Tailwind CSS styling
- Component-based architecture

---

Built with ❤️ for Glimpse Restaurant Kigali
