import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { FaWhatsapp, FaInstagram, FaFacebook, FaTwitter, FaLinkedin, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaArrowRight } from "react-icons/fa";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="relative mt-20 bg-dark text-light">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-dark/50"></div>
      
      <div className="relative mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link to="/" className="mb-6 flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition"></div>
                <span className="relative grid h-14 w-14 place-items-center rounded-xl bg-gradient text-2xl font-black text-dark">G</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-gold">GLIMPSE</span>
                <span className="text-xs font-semibold tracking-[0.2em] text-accent">KIGALI</span>
              </div>
            </Link>
            <p className="mb-6 text-sm leading-relaxed text-slate">
              Experience the pinnacle of luxury dining in the heart of Kigali. Where culinary excellence meets exceptional service, creating unforgettable moments.
            </p>
            <div className="flex gap-3">
              <a href="https://instagram.com/glimpsekigali" target="_blank" rel="noopener noreferrer" className="grid h-10 w-10 place-items-center rounded-lg bg-charcoal text-gold transition hover:bg-gradient hover:text-dark" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="https://facebook.com/glimpsekigali" target="_blank" rel="noopener noreferrer" className="grid h-10 w-10 place-items-center rounded-lg bg-charcoal text-gold transition hover:bg-gradient hover:text-dark" aria-label="Facebook">
                <FaFacebook />
              </a>
              <a href="https://twitter.com/glimpsekigali" target="_blank" rel="noopener noreferrer" className="grid h-10 w-10 place-items-center rounded-lg bg-charcoal text-gold transition hover:bg-gradient hover:text-dark" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="https://linkedin.com/company/glimpsekigali" target="_blank" rel="noopener noreferrer" className="grid h-10 w-10 place-items-center rounded-lg bg-charcoal text-gold transition hover:bg-gradient hover:text-dark" aria-label="LinkedIn">
                <FaLinkedin />
              </a>
              <a href="https://wa.me/250780000000" target="_blank" rel="noopener noreferrer" className="grid h-10 w-10 place-items-center rounded-lg bg-charcoal text-gold transition hover:bg-gradient hover:text-dark" aria-label="WhatsApp">
                <FaWhatsapp />
              </a>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="mb-6 text-sm font-bold uppercase tracking-wider text-gold">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><NavLink to="/" className={({ isActive }) => `transition hover:text-gold ${isActive ? 'text-gold' : 'text-slate'}`}>Home</NavLink></li>
              <li><NavLink to="/about" className={({ isActive }) => `transition hover:text-gold ${isActive ? 'text-gold' : 'text-slate'}`}>About Us</NavLink></li>
              <li><NavLink to="/menu" className={({ isActive }) => `transition hover:text-gold ${isActive ? 'text-gold' : 'text-slate'}`}>Our Menu</NavLink></li>
              <li><NavLink to="/reservations" className={({ isActive }) => `transition hover:text-gold ${isActive ? 'text-gold' : 'text-slate'}`}>Reservations</NavLink></li>
              <li><NavLink to="/contact" className={({ isActive }) => `transition hover:text-gold ${isActive ? 'text-gold' : 'text-slate'}`}>Contact</NavLink></li>
              <li><NavLink to="/login" className={({ isActive }) => `transition hover:text-gold ${isActive ? 'text-gold' : 'text-slate'}`}>Login</NavLink></li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="mb-6 text-sm font-bold uppercase tracking-wider text-gold">Contact Info</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 text-gold" />
                <span className="text-slate">KN 4 Ave, Kigali<br />Kigali City, Rwanda</span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhone className="text-gold" />
                <a href="tel:+250780000000" className="text-slate transition hover:text-gold">+250 780 000 000</a>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-gold" />
                <a href="mailto:info@glimpsekigali.rw" className="text-slate transition hover:text-gold">info@glimpsekigali.rw</a>
              </li>
            </ul>

            <div className="mt-6">
              <h5 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gold">
                <FaClock /> Opening Hours
              </h5>
              <div className="space-y-2 text-sm text-slate">
                <p><span className="font-semibold text-light">Mon - Fri:</span> 11:00 AM - 11:00 PM</p>
                <p><span className="font-semibold text-light">Sat - Sun:</span> 10:00 AM - 12:00 AM</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h4 className="mb-6 text-sm font-bold uppercase tracking-wider text-gold">Newsletter</h4>
            <p className="mb-4 text-sm text-slate">Subscribe to receive exclusive offers, updates, and culinary insights.</p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full rounded-lg border border-gold/20 bg-charcoal px-4 py-3 text-sm text-light placeholder-slate outline-none transition focus:border-gold"
                  required
                />
              </div>
              <button 
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient px-4 py-3 text-sm font-bold text-dark shadow-lg shadow-gold/25 transition hover:shadow-gold/40"
              >
                Subscribe <FaArrowRight />
              </button>
              {subscribed && (
                <p className="text-sm font-semibold text-gold">✓ Successfully subscribed!</p>
              )}
            </form>
          </div>
        </div>

        <div className="mt-12 border-t border-gold/10 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-slate md:flex-row">
            <p>&copy; {new Date().getFullYear()} Glimpse Restaurant Kigali. All rights reserved.</p>
            <div className="flex gap-6">
              <NavLink to="/privacy" className={({ isActive }) => `transition hover:text-gold ${isActive ? 'text-gold' : ''}`}>Privacy Policy</NavLink>
              <NavLink to="/terms" className={({ isActive }) => `transition hover:text-gold ${isActive ? 'text-gold' : ''}`}>Terms of Service</NavLink>
              <NavLink to="/careers" className={({ isActive }) => `transition hover:text-gold ${isActive ? 'text-gold' : ''}`}>Careers</NavLink>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient"></div>
    </footer>
  );
}
