import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowRight, FiCheckCircle, FiLock, FiMail, FiPhone, FiUser } from "react-icons/fi";
import api from "../services/api";
import { useAuth } from "../state/AuthContext";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = await login(form);
      navigate(user.role === "admin" ? "/admin" : user.role === "waiter" ? "/waiter" : "/reservations");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your details.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-authBg bg-cover bg-center px-6 pb-16 pt-32">
      <form onSubmit={submit} className="mx-auto max-w-md space-y-4 rounded-3xl bg-dark/90 backdrop-blur-md p-8 shadow-2xl border border-gold/30">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-gold">Welcome back</p>
          <h1 className="mt-2 text-3xl font-black text-light">Login</h1>
        </div>
        {error && <p className="rounded-2xl bg-red-500/20 p-3 text-sm font-semibold text-red-400">{error}</p>}
        <input
          className="w-full rounded-2xl border border-gold/30 bg-charcoal p-4 text-light placeholder-slate outline-none focus:border-gold"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          className="w-full rounded-2xl border border-gold/30 bg-charcoal p-4 text-light placeholder-slate outline-none focus:border-gold"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button 
          disabled={submitting} 
          className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient px-6 py-4 font-bold text-dark shadow-lg shadow-gold/30 transition hover:shadow-gold/50 hover:scale-105 disabled:opacity-60 disabled:hover:scale-100"
        >
          {submitting ? "Logging in..." : "Login"} <FiArrowRight />
        </button>
        <div className="flex items-center justify-between text-sm">
          <Link to="/forgot-password" className="font-bold text-gold hover:text-accent transition">
            Forgot password?
          </Link>
          <Link to="/signup" className="font-bold text-gold hover:text-accent transition">
            Create Account
          </Link>
        </div>
      </form>
    </main>
  );
}

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState("email");
  const [form, setForm] = useState({ email: "", code: "", newPassword: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const requestCode = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);
    try {
      const { data } = await api.post("/auth/forgot-password", { email: form.email });
      setMessage(data.message || "Reset code sent. Check your email.");
      setStep("reset");
    } catch (err) {
      setError(err.response?.data?.message || "Could not send reset code. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);
    try {
      const { data } = await api.post("/auth/reset-password", form);
      setMessage(data.message || "Password reset successfully.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Could not reset password. Check the code and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-authBg bg-cover bg-center px-6 pb-16 pt-32">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[2rem] bg-dark/90 backdrop-blur-md shadow-2xl border border-gold/30 lg:grid-cols-[0.85fr_1.15fr]">
        <section className="bg-gradient p-8 text-dark md:p-12">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-dark/80">Secure recovery</p>
          <h1 className="mt-6 text-4xl font-black leading-tight">Reset your password</h1>
          <p className="mt-5 text-dark/75">
            Enter your account email. We will send a six-digit login code that expires after 15 minutes.
          </p>
        </section>

        <form onSubmit={step === "email" ? requestCode : resetPassword} className="space-y-5 p-8 md:p-12">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-gold">
              {step === "email" ? "Request code" : "Enter code"}
            </p>
            <h2 className="mt-2 text-3xl font-black text-light">Forgot Password</h2>
          </div>

          {error && <p className="rounded-2xl bg-red-500/20 p-3 text-sm font-semibold text-red-400">{error}</p>}
          {message && <p className="rounded-2xl bg-emerald-500/20 p-3 text-sm font-semibold text-emerald-400">{message}</p>}

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate">Email</span>
            <div className="flex items-center gap-3 rounded-2xl border border-gold/30 bg-charcoal px-4 focus-within:border-gold">
              <FiMail className="text-gold" />
              <input
                className="w-full bg-transparent py-4 text-light placeholder-slate outline-none"
                placeholder="you@example.com"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
          </label>

          {step === "reset" && (
            <>
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate">Email code</span>
                <input
                  className="w-full rounded-2xl border border-gold/30 bg-charcoal p-4 text-light placeholder-slate outline-none focus:border-gold"
                  placeholder="6-digit code"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate">New password</span>
                <div className="flex items-center gap-3 rounded-2xl border border-gold/30 bg-charcoal px-4 focus-within:border-gold">
                  <FiLock className="text-gold" />
                  <input
                    className="w-full bg-transparent py-4 text-light placeholder-slate outline-none"
                    type="password"
                    placeholder="At least 6 characters"
                    value={form.newPassword}
                    onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                    minLength={6}
                    required
                  />
                </div>
              </label>
            </>
          )}

          <button 
            disabled={submitting} 
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient p-4 font-bold text-dark shadow-lg shadow-gold/30 transition hover:shadow-gold/50 hover:scale-105 disabled:opacity-60"
          >
            {submitting ? "Please wait..." : step === "email" ? "Send Code" : "Reset Password"} <FiArrowRight />
          </button>

          <p className="text-center text-sm text-slate">
            Remembered it? <Link to="/login" className="font-bold text-gold hover:text-accent transition">Login</Link>
          </p>
        </form>
      </div>
    </main>
  );
}

export function SignUpPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "", role: "customer" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      const data = await register(form);
      if (form.role === "waiter") {
        setSuccess(data.message || "Your waiter request was submitted. Please wait for admin approval.");
        return;
      }
      navigate("/reservations");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please confirm the backend is running.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-authBg bg-cover bg-center px-6 pb-16 pt-32">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] bg-dark/90 backdrop-blur-md shadow-2xl border border-gold/30 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="bg-gradient p-8 text-dark md:p-12">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-dark/80">Glimpse Kigali</p>
          <h1 className="mt-6 text-4xl font-black leading-tight md:text-5xl">Create your dining account</h1>
          <p className="mt-5 max-w-md text-dark/75">
            Book tables, place orders, and manage your restaurant experience from one polished guest profile.
          </p>
          <div className="mt-10 space-y-4">
            {["Reserve tables faster", "Track your approved bookings", "Order from the digital menu"].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-dark/20">
                  <FiCheckCircle />
                </span>
                <span className="font-semibold">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <form onSubmit={submit} className="space-y-5 p-8 md:p-12">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-gold">Account setup</p>
            <h2 className="mt-2 text-3xl font-black text-light">Register</h2>
          </div>

          {error && <p className="rounded-2xl bg-red-500/20 p-3 text-sm font-semibold text-red-400">{error}</p>}
          {success && <p className="rounded-2xl bg-emerald-500/20 p-3 text-sm font-semibold text-emerald-400">{success}</p>}

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate">Full name</span>
            <div className="flex items-center gap-3 rounded-2xl border border-gold/30 bg-charcoal px-4 focus-within:border-gold">
              <FiUser className="text-gold" />
              <input
                className="w-full bg-transparent py-4 text-light placeholder-slate outline-none"
                placeholder="Your full name"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                required
              />
            </div>
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate">Email</span>
              <div className="flex items-center gap-3 rounded-2xl border border-gold/30 bg-charcoal px-4 focus-within:border-gold">
                <FiMail className="text-gold" />
                <input
                  className="w-full bg-transparent py-4 text-light placeholder-slate outline-none"
                  placeholder="you@example.com"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate">Phone</span>
              <div className="flex items-center gap-3 rounded-2xl border border-gold/30 bg-charcoal px-4 focus-within:border-gold">
                <FiPhone className="text-gold" />
                <input
                  className="w-full bg-transparent py-4 text-light placeholder-slate outline-none"
                  placeholder="0780000000"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate">Password</span>
              <div className="flex items-center gap-3 rounded-2xl border border-gold/30 bg-charcoal px-4 focus-within:border-gold">
                <FiLock className="text-gold" />
                <input
                  className="w-full bg-transparent py-4 text-light placeholder-slate outline-none"
                  type="password"
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  minLength={6}
                  required
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate">Account type</span>
              <select
                className="w-full rounded-2xl border border-gold/30 bg-charcoal p-4 text-light outline-none focus:border-gold"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="customer">Customer</option>
                <option value="waiter">Waiter registration</option>
              </select>
            </label>
          </div>

          <button 
            disabled={submitting} 
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient px-6 py-4 font-bold text-dark shadow-lg shadow-gold/30 transition hover:shadow-gold/50 hover:scale-105 disabled:opacity-60 disabled:hover:scale-100"
          >
            {submitting ? "Creating account..." : "Create Account"} <FiArrowRight />
          </button>

          <p className="text-center text-sm text-slate">
            Already have an account? <Link to="/login" className="font-bold text-gold hover:text-accent transition">Login</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
