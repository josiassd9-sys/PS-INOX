
"use client";

import * as React from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { Trash2 } from "lucide-react";
import { TableRow } from "./table";
import { cn } from "@/lib/utils";

interface SwipeToDeleteProps {
  children: React.ReactNode;
  onDelete: () => void;
}

const SWIPE_THRESHOLD = -100;

export const SwipeToDelete = ({ children, onDelete }: SwipeToDeleteProps) => {
    const x = useMotionValue(0);

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (info.offset.x < SWIPE_THRESHOLD) {
        onDelete();
      }
    };

    const background = useTransform(
      x,
      [-150, 0],
      ["hsl(var(--destructive))", "hsl(var(--background))"]
    );

    const iconOpacity = useTransform(x, [-60, -20], [1, 0]);
    
    // Ensure children are valid React elements before cloning
    const validChildren = React.Children.toArray(children).filter(React.isValidElement);

    return (
        <TableRow className="relative group">
            {/* Background layer for the delete indicator */}
            <motion.td
                colSpan={validChildren.length}
                style={{ background }}
                className="absolute inset-0 flex items-center justify-end pr-8 z-0"
            >
                <motion.div style={{ opacity: iconOpacity }}>
                    <Trash2 className="text-destructive-foreground" />
                </motion.div>
            </motion.td>
            
            {/* Foreground layer that is draggable */}
            <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                style={{ x }}
                onDragEnd={handleDragEnd}
                className="contents z-10 cursor-grab"
            >
              {/* Render children directly. They should be TableCell components */}
              {children}
            </motion.div>
        </TableRow>
    );
};
SwipeToDelete.displayName = "SwipeToDelete";
