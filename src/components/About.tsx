import Image from "next/image";
import Link from "next/link";

export default function About() {
  return (
    <section id="about" className="bg-white px-6 py-16 md:px-10 md:py-24 lg:px-16">
      <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-2 md:gap-20">
        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#f3f0eb]">
          <Image
            src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy%2Cf_auto%2Cq_auto%2Cw_400/RX_THUMBNAIL/IMAGES/VENDOR/2025/12/18/86ce5e36-cb91-4a27-a6b5-8e7d3fab8851_865553%20%281%29.jpg"
            alt="Traditional Indian sweets"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="max-w-xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#8b5e3c]">
            Our Story
          </p>
          <h2 className="text-3xl font-semibold leading-tight tracking-tight text-black sm:text-4xl md:text-5xl">
            Made with care.
            <br />
            Made for sharing.
          </h2>
          <div className="mt-8 space-y-5 text-base leading-7 text-gray-600 md:leading-8">
            <p>
              At Malai, we believe the best moments are often the sweetest ones. We bring together
              familiar flavors, playful desserts, and carefully crafted treats made to brighten your
              day.
            </p>
            <p>
              From traditional sweets to modern desserts, every item is made with attention to detail
              and a whole lot of love.
            </p>
          </div>
          <Link
            href="/shop"
            className="mt-9 inline-block rounded-full border-b border-black px-6 py-3 text-sm font-medium text-black transition-opacity hover:opacity-60"
          >
            Discover our menu →
          </Link>
        </div>
      </div>
    </section>
  );
}
