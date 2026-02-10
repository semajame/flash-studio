"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Github, Camera, Sparkles, ShieldCheck } from "lucide-react";

export default function LandingPage() {
  // Animation variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="relative min-h-screen w-full bg-neutral-950 overflow-hidden selection:bg-white/20">
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

      <div className="relative z-10 px-6 lg:px-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="min-h-screen flex flex-col items-center justify-center"
        >
          {/* New snippets banner */}
          <motion.div variants={itemVariants} className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-neutral-300 backdrop-blur-md">
              <Sparkles size={12} className="text-yellow-500" />
              Made by <span className="text-white font-semibold">James</span>
            </span>
          </motion.div>

          {/* Main content */}
          <div className="text-center max-w-4xl">
            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8 leading-[1.1]"
            >
              Welcome to{" "}
              <span className="block bg-gradient-to-b from-white via-white/80 to-white/20 bg-clip-text text-transparent">
                Digital Photobooth
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-neutral-400 mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              The modern way to capture, smile, and share. Customizable photo
              strips delivered instantly to your device.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-4 justify-center"
            >
              <Link href="/photobooth">
                <Button
                  size="lg"
                  className="group relative h-14 px-8 bg-white text-black hover:bg-neutral-200 transition-all rounded-full overflow-hidden"
                >
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-2 font-bold text-base cursor-pointer"
                  >
                    Start Snapping <Camera size={20} />
                  </motion.div>
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
