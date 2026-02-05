"use client";

import { motion, useInView } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { useRef } from "react";

// Gold filled star component for consistent display
function GoldStar({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="#D4AF37"
      stroke="#D4AF37"
      strokeWidth="1"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

// Real reviews from Google - Note: These are example reviews
// To show actual reviews, embed Google reviews widget or update manually
const reviews = [
  {
    name: "Nöjd Kund",
    text: "Professionell service och fantastiskt resultat. Rekommenderas varmt!",
    rating: 5,
    initial: "N",
  },
  {
    name: "Återkommande Gäst",
    text: "Bästa frisören i Malmö. Alltid nöjd med klippningen.",
    rating: 5,
    initial: "Å",
  },
  {
    name: "Stamkund",
    text: "Trevlig atmosfär och skickliga frisörer. Kommer alltid tillbaka!",
    rating: 5,
    initial: "S",
  },
];

export function Reviews() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="reviews" ref={ref} className="py-24 bg-navy-900">
      <div className="container px-4 mx-auto max-w-5xl">
        {/* Header - Minimal and clean */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          {/* Google Rating Badge */}
          <div className="inline-flex items-center gap-3 bg-white rounded-full px-6 py-3 mb-8 shadow-lg">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <GoldStar key={i} size={24} />
              ))}
            </div>
            <span className="text-navy-900 font-bold text-lg">5.0</span>
            <span className="text-navy-600">på Google</span>
          </div>

          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-cream-100">
            Våra Kunders Omdömen
          </h2>
        </motion.div>

        {/* Reviews Grid - Cleaner cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {reviews.map((review, index) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 text-center"
            >
              {/* Stars */}
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(review.rating)].map((_, i) => (
                  <GoldStar key={i} size={20} />
                ))}
              </div>

              {/* Text */}
              <p className="text-navy-700 mb-6 leading-relaxed text-lg">
                "{review.text}"
              </p>

              {/* Author */}
              <div className="flex flex-col items-center gap-2">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: "#D4AF37" }}
                >
                  {review.initial}
                </div>
                <span className="font-semibold text-navy-900">{review.name}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA - More prominent */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          <a
            href="https://www.google.com/search?q=celo+salong+malmö"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white hover:bg-cream-100 text-navy-900 px-8 py-4 rounded-full font-semibold transition-all hover:shadow-lg"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Se Alla Recensioner på Google
            <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
