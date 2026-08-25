import Link from "next/link";

const categories = [
  {
    name: "Sweets",
    description: "Traditional favorites, made with love.",
    image:
      "https://sanwariyasweets.in/_next/image?q=75&url=%2Funique-sweets%2F2.jpeg&w=640",
  },
  {
    name: "Snacks",
    description: "Crispy, savory bites for every mood.",
    image:
      "https://cf-img-a-in.tosshub.com/sites/visualstory/wp/2024/06/GettyImages-1156059928-1-scaled.jpg?size=%2A%3A900",
  },
  {
    name: "Desserts",
    description: "Sweet creations worth coming back for.",
    image:
      "https://thecinnamonjar.com/wp-content/uploads/2023/04/mango-mousse-2-of-2.jpg",
  },
  {
    name: "Ice Cream",
    description: "Cold, creamy, and impossible to resist.",
    image:
      "https://images.unsplash.com/photo-1529739121416-921f4dae728e?auto=format&fit=crop&w=1200&q=85",
  },
];

export default function Categories() {
  return (
    <section
      id="categories"
      className="bg-[#f7f5f1] px-6 py-16 md:px-10 md:py-24 lg:px-16"
    >
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-12">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#8b5e3c]">
            Explore Malai
          </p>

          <h2 className="text-3xl font-semibold tracking-tight text-black sm:text-4xl md:text-5xl">
            Something for every craving.
          </h2>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              href={`/shop?category=${encodeURIComponent(category.name)}`}
              key={category.name}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl text-left"
            >
              {/* Image */}
              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/30 transition-colors duration-300 group-hover:bg-black/40" />

              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <h3 className="text-2xl font-semibold">
                  {category.name}
                </h3>

                <p className="mt-2 max-w-[220px] text-sm leading-relaxed text-white/80">
                  {category.description}
                </p>

                <span className="mt-5 inline-block text-sm font-medium">
                  Explore →
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
