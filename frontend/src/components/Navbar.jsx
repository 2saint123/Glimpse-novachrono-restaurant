import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { FiMenu, FiX, FiUser, FiLogOut, FiCalendar, FiShoppingBag } from "react-icons/fi";
import { MdRestaurant } from "react-icons/md";
import { useAuth } from "../state/AuthContext";

const links = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Menu", path: "/menu" },
  { name: "Reservations", path: "/reservations" },
  { name: "Contact", path: "/contact" }
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-dark/95 backdrop-blur-md shadow-2xl' : 'bg-transparent'}`}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition"></div>
            <span className="relative grid h-12 w-12 place-items-center rounded-xl bg-gradient text-2xl text-dark">
              <MdRestaurant />
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-gold">GLIMPSE</span>
            <span className="text-[10px] font-semibold tracking-[0.2em] text-accent">KIGALI</span>
          </div>
        </Link>

        <button 
          className="text-3xl text-gold transition hover:text-accent lg:hidden" 
          onClick={() => setOpen((s) => !s)}
          aria-label="Toggle menu"
        >
          {open ? <FiX /> : <FiMenu />}
        </button>

        <div className={`${open ? "flex" : "hidden"} absolute left-0 right-0 top-full mt-2 flex-col gap-2 bg-dark/98 backdrop-blur-lg p-6 shadow-2xl lg:static lg:mt-0 lg:flex lg:flex-row lg:items-center lg:gap-8 lg:bg-transparent lg:p-0 lg:shadow-none`}>
          {links.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink 
                key={item.name} 
                to={item.path} 
                onClick={() => setOpen(false)}
                className={`group relative py-2 text-sm font-semibold uppercase tracking-wider transition ${isActive ? 'text-gold' : 'text-light hover:text-gold'}`}
              >
                {item.name}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient transition-all ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </NavLink>
            );
          })}

          <div className="mt-4 flex items-center gap-4 lg:ml-4 lg:mt-0">
            {!user ? (
              <>
                <Link 
                  to="/login" 
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-lg border border-gold/30 px-5 py-2.5 text-sm font-semibold text-gold transition hover:border-gold hover:bg-gold/10"
                >
                  <FiUser /> Login
                </Link>
                <Link 
                  to="/signup" 
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-lg bg-gradient px-5 py-2.5 text-sm font-bold text-dark shadow-lg shadow-gold/25 transition hover:shadow-gold/40"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 rounded-lg border border-gold/30 px-4 py-2.5 text-sm font-semibold text-gold transition hover:border-gold hover:bg-gold/10"
                >
                  <FiUser />
                  <span className="hidden md:inline">{user.fullName?.split(' ')[0]}</span>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-charcoal border border-gold/20 shadow-2xl">
                    <div className="p-4 border-b border-gold/20">
                      <p className="font-semibold text-gold">{user.fullName}</p>
                      <p className="text-xs text-slate">{user.email}</p>
                      <span className="mt-2 inline-block rounded-full bg-gold/20 px-3 py-1 text-xs font-bold uppercase text-gold">{user.role}</span>
                    </div>
                    <div className="p-2">
                      {user.role === 'customer' && (
                        <>
                          <Link 
                            to="/reservations" 
                            onClick={() => { setShowUserMenu(false); setOpen(false); }}
                            className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-light transition hover:bg-gold/10 hover:text-gold"
                          >
                            <FiCalendar /> My Reservations
                          </Link>
                          <Link 
                            to="/orders" 
                            onClick={() => { setShowUserMenu(false); setOpen(false); }}
                            className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-light transition hover:bg-gold/10 hover:text-gold"
                          >
                            <FiShoppingBag /> My Orders
                          </Link>
                        </>
                      )}
                      {user.role === 'admin' && (
                        <Link 
                          to="/admin" 
                          onClick={() => { setShowUserMenu(false); setOpen(false); }}
                          className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-light transition hover:bg-gold/10 hover:text-gold"
                        >
                          <FiUser /> Admin Dashboard
                        </Link>
                      )}
                      {user.role === 'waiter' && (
                        <Link 
                          to="/waiter" 
                          onClick={() => { setShowUserMenu(false); setOpen(false); }}
                          className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-light transition hover:bg-gold/10 hover:text-gold"
                        >
                          <FiUser /> Waiter Dashboard
                        </Link>
                      )}
                      <button 
                        onClick={() => { logout(); setShowUserMenu(false); setOpen(false); }}
                        className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-red-400 transition hover:bg-red-500/10"
                      >
                        <FiLogOut /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
