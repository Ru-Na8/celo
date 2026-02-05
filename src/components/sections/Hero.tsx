"use client";

import { motion } from "framer-motion";
import { Clock, MapPin, Phone, Calendar, ChevronDown } from "lucide-react";
import Link from "next/link";

// Gold filled star for hero badge
function GoldStar() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#000" stroke="#000" strokeWidth="1">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

/**
 * Hero Section - Clean, professional design
 */
export function Hero() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen">
      {/* Background Image with gradient overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074"
          alt="Barbershop"
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay for depth */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.85) 100%)"
          }}
        />
      </div>

      {/* Main Content - Centered */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center px-4 pt-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Rating Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-10"
            style={{ backgroundColor: "#D4AF37" }}
          >
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <GoldStar key={i} />
              ))}
            </div>
            <span className="text-sm font-bold text-black">5.0 på Google</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight"
            style={{
              color: "#FFFFFF",
              fontFamily: "var(--font-playfair), serif",
            }}
          >
            CELO
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight"
            style={{
              color: "#D4AF37",
              fontFamily: "var(--font-playfair), serif",
            }}
          >
            SALONG
          </motion.h2>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-xl md:text-2xl mb-12 font-light tracking-wide"
            style={{ color: "rgba(255,255,255,0.9)" }}
          >
            Premium Barbershop i Malmö
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link
              href="/booking"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-2xl"
              style={{ backgroundColor: "#D4AF37", color: "#000000" }}
            >
              <Calendar className="w-5 h-5" />
              Boka Tid
            </Link>
            <a
              href="tel:+46700000000"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 rounded-full font-bold text-lg transition-all hover:bg-white/10"
              style={{
                backgroundColor: "transparent",
                color: "#FFFFFF",
                border: "2px solid rgba(255,255,255,0.5)"
              }}
            >
              <Phone className="w-5 h-5" />
              Ring Oss
            </a>
          </motion.div>

          {/* Quick Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-8"
            style={{ color: "rgba(255,255,255,0.8)" }}
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" style={{ color: "#D4AF37" }} />
              <span className="font-medium">Malmö, Sverige</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" style={{ color: "#D4AF37" }} />
              <span className="font-medium">Mån-Lör Öppet</span>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          onClick={() => scrollToSection("services")}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="w-8 h-8" />
          </motion.div>
        </motion.button>
      </div>
    </section>
  );
}
