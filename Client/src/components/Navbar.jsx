import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center py-6">
      <h1 className="text-green-400 text-xl font-bold">
        &gt; FOSS // GLUG
      </h1>

      <div className="space-x-6">
        <Link to="/" className="hover:text-green-400">Home</Link>
        <Link to="/events" className="hover:text-green-400">Events</Link>
        <Link to="/about" className="hover:text-green-400">About</Link>
      </div>
    </nav>
  );
}