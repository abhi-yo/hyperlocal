"use client";
import { Poppins } from 'next/font/google';
import { useEffect, useState } from "react";

const poppins = Poppins({ weight: ['400', '600', '700'], subsets: ['latin'] });

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
}

interface EventListProps {
  onEventSelect?: (event: Event) => void;
}

export default function EventList({ onEventSelect }: EventListProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState("");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/events")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch events");
        }
        return res.json();
      })
      .then(setEvents)
      .catch((err) => {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again later.");
      });
  }, []);

  const handleEventClick = (event: Event) => {
    setSelectedEventId(event._id);
    if (onEventSelect) {
      onEventSelect(event);
    }
  };

  if (error) {
    return <p className={`text-red-500 ${poppins.className}`}>{error}</p>;
  }

  return (
    <div className={poppins.className}>
      <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <ul>
          {events.map((event) => (
            <li
              key={event._id}
              className={`mb-4 p-4 border rounded cursor-pointer ${
                selectedEventId === event._id ? 'bg-gray-100' : ''
              }`}
              onClick={() => handleEventClick(event)}
            >
              <h3 className="text-xl font-semibold">{event.title}</h3>
              <p>{event.description}</p>
              <p className="text-sm text-gray-500">
                {new Date(event.date).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}