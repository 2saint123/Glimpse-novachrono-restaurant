import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaUtensils, FaConciergeBell, FaAward, FaUsers, FaStar } from "react-icons/fa";

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
  { name: "Sarah M.", text: "An absolutely stunning dining experience. The ambiance, food, and service were all exceptional!", rating: 5 },
  { name: "James K.", text: "Glimpse Kigali sets the standard for luxury dining in Rwanda. Every visit is memorable.", rating: 5 },
  { name: "Amina R.", text: "From the moment we walked in, we felt like royalty. The attention to detail is remarkable.", rating: 5 }
];

const stats = [
  { number: "10+", label: "Years Experience" },
  { number: "50+", label: "Expert Chefs" },
  { number: "10K+", label: "Happy Customers" },
  { number: "100+", label: "Menu Items" }
];

export default function HomePage() {
  return (
    <div className="bg-dark">
      <section className="relative min-h-screen bg-hero bg-cover bg-center pt-24">
        <div className="absolute inset-0 bg-gradient-to-b from-dark/80 via-dark/60 to-dark"></div>
        <div className="relative mx-auto max-w-7xl px-6 py-32">
          <motion.p 
            initial={{ opacity: 0, y: 25 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="mb-6 text-sm font-bold uppercase tracking-[0.35em] text-gold"
          >
            Kigali's Premier Dining Destination
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 35 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="max-w-4xl text-5xl font-black leading-tight text-light md:text-7xl"
          >
            Experience Luxury Dining at <span className="text-gold">Glimpse Kigali</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }}
            className="mt-6 max-w-2xl text-lg leading-8 text-slate"
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
            <Link to="/reservations" className="rounded-full bg-gradient px-8 py-4 text-lg font-bold text-dark shadow-xl shadow-gold/30 transition hover:shadow-gold/50">
              Reserve Table
            </Link>
            <Link to="/menu" className="rounded-full border-2 border-gold bg-transparent px-8 py-4 text-lg font-bold text-gold transition hover:bg-gold hover:text-dark">
              Explore Menu
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-20 grid grid-cols-2 gap-6 md:grid-cols-4"
          >
            {stats.map((stat, idx) => (
              <div key={idx} className="glass rounded-2xl p-6 text-center">
                <p className="text-4xl font-black text-gold">{stat.number}</p>
                <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-slate">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="bg-charcoal py-20">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-center text-sm font-bold uppercase tracking-widest text-gold">Restaurant at a glance</p>
          <h2 className="mb-12 mt-4 text-center text-4xl font-black text-light">Why Choose Glimpse</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group glass rounded-2xl p-6 text-center transition hover:border-gold/40"
              >
                <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-xl bg-gradient text-3xl text-dark transition group-hover:scale-110">
                  <feature.icon />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-light">{feature.title}</h3>
                <p className="text-sm leading-6 text-slate">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="mb-4 text-center text-4xl font-black text-light">Featured Dishes</h2>
        <p className="mb-12 text-center text-slate">A glimpse into our culinary masterpieces</p>
        <div className="grid gap-6 md:grid-cols-3">
          {featured.map((img, idx) => (
            <motion.div
              key={img}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-2xl"
            >
              <img 
                src={img} 
                alt="Featured dish"
                className="h-80 w-full object-cover transition duration-500 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent opacity-60 transition group-hover:opacity-80"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="h-1 w-16 bg-gradient mb-3"></div>
                <p className="text-sm font-bold uppercase tracking-wider text-gold">Signature Dish</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-charcoal py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-12 text-center text-4xl font-black text-light">What Our Guests Say</h2>
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
                <div className="mb-4 flex gap-1 text-gold">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
                <p className="mb-4 italic text-slate">"{testimonial.text}"</p>
                <p className="font-semibold text-gold">- {testimonial.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient p-12 text-center shadow-2xl shadow-gold/20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLW9wYWNpdHk9Ii4wNSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')] opacity-10"></div>
          <div className="relative">
            <h2 className="mb-4 text-4xl font-black text-dark">Reserve Your Table Today</h2>
            <p className="mx-auto mb-8 max-w-2xl text-dark/80">
              Experience the finest dining Kigali has to offer. Book your table now and let us create an unforgettable culinary journey for you.
            </p>
            <Link to="/reservations" className="inline-block rounded-full bg-dark px-10 py-4 text-lg font-bold text-gold transition hover:bg-charcoal">
              Make a Reservation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
