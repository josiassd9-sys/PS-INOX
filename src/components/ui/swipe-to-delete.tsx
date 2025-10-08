
"use client";

import * as React from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";

interface SwipeToDeleteProps {
  children: React.ReactNode;
  onDelete: () => void;
}

const SWIPE_THRESHOLD = -100;

export function SwipeToDelete({ children, onDelete }: SwipeToDeleteProps) {
  const x = useMotionValue(0);

  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x < SWIPE_THRESHOLD) {
      setIsDeleting(true);
      onDelete();
    }
  };
  
  const background = useTransform(
    x,
    [-150, 0],
    ["hsl(var(--destructive))", "hsl(var(--muted) / 0)"]
  );

  const iconOpacity = useTransform(
      x,
      [-60, -20],
      [1, 0]
  )

  if (isDeleting) {
    return null; // The parent component will handle the removal from the list
  }

  return (
    <div className="relative w-full overflow-hidden">
        <motion.div 
            className="absolute inset-0 flex items-center justify-end pr-8"
            style={{ background }}
        >
            <motion.div style={{ opacity: iconOpacity }}>
                <Trash2 className="text-destructive-foreground" />
            </motion.div>
        </motion.div>
      <motion.div
        className="relative bg-background cursor-grab"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        style={{ x }}
        onDragEnd={handleDragEnd}
      >
        {children}
      </motion.div>
    </div>
  );
}
