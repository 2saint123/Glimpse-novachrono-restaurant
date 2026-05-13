import React from "react";
import { FaHistory, FaBullseye, FaHeart, FaStar, FaLeaf, FaGlassCheers } from "react-icons/fa";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 pt-28 pb-20">
      <div className="mb-16 text-center">
        <h1 className="mb-4 text-5xl font-bold text-softGreen">About Glimpse Kigali</h1>
        <p className="mx-auto max-w-3xl text-lg text-zinc-300">
          We create a refined culinary journey combining premium cuisine, elegant service, and unforgettable ambiance. 
          Glimpse Kigali represents the pinnacle of fine dining in Rwanda's vibrant capital.
        </p>
      </div>

      <div className="mb-16 grid gap-8 md:grid-cols-2">
        <div className="glass rounded-xl p-8">
          <FaHistory className="mb-4 text-5xl text-softGreen" />
          <h3 className="mb-3 text-2xl font-semibold text-softGreen">Our Story</h3>
          <p className="text-zinc-300">
            Founded in 2020, Glimpse Kigali emerged from a passion to bring world-class dining to Rwanda. 
            Our founders envisioned a space where culinary artistry meets Rwandan hospitality, creating 
            an experience that honors both tradition and innovation. Today, we stand as a beacon of 
            excellence in East African fine dining.
          </p>
        </div>

        <div className="glass rounded-xl p-8">
          <FaBullseye className="mb-4 text-5xl text-softGreen" />
          <h3 className="mb-3 text-2xl font-semibold text-softGreen">Our Mission</h3>
          <p className="text-zinc-300">
            To deliver world-class dining experiences that celebrate the rich flavors of Rwanda while 
            embracing international culinary excellence. We strive to create memorable moments through 
            exceptional food, impeccable service, and an atmosphere that embodies luxury and warmth.
          </p>
        </div>

        <div className="glass rounded-xl p-8">
          <FaHeart className="mb-4 text-5xl text-softGreen" />
          <h3 className="mb-3 text-2xl font-semibold text-softGreen">Our Values</h3>
          <ul className="space-y-2 text-zinc-300">
            <li>• Excellence in every dish and interaction</li>
            <li>• Respect for local ingredients and traditions</li>
            <li>• Innovation in culinary techniques</li>
            <li>• Sustainability and community support</li>
            <li>• Genuine hospitality and warmth</li>
          </ul>
        </div>

        <div className="glass rounded-xl p-8">
          <FaStar className="mb-4 text-5xl text-softGreen" />
          <h3 className="mb-3 text-2xl font-semibold text-softGreen">Why Choose Us</h3>
          <p className="text-zinc-300">
            Chef-crafted menu featuring seasonal ingredients, premium service from our trained staff, 
            iconic interior design that blends modern elegance with African aesthetics, and an extensive 
            wine collection curated to complement our dishes perfectly.
          </p>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="mb-8 text-center text-3xl font-bold text-softGreen">What Sets Us Apart</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="glass rounded-xl p-6 text-center">
            <FaLeaf className="mx-auto mb-4 text-4xl text-softGreen" />
            <h4 className="mb-2 text-xl font-semibold">Farm-to-Table</h4>
            <p className="text-sm text-zinc-300">
              We partner with local farmers to source the freshest organic ingredients, supporting 
              Rwanda's agricultural community while ensuring quality.
            </p>
          </div>

          <div className="glass rounded-xl p-6 text-center">
            <FaGlassCheers className="mx-auto mb-4 text-4xl text-softGreen" />
            <h4 className="mb-2 text-xl font-semibold">Curated Wine Selection</h4>
            <p className="text-sm text-zinc-300">
              Our sommelier has assembled an impressive collection of international wines, 
              perfectly paired with our menu offerings.
            </p>
          </div>

          <div className="glass rounded-xl p-6 text-center">
            <FaStar className="mx-auto mb-4 text-4xl text-softGreen" />
            <h4 className="mb-2 text-xl font-semibold">Award-Winning Chef</h4>
            <p className="text-sm text-zinc-300">
              Led by Chef Antoine Rwema, trained in Paris and New York, bringing decades of 
              Michelin-star experience to Kigali.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="mb-8 text-center text-3xl font-bold text-softGreen">Our Team</h2>
        <div className="glass rounded-xl p-8">
          <p className="mb-6 text-center text-zinc-300">
            Behind every exceptional dining experience is a dedicated team of professionals. From our 
            executive chef and sous chefs to our front-of-house staff, every member of the Glimpse Kigali 
            family is committed to excellence. Our team undergoes continuous training to stay at the 
            forefront of culinary trends and hospitality standards.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-3 h-32 w-32 mx-auto rounded-full bg-zinc-800"></div>
              <h4 className="font-semibold text-softGreen">Chef Antoine Rwema</h4>
              <p className="text-sm text-zinc-400">Executive Chef</p>
            </div>
            <div className="text-center">
              <div className="mb-3 h-32 w-32 mx-auto rounded-full bg-zinc-800"></div>
              <h4 className="font-semibold text-softGreen">Marie Uwase</h4>
              <p className="text-sm text-zinc-400">Restaurant Manager</p>
            </div>
            <div className="text-center">
              <div className="mb-3 h-32 w-32 mx-auto rounded-full bg-zinc-800"></div>
              <h4 className="font-semibold text-softGreen">Jean-Paul Nkusi</h4>
              <p className="text-sm text-zinc-400">Head Sommelier</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-6 text-center text-3xl font-bold text-softGreen">Visit Us</h2>
        <div className="glass rounded-xl overflow-hidden">
          <iframe
            title="Glimpse Kigali Map"
            className="h-96 w-full"
            src="https://www.google.com/maps?q=Kigali,Rwanda&output=embed"
          />
          <div className="p-6 text-center">
            <p className="text-zinc-300">KN 4 Ave, Kigali City, Rwanda</p>
            <p className="mt-2 text-zinc-400">Open Monday - Sunday | 11:00 AM - 11:00 PM</p>
          </div>
        </div>
      </div>
    </div>
  );
}
