import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { cn } from "@/lib/cn";

// ─── Configuration (easy to tweak) ───────────────────────────
const CONFIG = {
  /** The question displayed */
  question: "Veux-tu être ma Valentine ? 💌",

  /** Labels the "Yes" button cycles through on each "No" hover */
  yesLabels: [
    "Oui 🥰",
    "Ouiii ! 💕",
    "OUIII !!! 😍",
    "ÉVIDEMMENT 💖",
    "BIEN SÛR !! 🔥",
    "C'EST OUI !! 💘",
    "ABSOLUMENT !! 🥳",
  ],

  /** Label for the "No" button */
  noLabel: "Non 😢",

  /** How many pixels the "No" button jumps each escape */
  escapeDistance: 220,

  /** Scale increment for the "Yes" button per hover on "No" */
  yesScaleStep: 0.12,

  /** Base scale of the "Yes" button */
  yesBaseScale: 1,

  /** Max scale the "Yes" button can reach */
  yesMaxScale: 2,

  /** Message displayed once "Yes" is clicked */
  acceptedMessage: "Je le savais Clara !! 🥰❤️‍🔥",

  /** Heart confetti settings */
  confetti: {
    scalar: 2,
    spread: 180,
    particleCount: 300,
    origin: { y: -0.1 },
    startVelocity: -35,
    colors: ["#f93963", "#a10864", "#ee0b93"],
  },

  heartPath:
    "M167 72c19,-38 37,-56 75,-56 42,0 76,33 76,75 0,76 -76,151 -151,227 -76,-76 -151,-151 -151,-227 0,-42 33,-75 75,-75 38,0 57,18 76,56z",
  heartMatrix: [
    0.03333333333333333,
    0,
    0,
    0.03333333333333333,
    -5.566666666666666,
    -5.533333333333333,
  ],
};

const HEART_SHAPE = confetti.shapeFromPath({
  path: CONFIG.heartPath,
  matrix: CONFIG.heartMatrix,
});

// ─── Component ───────────────────────────────────────────────
export default function ValentineQuestion() {
  const [yesIndex, setYesIndex] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const [noPos, setNoPos] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const yesScale = Math.min(
    CONFIG.yesBaseScale + yesIndex * CONFIG.yesScaleStep,
    CONFIG.yesMaxScale
  );

  const fireHeartConfetti = useCallback(() => {
    if (typeof window === "undefined") return;
    confetti({
      ...CONFIG.confetti,
      shapes: [HEART_SHAPE],
    });
  }, []);

  const escapeNo = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const viewportWidth = typeof window !== "undefined" ? window.innerWidth : rect.width;
    const viewportHeight = typeof window !== "undefined" ? window.innerHeight : rect.height;
    const maxX = viewportWidth / 2 - 80;
    const maxY = viewportHeight / 2 - 80;

    const minRealDistance = CONFIG.escapeDistance * 0.85;
    // Minimum distance from center to avoid hiding behind "Yes" button
    const minDistFromCenter = Math.max(160, CONFIG.escapeDistance * 1.1);

    setNoPos((prev) => {
      const origin = prev ?? { x: 0, y: 0 };
      let nx: number, ny: number;
      let attempts = 0;

      // Keep generating until the button actually moves far enough AND stays away from center
      do {
        const angle = Math.random() * Math.PI * 2;
        const dist = CONFIG.escapeDistance + Math.random() * 80;
        nx = origin.x + Math.cos(angle) * dist;
        ny = origin.y + Math.sin(angle) * dist;
        // Clamp inside container
        nx = Math.max(-maxX, Math.min(maxX, nx));
        ny = Math.max(-maxY, Math.min(maxY, ny));
        attempts++;
        // If stuck at boundary, flip to opposite side
        if (attempts > 8) {
          nx = (Math.random() > 0.5 ? 1 : -1) * (minDistFromCenter + Math.random() * 60);
          ny = (Math.random() > 0.5 ? 1 : -1) * (minDistFromCenter / 2 + Math.random() * 40);
          nx = Math.max(-maxX, Math.min(maxX, nx));
          ny = Math.max(-maxY, Math.min(maxY, ny));
          break;
        }
      } while (
        Math.sqrt((nx - origin.x) ** 2 + (ny - origin.y) ** 2) < minRealDistance ||
        Math.sqrt(nx ** 2 + ny ** 2) < minDistFromCenter
      );

      return { x: nx, y: ny };
    });

    // Advance the "Yes" label
    setYesIndex((i) => Math.min(i + 1, CONFIG.yesLabels.length - 1));
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex flex-col justify-center items-center gap-8"
    >
      <AnimatePresence mode="wait">
        {!accepted ? (
          <motion.div
            key="question"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex flex-col w-full justify-center items-center"
          >
            {/* Question */}
            <h2 className="text-rose-100 text-xl md:text-2xl text-center leading-relaxed">
              {CONFIG.question}
            </h2>

            {/* Buttons */}
            <div className="relative flex justify-center items-center gap-6 w-full min-h-52">
              {/* Yes button */}
              <motion.button
                onClick={() => {
                  setAccepted(true);
                  fireHeartConfetti();
                }}
                animate={{ scale: yesScale }}
                whileHover={{ scale: yesScale * 1.08 }}
                whileTap={{ scale: yesScale * 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={cn(
                  "px-8 py-3 rounded-full font-bold cursor-pointer z-10",
                  "bg-rose-500 text-white",
                  "shadow-[0_0_25px_rgba(251,113,133,0.5)]",
                  "hover:bg-rose-400 hover:shadow-[0_0_35px_rgba(251,113,133,0.7)]",
                  "transition-colors duration-200"
                )}
              >
                {CONFIG.yesLabels[yesIndex]}
              </motion.button>

              {/* No button — starts inline, escapes on hover / touch */}
              <motion.button
                onMouseEnter={escapeNo}
                onTouchStart={escapeNo}
                animate={noPos ? { x: noPos.x, y: noPos.y } : undefined}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                style={noPos ? { position: "absolute", left: "50%", top: "50%", translateX: "-50%", translateY: "-50%" } : undefined}
                className={cn(
                  "px-6 py-3 select-none rounded-full font-bold cursor-pointer",
                  "bg-transparent border border-rose-400/40 text-rose-300",
                  "hover:border-rose-400/60",
                  "transition-colors duration-200"
                )}
              >
                {CONFIG.noLabel}
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="accepted"
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="flex flex-col items-center gap-4"
          >
            {/* Celebration */}
            <motion.span
              className="text-5xl"
              animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              💖
            </motion.span>
            <p className="text-rose-100 text-2xl md:text-3xl text-center">
              {CONFIG.acceptedMessage}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
