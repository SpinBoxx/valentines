import { cn } from "@/lib/cn";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";

interface Step {
  title?: string;
  content: React.ReactNode;
}

interface Props {
  steps: Step[];
  className?: string;
}

export default function Stepper({ steps, className }: Props) {
  const [step, setStep] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1);

  const prev = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const next = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
      scale: 0.95,
      filter: "blur(6px)",
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
      scale: 0.95,
      filter: "blur(6px)",
    }),
  };

  return (
    <div className={cn("flex flex-col items-center gap-10", className)}>
      {/* Dots indicator */}
      <div className="flex items-center gap-3">
        {steps.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > step ? 1 : -1);
              setStep(index);
            }}
            className="group relative cursor-pointer"
          >
            <motion.div
              className={cn(
                "size-3 rounded-full transition-colors duration-300",
                index === step
                  ? "bg-rose-400 shadow-[0_0_10px_rgba(251,113,133,0.6)]"
                  : "bg-rose-200/40 hover:bg-rose-300/60"
              )}
              animate={index === step ? { scale: [1, 1.3, 1] } : { scale: 1 }}
              transition={
                index === step
                  ? { repeat: Infinity, duration: 1.8, ease: "easeInOut" }
                  : {}
              }
            />
          </button>
        ))}
      </div>

      {/* Step content */}
      <div className="relative w-full max-w-lg min-h-50 flex items-center justify-center">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
          >
            {steps[step]?.title && (
              <motion.h2
                className="text-rose-300 text-sm uppercase tracking-widest mb-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.3 }}
              >
                {steps[step]?.title}
              </motion.h2>
            )}
            <div className="text-rose-50 text-xl md:text-2xl leading-relaxed">
              {steps[step]?.content}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-6">
        <button
          onClick={prev}
          disabled={step === 0}
          className={cn(
            "p-3 rounded-full border border-rose-400/30 backdrop-blur-sm transition-all duration-300",
            step === 0
              ? "opacity-20 cursor-not-allowed"
              : "hover:bg-rose-500/20 hover:border-rose-400/60 hover:shadow-[0_0_15px_rgba(251,113,133,0.3)] cursor-pointer"
          )}
        >
          <ChevronLeft className="size-5 text-rose-300" />
        </button>

        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <Heart className="size-5 text-rose-400 fill-rose-400" />
        </motion.div>

        <button
          onClick={next}
          disabled={step === steps.length - 1}
          className={cn(
            "p-3 rounded-full border border-rose-400/30 backdrop-blur-sm transition-all duration-300",
            step === steps.length - 1
              ? "opacity-20 cursor-not-allowed"
              : "hover:bg-rose-500/20 hover:border-rose-400/60 hover:shadow-[0_0_15px_rgba(251,113,133,0.3)] cursor-pointer"
          )}
        >
          <ChevronRight className="size-5 text-rose-300" />
        </button>
      </div>

      {/* Step counter */}
      <span className="text-rose-300/50 text-xs tracking-wider">
        {step + 1} / {steps.length}
      </span>
    </div>
  );
}