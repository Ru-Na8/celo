"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { Calendar, Award, Users } from "lucide-react";

export function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" ref={ref} className="py-24 bg-white">
      <div className="container px-4 mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074"
                  alt="Celo Salong"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative element */}
              <div
                className="absolute -bottom-6 -right-6 w-32 h-32 rounded-2xl -z-10"
                style={{ backgroundColor: "#D4AF37" }}
              />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span
              className="inline-block font-medium tracking-wider text-sm uppercase mb-4"
              style={{ color: "#D4AF37" }}
            >
              Om Oss
            </span>

            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-navy-900 mb-6">
              Celo Salong
            </h2>

            <p className="text-navy-600 text-lg leading-relaxed mb-8">
              Din professionella barbershop i Malmö. Vi kombinerar klassiskt hantverk
              med moderna tekniker för att ge dig den perfekta looken.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: "rgba(212, 175, 55, 0.15)" }}
                >
                  <Award className="w-7 h-7" style={{ color: "#D4AF37" }} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-navy-900">10+</div>
                  <div className="text-navy-500 text-sm">Års erfarenhet</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: "rgba(212, 175, 55, 0.15)" }}
                >
                  <Users className="w-7 h-7" style={{ color: "#D4AF37" }} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-navy-900">1000+</div>
                  <div className="text-navy-500 text-sm">Nöjda kunder</div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/booking"
              className="inline-flex items-center gap-3 text-cream-100 px-8 py-4 rounded-full font-semibold transition-all hover:shadow-xl hover:scale-105"
              style={{ backgroundColor: "#D4AF37" }}
            >
              <Calendar className="w-5 h-5" />
              Boka Din Tid Nu
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
