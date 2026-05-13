import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaUtensils, FaConciergeBell, FaAward, FaUsers } from "react-icons/fa";

const featured = [
  "https://images.unsplash.com/photo-1555992336-03a23c7b20ee?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=900&q=80"
];

const features = [
  { icon: FaUtensils, title: "Gourmet Cuisine", desc: "Expertly crafted dishes using the finest local and international ingredients" },
  { icon: FaConciergeBell, title: "Premium Service", desc: "Attentive staff dedicated to making your dining experience unforgettable" },
  { icon: FaAward, title: "Award Winning", desc: "Recognized for excellence in culinary innovation and hospitality" },
  { icon: FaUsers, title: "Private Events", desc: "Exclusive spaces for celebrations, corporate events, and special occasions" }
];

const testimonials = [
  { name: "Sarah M.", text: "An absolutely stunning dining experience. The ambiance, food, and service were all exceptional!" },
  { name: "James K.", text: "Glimpse Kigali sets the standard for luxury dining in Rwanda. Every visit is memorable." },
  { name: "Amina R.", text: "From the moment we walked in, we felt like royalty. The attention to detail is remarkable." }
];

export default function HomePage() {
  return (
    <div>
      <section className="bg-hero min-h-[86vh] bg-cover bg-center pt-32 text-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <motion.p initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} className="mb-6 text-sm font-bold uppercase tracking-[0.35em] text-emerald-300">
            Kigali's refined dining destination
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl text-5xl font-black leading-tight md:text-7xl">
            Reserve a Beautiful Table at Glimpse Kigali
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }}
            className="mt-6 max-w-2xl text-lg leading-8 text-white/80"
          >
            Modern luxury dining with elegant ambiance, curated cuisine, and premium table experiences. 
            Discover the art of fine dining in the heart of Kigali.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.4 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Link to="/signup" className="rounded-full bg-softGreen px-8 py-4 text-lg font-bold text-white shadow-xl shadow-black/20 transition hover:bg-emerald-600">Reserve Table</Link>
            <Link to="/menu" className="rounded-full border border-white/40 bg-white/10 px-8 py-4 text-lg font-bold text-white transition hover:bg-white hover:text-forest">Explore Menu</Link>
          </motion.div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-center text-sm font-bold uppercase tracking-widest text-softGreen">Restaurant at a glance</p>
          <h2 className="mb-12 mt-4 text-center text-4xl font-black text-ink">Why Choose Glimpse</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="glass rounded-2xl p-6 text-center"
              >
                <feature.icon className="mx-auto mb-4 text-5xl text-softGreen" />
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-sm leading-6 text-slate-500">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="mb-4 text-center text-4xl font-black text-ink">Featured Dishes</h2>
        <p className="mb-12 text-center text-slate-500">A glimpse into our culinary masterpieces</p>
        <div className="grid gap-6 md:grid-cols-3">
          {featured.map((img, idx) => (
            <motion.img 
              key={img} 
              src={img} 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="h-80 w-full rounded-2xl object-cover shadow-xl shadow-forest/10 transition hover:scale-105" 
            />
          ))}
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-12 text-center text-4xl font-black text-ink">What Our Guests Say</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="glass rounded-2xl p-6"
              >
                <p className="mb-4 italic text-slate-600">"{testimonial.text}"</p>
                <p className="font-semibold text-softGreen">- {testimonial.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-3xl bg-forest p-12 text-center text-white shadow-xl shadow-forest/20">
          <h2 className="mb-4 text-4xl font-black">Reserve Your Table Today</h2>
          <p className="mx-auto mb-8 max-w-2xl text-white/75">
            Experience the finest dining Kigali has to offer. Book your table now and let us create an unforgettable culinary journey for you.
          </p>
          <Link to="/signup" className="inline-block rounded-full bg-softGreen px-10 py-4 text-lg font-bold text-white transition hover:bg-emerald-600">
            Make a Reservation
          </Link>
        </div>
      </section>
    </div>
  );
}
