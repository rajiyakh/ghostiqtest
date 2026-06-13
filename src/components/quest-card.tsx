"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { SketchButton } from "./sketch-button";
import { SketchCard } from "./sketch-card";
import { SketchModal } from "./sketch-modal";
import { DoodleCheck } from "./doodles";
import { GhostStar } from "./ghosts";

type QuestCardProps = {
  number: number;
  title: string;
  description: string;
  taskLink: string;
  taskInstructions: string;
  done: boolean;
  onComplete: () => void;
};

export function QuestCard({ number, title, description, taskLink, taskInstructions, done, onComplete }: QuestCardProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: number * 0.1 }}
      >
        <SketchCard className={`relative transition-colors ${done ? "bg-neon-lime/20" : ""}`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="font-hand text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full border-2 border-ink bg-electric-cyan flex-shrink-0">
                {number}
              </div>
              <div>
                <h3 className="font-doodle text-xl text-ink mb-1">{title}</h3>
                <p className="text-sm text-ink/70">{description}</p>
              </div>
            </div>
            {done ? (
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="flex-shrink-0"
              >
                <DoodleCheck className="w-12 h-12" />
              </motion.div>
            ) : null}
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <span
              className={`font-doodle text-sm px-3 py-1 rounded-full border-2 border-ink ${
                done ? "bg-neon-lime text-ink" : "bg-cream text-ink/60"
              }`}
            >
              {done ? "DONE ✓" : "Pending"}
            </span>
            {!done && (
              <SketchButton variant="secondary" size="sm" onClick={() => setModalOpen(true)}>
                Open Task
              </SketchButton>
            )}
          </div>
        </SketchCard>
      </motion.div>

      <SketchModal open={modalOpen} onClose={() => setModalOpen(false)} title={title}>
        <div className="flex flex-col gap-4">
          <div className="flex justify-center">
            <GhostStar className="w-20 h-24" />
          </div>
          <p className="text-ink/80 font-doodle text-base leading-relaxed">{taskInstructions}</p>
          <a
            href={taskLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 font-doodle text-base px-6 py-3 rounded-2xl border-[3px] border-ink bg-electric-cyan sketch-shadow-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(26,26,26,0.85)] transition-all"
          >
            Open Link <ExternalLink size={16} />
          </a>
          <SketchButton
            variant="primary"
            onClick={() => {
              onComplete();
              setModalOpen(false);
            }}
            className="w-full"
          >
            Mark as Complete
          </SketchButton>
        </div>
      </SketchModal>
    </>
  );
}
