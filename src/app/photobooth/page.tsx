"use client";

import * as React from "react";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { filters } from "../utils/filters";
import {
  RotateCcw,
  ArrowRight,
  Aperture,
  Camera,
  Timer,
  Repeat,
  Images,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { motion, AnimatePresence } from "framer-motion";

export default function PhotoBooth() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [flash, setFlash] = useState(false); // For "Apple" camera flash effect
  const [selectedTimer, setSelectedTimer] = useState(3);
  const [photoLimit, setPhotoLimit] = useState(4);
  const [selectedFilter, setSelectedFilter] = useState<string>("None");

  const router = useRouter();

  useEffect(() => {
    startCamera();
    localStorage.clear();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  const triggerFlash = () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 150);
  };

  const photo = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    triggerFlash();
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.filter = filters[selectedFilter] || "none";
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const newPhoto = canvas.toDataURL("image/png");
    setPhotos((prev) =>
      prev.length < photoLimit ? [...prev, newPhoto] : prev,
    );
  };

  const takePhoto = () => {
    if (capturing) return;
    setCapturing(true);
    setCountdown(selectedTimer);

    const countdownFn = (count: number) => {
      if (count === 0) {
        setCountdown(null);
        setTimeout(() => {
          photo();
          setCapturing(false);
        }, 300);
        return;
      }
      setTimeout(() => {
        setCountdown(count - 1);
        countdownFn(count - 1);
      }, 1000);
    };
    countdownFn(selectedTimer);
  };

  const autoCapturePhotos = async () => {
    if (capturing) return;
    setCapturing(true);
    setPhotos([]);
    setSelectedPhotos([]);

    for (let count = 0; count < photoLimit; count++) {
      for (let i = 3; i > 0; i--) {
        setCountdown(i);
        await new Promise((r) => setTimeout(r, 1000));
      }
      setCountdown(null);
      photo();
      await new Promise((r) => setTimeout(r, 800));
    }
    setCapturing(false);
  };

  const togglePhotoSelection = (url: string) => {
    setSelectedPhotos((prev) =>
      prev.includes(url)
        ? prev.filter((p) => p !== url)
        : prev.length < 4
          ? [...prev, url]
          : prev,
    );
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-white/20 p-6 ">
      <div className="max-w-7xl mx-auto lg:flex gap-12 items-start justify-center mt-30">
        {/* LEFT: MAIN VIEWFINDER */}
        <div className="flex-1 max-w-2xl space-y-8">
          {/* Header Controls */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-3 items-center justify-between bg-white/5 p-2 rounded-3xl backdrop-blur-xl border border-white/10"
          >
            <div className="flex gap-2">
              <button
                onClick={startCamera}
                className="h-10 px-4 bg-white/10 hover:bg-white/20 cursor-pointer rounded-2xl transition flex items-center gap-2 text-sm font-medium"
              >
                <Camera size={18} />{" "}
                <span className="hidden sm:inline">Camera</span>
              </button>

              <Select onValueChange={(v) => setSelectedTimer(Number(v))}>
                <SelectTrigger className="h-10 bg-transparent border-none rounded-2xl hover:bg-white/5 transition px-4 cursor-pointer">
                  <Timer size={18} className="mr-2" />{" "}
                  <SelectValue placeholder="3s" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-900 border-white/10 text-white rounded-2xl">
                  <SelectItem
                    value="3"
                    className="cursor-pointer hover:bg-zinc-800 rounded-full"
                  >
                    3s delay
                  </SelectItem>
                  <SelectItem
                    value="5"
                    className="cursor-pointer hover:bg-zinc-800 rounded-full"
                  >
                    5s delay
                  </SelectItem>
                  <SelectItem
                    value="10"
                    className="cursor-pointer hover:bg-zinc-800 rounded-full "
                  >
                    10s delay
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select
                onValueChange={(v) => {
                  setPhotoLimit(Number(v));
                  setPhotos([]);
                  setSelectedPhotos([]);
                }}
              >
                <SelectTrigger className="h-10 bg-transparent border-none rounded-2xl hover:bg-white/5 transition px-4 cursor-pointer">
                  <Images size={18} className="mr-2" />{" "}
                  <SelectValue placeholder="Limit" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-900 border-white/10 text-white rounded-2xl cursor-pointer">
                  {[1, 3, 4, 6, 8].map((n) => (
                    <SelectItem
                      key={n}
                      value={String(n)}
                      className="cursor-pointer hover:bg-zinc-800 rounded-full"
                    >
                      {n} Photos
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          {/* Video Feed */}
          <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10 bg-black shadow-2xl">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{ filter: filters[selectedFilter] }}
              className="w-full h-full object-cover -scale-x-100"
            />

            {/* Flash Overlay */}
            <AnimatePresence>
              {flash && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-white z-50"
                />
              )}
            </AnimatePresence>

            {/* Countdown Overlay */}
            <AnimatePresence>
              {countdown && (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.5, opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none"
                >
                  <span className="text-9xl font-bold tabular-nums drop-shadow-2xl">
                    {countdown}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <canvas ref={canvasRef} className="hidden" />

          {/* Primary Actions */}
          <div className="flex gap-4 items-center">
            {photos.length < photoLimit ? (
              <>
                <button
                  onClick={takePhoto}
                  disabled={capturing}
                  className="h-16 px-8 bg-white text-black cursor-pointer rounded-[2rem] font-bold flex items-center gap-3 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                  <Aperture size={24} /> Take Photo
                </button>
                <button
                  onClick={autoCapturePhotos}
                  disabled={capturing}
                  className="h-16 w-16 bg-white/10 rounded-full cursor-pointer  flex items-center justify-center hover:bg-white/20 transition-all active:scale-90"
                >
                  <Repeat size={24} />
                </button>
              </>
            ) : (
              <div className="flex w-full justify-between items-center bg-white/5 p-4 rounded-[2.5rem] border border-white/10">
                <div className="pl-4">
                  <p className="text-sm font-medium text-white/50">
                    Ready to print?
                  </p>
                  <p className="text-lg font-bold">
                    {selectedPhotos.length} of 4 selected
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setPhotos([]);
                      setSelectedPhotos([]);
                    }}
                    className="h-12 w-12 bg-white/10 rounded-full flex items-center justify-center"
                  >
                    <RotateCcw size={20} />
                  </button>
                  <button
                    disabled={selectedPhotos.length === 0}
                    onClick={() => {
                      localStorage.setItem(
                        "capturedPhotos",
                        JSON.stringify(selectedPhotos),
                      );
                      router.push("/print");
                    }}
                    className="h-12 px-6 bg-green-500 hover:bg-green-400 disabled:bg-neutral-800 disabled:text-neutral-500 rounded-full font-bold flex items-center gap-2 transition-all cursor-pointer "
                  >
                    Next <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap gap-2 pb-4 no-scrollbar">
            {Object.keys(filters).map((key) => (
              <button
                key={key}
                onClick={() => setSelectedFilter(key)}
                className={`px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedFilter === key
                    ? "bg-white text-black scale-105"
                    : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                {key}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: PREVIEW DRAWER */}
        <div className="lg:w-80 w-full mt-12 lg:mt-0">
          <div className="sticky top-12 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Sparkles size={20} className="text-yellow-500" /> Preview
              </h3>
              {selectedPhotos.length > 0 && (
                <span className="text-xs bg-white/10 px-3 py-1 rounded-full text-white/70">
                  {selectedPhotos.length}/4 Limit
                </span>
              )}
            </div>

            <div className="grid gap-4 max-h-[70vh] overflow-y-auto no-scrollbar pr-2">
              <AnimatePresence mode="popLayout">
                {photos.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="aspect-[3/4] rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-white/20 gap-3"
                  >
                    <Images size={48} />
                    <p className="text-sm">Snap to begin</p>
                  </motion.div>
                ) : (
                  <div
                    className={`grid gap-4 ${
                      photos.length > 4 ? "grid-cols-2" : "grid-cols-1"
                    }`}
                  >
                    {photos.map((photo, i) => {
                      const isSelected = selectedPhotos.includes(photo);
                      const isLimitReached = selectedPhotos.length >= 4;

                      return (
                        <motion.div
                          key={photo}
                          layout
                          initial={{ opacity: 0, y: 20, scale: 0.8 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          whileHover={{
                            scale: !isSelected && isLimitReached ? 1 : 1.02,
                          }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => togglePhotoSelection(photo)}
                          className={`relative cursor-pointer rounded-2xl overflow-hidden shadow-2xl transition-all ${
                            !isSelected && isLimitReached
                              ? "opacity-40 grayscale"
                              : "opacity-100"
                          }`}
                        >
                          <img
                            src={photo}
                            className={`w-full h-full object-cover border-4 transition-colors ${
                              isSelected
                                ? "border-green-500"
                                : "border-transparent"
                            }`}
                          />

                          <div
                            className={`absolute inset-0 bg-black/20 transition-opacity ${
                              isSelected
                                ? "opacity-100"
                                : "opacity-0 hover:opacity-100"
                            }`}
                          />

                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-3 right-3 bg-green-500 p-1 rounded-full shadow-lg"
                            >
                              <CheckCircle2 size={20} />
                            </motion.div>
                          )}

                          <span className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-mono">
                            IMG_00{i + 1}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
