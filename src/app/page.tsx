import { Hero } from "@/components/public/Hero";
import { Services } from "@/components/public/Services";
import { Reviews } from "@/components/public/Reviews";
import { Contact } from "@/components/public/Contact";
import { Footer } from "@/components/public/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <Services />
      <Reviews />
      <Contact />
      <Footer />
    </main>
  );
}
