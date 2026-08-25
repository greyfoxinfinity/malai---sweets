import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import Categories from "@/components/Categories";
import About from "@/components/About";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <FeaturedProducts />
      <Categories />
      <About />
      <CTA />
      <Footer />
    </main>
  );
}