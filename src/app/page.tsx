import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import Categories from "@/components/Categories";
import About from "@/components/About";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Malai",
    description:
      "Handcrafted sweets, snacks, ice cream, and desserts made for every occasion.",
    url: process.env.SITE_URL || "http://localhost:3000",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Chattogram",
      addressCountry: "BD",
    },
    servesCuisine: ["Sweets", "Snacks", "Desserts", "Ice Cream"],
    priceRange: "৳40-৳280",
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <FeaturedProducts />
      <Categories />
      <About />
      <CTA />
      <Footer />
    </main>
  );
}
