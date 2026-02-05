"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ExternalLink, Instagram } from "lucide-react";
import Link from "next/link";

export function InstagramFeed() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section id="instagram" ref={sectionRef} className="py-24 bg-cream-50">
      <div className="container px-4 mx-auto max-w-4xl">
        {/* Simple, elegant Instagram CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Instagram Icon */}
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-8"
            style={{
              background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)"
            }}
          >
            <Instagram className="w-10 h-10 text-white" />
          </div>

          {/* Heading */}
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-navy-900 mb-4">
            Följ Oss på Instagram
          </h2>

          <p className="text-navy-600 text-lg mb-8 max-w-xl mx-auto">
            Se våra senaste klippningar, fades och styling. Inspiration för ditt nästa besök!
          </p>

          {/* Instagram Handle */}
          <Link
            href="https://www.instagram.com/mohammed_frisor"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-navy-900 hover:bg-navy-800 text-cream-100 px-8 py-4 rounded-full font-semibold text-lg transition-all hover:shadow-xl group"
          >
            <Instagram className="w-6 h-6" />
            @mohammed_frisor
            <ExternalLink className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity" />
          </Link>

          {/* Preview hint */}
          <p className="text-navy-400 text-sm mt-6">
            Klicka för att se vårt arbete på Instagram
          </p>
        </motion.div>
      </div>
    </section>
  );
}
