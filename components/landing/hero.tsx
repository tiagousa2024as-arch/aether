"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sparkles, Command } from "lucide-react";

const COMMAND_TEXT = "Aether, organize my work tomorrow";
const TYPING_INTERVAL = 60;
const PAUSE_AT_END = 2000;
const RESTART_DELAY = 800;

export function Hero() {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let i = 0;
    let cursorInterval: ReturnType<typeof setInterval>;
    let restartTimeout: ReturnType<typeof setTimeout>;

    const type = () => {
      if (i <= COMMAND_TEXT.length) {
        setDisplayText(COMMAND_TEXT.slice(0, i));
        i++;
        setTimeout(type, TYPING_INTERVAL);
      } else {
        setIsComplete(true);
        cursorInterval = setInterval(() => setShowCursor((c) => !c), 530);
        restartTimeout = setTimeout(() => {
          clearInterval(cursorInterval);
          setIsComplete(false);
          setShowCursor(true);
          i = 0;
          setDisplayText("");
          setTimeout(type, RESTART_DELAY);
        }, PAUSE_AT_END);
      }
    };

    const start = setTimeout(type, 600);

    return () => {
      clearTimeout(start);
      clearInterval(cursorInterval!);
      clearTimeout(restartTimeout!);
    };
  }, []);

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden px-4 pt-20 pb-32">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[120px] -top-48 -left-48 bg-violet-500"
          animate={{
            x: [0, 30, 0],
            y: [0, 20, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full opacity-20 blur-[100px] top-1/2 -right-32 bg-blue-500"
          animate={{
            x: [0, -20, 0],
            y: [0, 30, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full opacity-15 blur-[80px] bottom-0 left-1/2 -translate-x-1/2 bg-cyan-500"
          animate={{
            y: [0, -15, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-white/90 mb-8"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>AI operating layer for your work</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-white mb-6"
        >
          One command.
          <br />
          <span className="gradient-text">Infinite possibilities.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-12"
        >
          Execute tasks, automate workflows, and get more done with AI agents that understand your context.
        </motion.p>

        {/* Fake interactive command bar */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="relative max-w-2xl mx-auto mb-12"
        >
          <div className="glass-strong rounded-2xl p-2 glow border-white/20 shadow-2xl">
            <div className="flex items-center gap-3 px-4 py-4 sm:py-5 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/30 to-blue-500/30 border border-white/10 shrink-0">
                <Command className="w-5 h-5 text-white/90" />
              </div>
              <div className="flex-1 flex items-center min-h-[28px] text-left">
                <span className="text-white font-medium text-base sm:text-lg">
                  {displayText}
                  <span
                    className={`inline-block w-0.5 h-5 sm:h-6 ml-0.5 bg-cyan-400 align-middle ${
                      showCursor ? "opacity-100" : "opacity-0"
                    }`}
                    style={{ animation: "none" }}
                  />
                </span>
              </div>
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-white/10 text-white/60 text-xs font-medium border border-white/10">
                ↵ Enter
              </kbd>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            asChild
            size="lg"
            className="h-12 px-8 rounded-xl bg-white text-slate-900 hover:bg-white/90 font-semibold text-base shadow-lg shadow-white/10"
          >
            <Link href="/signup">Get early access</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-12 px-8 rounded-xl border-white/20 bg-white/5 text-white hover:bg-white/10 font-medium text-base"
          >
            <Link href="/login">Sign in</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
