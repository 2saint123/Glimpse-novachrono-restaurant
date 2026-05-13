import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaWhatsapp, FaInstagram, FaFacebook, FaTwitter, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from "react-icons/fa";

export default function Footer() {
  const location = useLocation();

  return (
    <footer className="mt-20 border-t border-zinc-800 bg-black/90 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-2xl font-bold text-softGreen">GLIMPSE KIGALI</h3>
            <p className="mb-4 text-sm text-zinc-300">Experience the pinnacle of luxury dining in the heart of Kigali. Where culinary excellence meets exceptional service.</p>
            <div className="flex gap-4 text-2xl">
              <a href="https://instagram.com/glimpsekigali" target="_blank" rel="noopener noreferrer" className="text-zinc-400 transition hover:text-softGreen" aria-label="Instagram"><FaInstagram /></a>
              <a href="https://facebook.com/glimpsekigali" target="_blank" rel="noopener noreferrer" className="text-zinc-400 transition hover:text-softGreen" aria-label="Facebook"><FaFacebook /></a>
              <a href="https://twitter.com/glimpsekigali" target="_blank" rel="noopener noreferrer" className="text-zinc-400 transition hover:text-softGreen" aria-label="Twitter"><FaTwitter /></a>
              <a href="https://wa.me/250780000000" target="_blank" rel="noopener noreferrer" className="text-zinc-400 transition hover:text-softGreen" aria-label="WhatsApp"><FaWhatsapp /></a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold text-softGreen">Quick Links</h4>
            <ul className="space-y-2 text-sm text-zinc-300">
              <li>
                <NavLink to="/" className="relative inline-block transition hover:text-softGreen">
                  Home
                  {location.pathname === "/" && <span className="ml-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-softGreen shadow-lg shadow-softGreen"></span>}
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" className="relative inline-block transition hover:text-softGreen">
                  About Us
                  {location.pathname === "/about" && <span className="ml-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-softGreen shadow-lg shadow-softGreen"></span>}
                </NavLink>
              </li>
              <li>
                <NavLink to="/menu" className="relative inline-block transition hover:text-softGreen">
                  Our Menu
                  {location.pathname === "/menu" && <span className="ml-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-softGreen shadow-lg shadow-softGreen"></span>}
                </NavLink>
              </li>
              <li>
                <NavLink to="/reservations" className="relative inline-block transition hover:text-softGreen">
                  Reservations
                  {location.pathname === "/reservations" && <span className="ml-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-softGreen shadow-lg shadow-softGreen"></span>}
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" className="relative inline-block transition hover:text-softGreen">
                  Contact
                  {location.pathname === "/contact" && <span className="ml-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-softGreen shadow-lg shadow-softGreen"></span>}
                </NavLink>
              </li>
              <li>
                <NavLink to="/login" className="relative inline-block transition hover:text-softGreen">
                  Login
                  {location.pathname === "/login" && <span className="ml-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-softGreen shadow-lg shadow-softGreen"></span>}
                </NavLink>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold text-softGreen">Contact Info</h4>
            <ul className="space-y-3 text-sm text-zinc-300">
              <li className="flex items-start gap-2">
                <FaMapMarkerAlt className="mt-1 text-softGreen" />
                <span>KN 4 Ave, Kigali<br />Kigali City, Rwanda</span>
              </li>
              <li className="flex items-center gap-2">
                <FaPhone className="text-softGreen" />
                <a href="tel:+250780000000" className="transition hover:text-softGreen">+250 780 000 000</a>
              </li>
              <li className="flex items-center gap-2">
                <FaEnvelope className="text-softGreen" />
                <a href="mailto:info@glimpsekigali.rw" className="transition hover:text-softGreen">info@glimpsekigali.rw</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-lg font-semibold text-softGreen">Opening Hours</h4>
            <ul className="space-y-2 text-sm text-zinc-300">
              <li className="flex items-start gap-2">
                <FaClock className="mt-1 text-softGreen" />
                <div>
                  <p className="font-semibold">Monday - Friday</p>
                  <p>11:00 AM - 11:00 PM</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <FaClock className="mt-1 text-softGreen" />
                <div>
                  <p className="font-semibold">Saturday - Sunday</p>
                  <p>10:00 AM - 12:00 AM</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-zinc-800 pt-6 text-center text-sm text-zinc-400">
          <p>&copy; {new Date().getFullYear()} Glimpse Restaurant Kigali. All rights reserved.</p>
          <p className="mt-2">
            <NavLink to="/privacy" className={({ isActive }) => `transition hover:text-softGreen ${isActive ? 'text-softGreen' : ''}`}>Privacy Policy</NavLink>
            {" | "}
            <NavLink to="/terms" className={({ isActive }) => `transition hover:text-softGreen ${isActive ? 'text-softGreen' : ''}`}>Terms of Service</NavLink>
          </p>
        </div>
      </div>
    </footer>
  );
}
