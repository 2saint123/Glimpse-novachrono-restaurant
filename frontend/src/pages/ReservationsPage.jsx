import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function ReservationsPage() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState("19:00:00");
  const [tables, setTables] = useState([]);
  const [selected, setSelected] = useState(null);
  const [guests, setGuests] = useState(2);

  useEffect(() => {
    api.get("/reservations/availability", { params: { date, time } }).then(({ data }) => setTables(data));
  }, [date, time]);

  const reserve = async () => {
    if (!selected) return;
    await api.post("/reservations", { tableId: selected, reservationDate: date, reservationTime: time, guests });
    alert("Reservation submitted. Await admin approval.");
  };

  const color = (status) => (status === "available" ? "bg-green-500" : status === "reserved" ? "bg-red-500" : "bg-yellow-500");

  return (
    <div className="mx-auto max-w-6xl px-6 pt-28">
      <h1 className="text-4xl text-softGreen">Table Reservations</h1>
      <div className="my-6 flex gap-3">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded bg-zinc-900 p-3" />
        <input type="time" value={time.slice(0, 5)} onChange={(e) => setTime(`${e.target.value}:00`)} className="rounded bg-zinc-900 p-3" />
        <input type="number" value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="w-24 rounded bg-zinc-900 p-3" />
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {tables.map((table) => (
          <button
            key={table.id}
            disabled={table.status !== "available"}
            onClick={() => setSelected(table.id)}
            className={`rounded-xl p-5 ${color(table.status)} ${selected === table.id ? "ring-4 ring-softGreen" : ""}`}
          >
            <p className="font-semibold text-black">{table.label}</p>
            <p className="text-black">{table.seats} seats</p>
          </button>
        ))}
      </div>
      <button onClick={reserve} className="mt-6 rounded bg-softGreen px-6 py-3 text-white transition-all duration-300 hover:bg-orange-500 hover:ring-2 hover:ring-softGreen">Confirm Reservation</button>
    </div>
  );
}
