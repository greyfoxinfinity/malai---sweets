import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="px-6 py-10 md:px-10 lg:px-16">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-[#17130f] px-6 py-14 text-center sm:px-8 sm:py-20 md:px-16 md:py-28">
        {/* Decorative glow */}
        <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[#8b5e3c]/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-[#d4a373]/10 blur-3xl" />

        <div className="relative mx-auto max-w-2xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#d4a373]">
            Your next sweet moment
          </p>

          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-6xl">
            Something delicious
            <br />
            is waiting for you.
          </h2>

          <p className="mx-auto mt-6 max-w-lg text-base leading-7 text-white/60">
            Discover sweets, desserts, snacks, and more — freshly made and
            ready to brighten your day.
          </p>

          <Link href="/shop" className="group mt-9 inline-flex items-center gap-3 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition-all duration-300 hover:bg-[#d4a373]">
            Shop now
            <ArrowRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
