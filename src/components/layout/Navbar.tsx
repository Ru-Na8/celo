"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Scissors, Calendar } from "lucide-react";

const navLinks = [
  { href: "#services", id: "services", label: "Tjänster" },
  { href: "#reviews", id: "reviews", label: "Recensioner" },
  { href: "#instagram", id: "instagram", label: "Instagram" },
  { href: "#about", id: "about", label: "Om Oss" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Determine active section
      const sections = navLinks.map(link => document.getElementById(link.id));
      const scrollPos = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPos) {
          setActiveSection(navLinks[i].id);
          return;
        }
      }
      setActiveSection("");
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white shadow-md"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                isScrolled ? "bg-navy-900" : "bg-white/10 backdrop-blur-sm"
              }`}>
                <Scissors className={`w-5 h-5 ${isScrolled ? "text-brass-400" : "text-cream-100"}`} />
              </div>
              <div>
                <span className={`font-display text-xl font-bold transition-colors ${
                  isScrolled ? "text-navy-900" : "text-cream-100"
                }`}>
                  Celo Salong
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeSection === link.id
                      ? isScrolled
                        ? "bg-brass-100 text-brass-700"
                        : "bg-white/20 text-cream-100"
                      : isScrolled
                        ? "text-navy-600 hover:text-navy-900 hover:bg-cream-100"
                        : "text-cream-200 hover:text-cream-100 hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden md:block">
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 bg-brass-400 hover:bg-brass-300 text-navy-900 px-6 py-2.5 rounded-xl font-semibold transition-all hover:shadow-lg"
              >
                <Calendar className="w-4 h-4" />
                Boka Tid
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${
                isScrolled ? "text-navy-900" : "text-cream-100"
              }`}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-navy-950 pt-20 md:hidden"
          >
            <div className="container px-4 mx-auto">
              <div className="flex flex-col gap-2">
                {navLinks.map((link, index) => (
                  <motion.button
                    key={link.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => scrollToSection(link.id)}
                    className={`text-left text-xl font-medium py-4 px-4 rounded-xl transition-colors ${
                      activeSection === link.id
                        ? "bg-brass-400/20 text-brass-400"
                        : "text-cream-100 hover:bg-white/5"
                    }`}
                  >
                    {link.label}
                  </motion.button>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="pt-4"
                >
                  <Link
                    href="/booking"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 bg-brass-400 text-navy-900 px-6 py-4 rounded-xl font-semibold text-lg"
                  >
                    <Calendar className="w-5 h-5" />
                    Boka Tid
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
