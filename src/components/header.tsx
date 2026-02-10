"use client";

import { motion } from "framer-motion";
import { Camera, ShieldCheck, Github } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

export default function Header() {
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
    <>
      {/* Header */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl flex justify-between items-center z-50 px-6">
        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="bg-white/10 p-2 rounded-xl group-hover:bg-white/20 transition-colors">
            <Camera size={20} className="text-white" />
          </div>
          <span className="font-bold tracking-tight text-white">
            FLASH.STUDIO
          </span>
        </Link>
        <motion.div variants={itemVariants} className="flex gap-4 items-center">
          <Link
            href="/privacy"
            className="text-sm text-neutral-400 hover:text-white transition-colors flex items-center gap-1"
          >
            <ShieldCheck size={14} /> Privacy
          </Link>
          <Link href="https://github.com/semajame" target="_blank">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-white/10 text-white"
            >
              <Github size={24} />
            </Button>
          </Link>
        </motion.div>
      </div>
    </>
  );
}
