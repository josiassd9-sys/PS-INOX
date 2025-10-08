"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { TableRow } from "./table";

const TR_HEIGHT = 49; // A altura aproximada de uma linha da tabela

export function SwipeToDelete({
  children,
  onDelete,
}: {
  children: React.ReactNode;
  onDelete: () => void;
}) {
  const x = useMotionValue(0);
  const background = useTransform(
    x,
    [-150, 0, 150],
    ["#ef4444", "#3a3a3a", "#ef4444"]
  );

  return (
    <motion.div
      style={{ background }}
      className="relative"
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: TR_HEIGHT }}
    >
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        style={{ x }}
        onDragEnd={(_, info) => {
          if (Math.abs(info.offset.x) > 150) {
            onDelete();
          }
        }}
        className="relative z-10"
      >
        <TableRow className="border-b transition-colors data-[state=selected]:bg-muted relative z-10 cursor-grab bg-card">
          {children}
        </TableRow>
      </motion.div>
    </motion.div>
  );
}
