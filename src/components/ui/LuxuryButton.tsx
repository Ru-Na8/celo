"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface LuxuryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: "primary" | "outline" | "minimal";
    href?: string;
    className?: string;
}

export function LuxuryButton({ children, variant = "primary", href, className, ...props }: LuxuryButtonProps) {
    const ButtonContent = () => (
        <div className={cn("relative overflow-hidden group px-8 py-4 transition-all duration-500 ease-out", className)}>
            {variant === "primary" && (
                <>
                    <span className="absolute inset-0 w-full h-full bg-emerald-700/0 group-hover:bg-emerald-700 transition-all duration-500 ease-out z-0" />
                    <span className="absolute inset-0 w-full h-full border border-emerald-500/30 rounded-none z-10" />
                </>
            )}

            {variant === "outline" && (
                <>
                    <span className="absolute inset-0 w-full h-full bg-white/5 group-hover:bg-white/10 backdrop-blur-sm transition-all duration-500 ease-out z-0" />
                    <span className="absolute inset-0 w-full h-full border border-white/20 group-hover:border-gold-300/50 rounded-none z-10" />
                </>
            )}

            {variant === "minimal" && (
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-emerald-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left z-10" />
            )}

            <span className={cn(
                "relative z-20 flex items-center justify-center gap-2 font-medium tracking-[0.15em] uppercase text-xs md:text-sm",
                variant === "primary" ? "text-white" : "text-white group-hover:text-emerald-300"
            )}>
                {/* Split Text Animation Effect */}
                <span className="relative overflow-hidden block">
                    <span className="block transition-transform duration-500 ease-out group-hover:-translate-y-[150%]">
                        {children}
                    </span>
                    <span className="absolute top-0 left-0 block transition-transform duration-500 ease-out translate-y-[150%] group-hover:0 text-emerald-300">
                        {children}
                    </span>
                </span>
            </span>
        </div>
    );

    if (href) {
        return (
            <Link href={href} className="inline-block">
                <ButtonContent />
            </Link>
        );
    }

    return (
        <button {...props} className="inline-block relative">
            <ButtonContent />
        </button>
    );
}
