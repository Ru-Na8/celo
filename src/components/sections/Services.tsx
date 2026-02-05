"use client";

import { motion, useInView } from "framer-motion";
import { Clock, Scissors, SprayCan, Sparkles, Crown } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

const services = [
  {
    icon: Scissors,
    name: "Herrklippning",
    price: "350",
    duration: "30 min",
    popular: true,
  },
  {
    icon: SprayCan,
    name: "Rakning",
    price: "400",
    duration: "45 min",
    popular: false,
  },
  {
    icon: Crown,
    name: "VIP Paket",
    price: "650",
    duration: "75 min",
    popular: true,
  },
  {
    icon: Sparkles,
    name: "Skäggtrimning",
    price: "250",
    duration: "20 min",
    popular: false,
  },
];

export function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" ref={ref} className="py-24 bg-navy-900">
      <div className="container px-4 mx-auto max-w-5xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span
            className="inline-block font-medium tracking-wider text-sm uppercase mb-4"
            style={{ color: "#D4AF37" }}
          >
            Våra Tjänster
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-cream-100">
            Prislista
          </h2>
        </motion.div>

        {/* Services List - Clean minimal design */}
        <div className="space-y-4 mb-12">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all group">
                  <div className="flex items-center justify-between">
                    {/* Left side - Icon, Name, Duration */}
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors"
                        style={{ backgroundColor: "rgba(212, 175, 55, 0.15)" }}
                      >
                        <Icon className="w-6 h-6" style={{ color: "#D4AF37" }} />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold text-cream-100">
                            {service.name}
                          </h3>
                          {service.popular && (
                            <span
                              className="text-xs font-bold px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: "#D4AF37", color: "#000" }}
                            >
                              Populär
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-cream-400 text-sm mt-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{service.duration}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right side - Price */}
                    <div className="text-right">
                      <span className="text-2xl font-bold" style={{ color: "#D4AF37" }}>
                        {service.price}
                      </span>
                      <span className="text-cream-400 text-sm ml-1">kr</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <Link
            href="/booking"
            className="inline-flex items-center justify-center gap-3 px-10 py-4 rounded-full font-bold text-lg transition-all hover:scale-105"
            style={{ backgroundColor: "#D4AF37", color: "#000" }}
          >
            Boka Tid
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
