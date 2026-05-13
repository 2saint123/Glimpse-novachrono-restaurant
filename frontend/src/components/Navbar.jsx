import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { useAuth } from "../state/AuthContext";

const links = ["Home", "About", "Menu", "Contact"];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-4 z-50 w-full px-4">
      <nav className={`mx-auto flex max-w-6xl items-center justify-between rounded-full bg-white/95 px-5 py-3 text-sm text-slate-600 shadow-xl shadow-forest/15 transition ${scrolled ? "scale-[0.99]" : ""}`}>
        <Link to="/" className="flex items-center gap-2 font-bold tracking-tight text-forest">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-softGreen text-white">G</span>
          Glimpse
        </Link>
        <button className="text-2xl text-forest md:hidden" onClick={() => setOpen((s) => !s)}>{open ? <FiX /> : <FiMenu />}</button>
        <div className={`${open ? "flex" : "hidden"} absolute left-4 right-4 top-16 flex-col rounded-2xl bg-white p-4 shadow-xl md:static md:flex md:flex-row md:items-center md:gap-6 md:bg-transparent md:p-0 md:shadow-none`}>
          {links.map((item) => {
            const path = item === "Home" ? "/" : `/${item.toLowerCase()}`;
            const isActive = location.pathname === path;
            return (
              <NavLink 
                key={item} 
                to={path} 
                className={`relative py-2 font-semibold transition hover:text-softGreen ${isActive ? 'text-softGreen' : ''}`}
              >
                {item}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-softGreen"></span>
                )}
              </NavLink>
            );
          })}
          {!user ? (
            <>
              <Link to="/login" className="font-semibold hover:text-softGreen">Login</Link>
              <Link to="/signup" className="rounded-full bg-softGreen px-5 py-2 font-bold text-white shadow-lg shadow-softGreen/25">Create Account</Link>
            </>
          ) : (
            <button onClick={logout} className="rounded-full border border-red-200 px-4 py-2 font-semibold text-red-500">Logout</button>
          )}
        </div>
      </nav>
    </header>
  );
}
