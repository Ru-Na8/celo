"use client";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";
import { Award, Clock, Users, Scissors } from "lucide-react";
import { CountUp } from "@/components/ui/CountUp";

const stats = [
  { icon: Users, value: 5000, suffix: "+", label: "Happy Clients" },
  { icon: Clock, value: 15, suffix: "+", label: "Years Experience" },
  { icon: Scissors, value: 50000, suffix: "+", label: "Haircuts Given" },
  { icon: Award, value: 4.9, suffix: "", decimals: 1, label: "Google Rating" },
];

export function Experience() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <section ref={containerRef} className="py-24 bg-cream-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-brass-100/30 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-gradient-to-tr from-navy-100/20 to-transparent pointer-events-none" />

      <div className="container px-4 mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content Side */}
          <div className="space-y-8 relative z-10">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="inline-block text-brass-500 font-medium tracking-widest text-sm uppercase"
            >
              Our Philosophy
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl text-navy-900 leading-[1.1]"
            >
              Tradition Meets
              <span className="text-brass-gradient"> Precision</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-navy-600 text-lg leading-relaxed max-w-xl border-l-4 border-brass-400 pl-6"
            >
              At Herr Frisör, we honor the time-tested traditions of classic barbering
              while embracing modern techniques. Every cut tells a story, every shave
              is a ritual, and every client leaves feeling like the best version of themselves.
            </motion.p>

            {/* Feature Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-2 gap-4 pt-4"
            >
              <div className="p-6 bg-white rounded-xl border border-cream-200 hover:border-brass-300 hover:shadow-lg transition-all duration-300 card-lift">
                <h4 className="text-navy-900 font-semibold text-lg mb-2">Master Barbers</h4>
                <p className="text-sm text-navy-500">Trained in traditional and contemporary techniques.</p>
              </div>
              <div className="p-6 bg-white rounded-xl border border-cream-200 hover:border-brass-300 hover:shadow-lg transition-all duration-300 card-lift">
                <h4 className="text-navy-900 font-semibold text-lg mb-2">Premium Products</h4>
                <p className="text-sm text-navy-500">Only the finest grooming products for your hair and skin.</p>
              </div>
            </motion.div>
          </div>

          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <motion.div style={{ y }} className="relative">
              {/* Main Image */}
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl shadow-navy-900/10">
                <img
                  src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070&auto=format&fit=crop"
                  alt="Barber at work"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/30 via-transparent to-transparent" />
              </div>

              {/* Decorative borders */}
              <div className="absolute -inset-4 border-2 border-brass-300/50 rounded-2xl -z-10" />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-brass-100 rounded-2xl -z-20" />
            </motion.div>
          </motion.div>
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 bg-navy-900 rounded-2xl p-8 md:p-12"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brass-400/20 mb-4">
                    <Icon className="w-6 h-6 text-brass-400" />
                  </div>
                  <div className="text-4xl md:text-5xl font-display font-bold text-cream-100 mb-2">
                    <CountUp
                      end={stat.value}
                      suffix={stat.suffix}
                      decimals={stat.decimals || 0}
                      duration={2.5}
                    />
                  </div>
                  <div className="text-cream-400 text-sm">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
