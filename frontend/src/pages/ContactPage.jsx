import React from "react";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 pt-28">
      <h1 className="text-4xl text-softGreen">Contact Us</h1>
      <form className="mt-6 space-y-3 rounded-xl bg-zinc-900 p-6">
        <input className="w-full rounded bg-zinc-800 p-3" placeholder="Name" />
        <input className="w-full rounded bg-zinc-800 p-3" placeholder="Email" />
        <textarea className="w-full rounded bg-zinc-800 p-3" rows="4" placeholder="Your message" />
        <button className="rounded bg-softGreen px-6 py-3 text-black">Send Message</button>
      </form>
    </div>
  );
}
