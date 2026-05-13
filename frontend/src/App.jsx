import React from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import MenuPage from "./pages/MenuPage";
import ReservationsPage from "./pages/ReservationsPage";
import ContactPage from "./pages/ContactPage";
import AdminPage from "./pages/AdminPage";
import WaiterPage from "./pages/WaiterPage";
import { ForgotPasswordPage, LoginPage, SignUpPage } from "./pages/AuthPages";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/reservations" element={<ProtectedRoute roles={["customer"]}><ReservationsPage /></ProtectedRoute>} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/admin" element={<ProtectedRoute roles={["admin"]}><AdminPage /></ProtectedRoute>} />
        <Route path="/waiter" element={<ProtectedRoute roles={["waiter"]}><WaiterPage /></ProtectedRoute>} />
      </Routes>
      <a href="https://wa.me/250780000000" className="fixed bottom-5 right-5 rounded-full bg-green-500 p-4 text-black">WA</a>
      <Footer />
    </>
  );
}
