export default function Blogs() {
  return (
    <section className="py-24">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl text-green-400 text-center mb-16 tracking-wide">
          Blogs
        </h1>

        <div className="border border-gray-800 rounded-lg p-8">
          <h2 className="text-2xl text-green-400 mb-4">
            No blogs published yet.
          </h2>
          <p className="text-gray-400">
            Blog posts will appear here once published.
          </p>
        </div>
      </div>
    </section>
  );
}