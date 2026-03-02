import Hero from "../components/Hero";

export default function Home() {
  return (
    <>
      <Hero />

      <section className="mt-20">
        <h2 className="text-green-400 text-xl mb-4">$ latest_blogs</h2>
        <p className="text-gray-500">No blogs published yet.</p>
      </section>
    </>
  );
}