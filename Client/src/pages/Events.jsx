import events from "../data/events";

export default function Events() {
  return (
    <div className="py-20">
      <h2 className="text-3xl text-green-400 mb-10">Events</h2>

      <div className="grid md:grid-cols-2 gap-8">
        {events.map((event) => (
          <div key={event.id} className="border border-gray-800 p-6 rounded">
            <h3 className="text-xl mb-2">{event.title}</h3>
            <p className="text-gray-400">{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}