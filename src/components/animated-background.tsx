"use client";

import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <>
      {/* --- VISUAL BACKGROUND ELEMENTS --- */}
      {/* Radial Gradient Spotlight */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.15),transparent_50%)]" />

      {/* Animated Background "Photos" (Floating Shapes) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white/[0.02] border border-white/[0.05] rounded-2xl"
            style={{
              width: Math.random() * 200 + 100,
              height: Math.random() * 200 + 150,
              left: `${Math.random() * 80}%`,
              top: `${Math.random() * 80}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [i * 5, i * -5, i * 5],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </>
  );
}
