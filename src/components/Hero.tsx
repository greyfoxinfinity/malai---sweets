import Link from "next/link";

export default function Hero() {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-10 md:py-20">
      <div className="grid min-h-[500px] overflow-hidden rounded-3xl bg-[#f3eee7] md:min-h-[600px] md:grid-cols-2">

        {/* Text */}
        <div className="flex flex-col justify-center px-6 py-12 md:px-12 lg:px-16">
          <p className="mb-5 text-sm font-medium uppercase tracking-[0.2em] text-black/60">
            Sweets · Snacks · Desserts
          </p>

          <h1 className="max-w-xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Made for your sweetest moments.
          </h1>

          <p className="mt-6 max-w-md text-base leading-7 text-black/60 md:text-lg">
            Discover handcrafted sweets, indulgent desserts, refreshing
            ice cream, and snacks made to bring people together.
          </p>

          <div className="mt-8">
            <Link
              href="/shop"
              className="inline-flex items-center rounded-full bg-black px-7 py-3.5 text-sm font-medium text-white transition-transform hover:scale-[1.03]"
            >
              Explore the menu
            </Link>
          </div>
        </div>

        {/* Image */}
        <div className="relative min-h-[280px] overflow-hidden md:min-h-full">
          <img
            src="https://shop.fourall.ca/cdn/shop/articles/DSC_0362-2.jpg?v=1626113440&width=2048"
            alt="Beautiful selection of ice cream and desserts"
            loading="eager"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105"
          />

          {/* Soft overlay */}
          <div className="absolute inset-0 bg-black/5" />
        </div>

      </div>
    </section>
  );
}
