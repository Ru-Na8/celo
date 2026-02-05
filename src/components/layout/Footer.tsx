"use client";

import Link from "next/link";
import { MapPin, Phone, Clock, Scissors, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-navy-950 pt-16 pb-8">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-brass-400 flex items-center justify-center">
                <Scissors className="w-5 h-5 text-navy-900" />
              </div>
              <span className="font-display text-xl font-bold text-cream-100">
                Celo Salong
              </span>
            </Link>
            <p className="text-cream-400 text-sm leading-relaxed mb-4">
              Premium barbershop i Malmö. Professionella herrklippningar och traditionell rakning.
            </p>
            <a
              href="https://www.instagram.com/mohammed_frisor"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-cream-300 hover:text-brass-400 transition-colors text-sm"
            >
              @mohammed_frisor
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-cream-100 mb-4">Snabblänkar</h4>
            <ul className="space-y-2">
              {[
                { href: "#services", label: "Tjänster" },
                { href: "#reviews", label: "Recensioner" },
                { href: "#about", label: "Om Oss" },
                { href: "/booking", label: "Boka Tid" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-cream-400 hover:text-brass-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-cream-100 mb-4">Kontakt</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-cream-400 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-brass-400" />
                <span>Malmö, Sverige</span>
              </li>
              <li>
                <a
                  href="tel:+46700000000"
                  className="flex items-center gap-2 text-cream-400 hover:text-brass-400 transition-colors text-sm"
                >
                  <Phone className="w-4 h-4 flex-shrink-0 text-brass-400" />
                  <span>Ring Oss</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-semibold text-cream-100 mb-4">Öppettider</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-cream-400">
                <Clock className="w-4 h-4 text-brass-400" />
                <span>Mån-Fre: 10:00 - 19:00</span>
              </li>
              <li className="flex items-center gap-2 text-cream-400">
                <Clock className="w-4 h-4 text-brass-400" />
                <span>Lördag: 10:00 - 17:00</span>
              </li>
              <li className="flex items-center gap-2 text-cream-400">
                <Clock className="w-4 h-4 text-brass-400" />
                <span>Söndag: Stängt</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 text-center text-sm text-cream-500">
          <p>&copy; {new Date().getFullYear()} Celo Salong. Alla rättigheter förbehållna.</p>
        </div>
      </div>
    </footer>
  );
}
