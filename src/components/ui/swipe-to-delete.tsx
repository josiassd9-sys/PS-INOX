
"use client";

import * as React from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { Trash2 } from "lucide-react";
import { TableCell, TableRow } from "./table";
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
    
    return (
        <TableRow className="relative group contents">
            {/* Background for delete indicator */}
            <TableCell 
                colSpan={React.Children.count(children)} 
                className="absolute inset-0 z-0 p-0"
            >
                <motion.div 
                    style={{ background }}
                    className="h-full w-full flex items-center justify-end pr-8"
                >
                    <motion.div style={{ opacity: iconOpacity }}>
                        <Trash2 className="text-destructive-foreground" />
                    </motion.div>
                </motion.div>
            </TableCell>

            {/* Draggable foreground content */}
            <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                style={{ x }}
                onDragEnd={handleDragEnd}
                className="contents z-10 cursor-grab"
            >
              {children}
            </motion.div>
        </TableRow>
    );
};
SwipeToDelete.displayName = "SwipeToDelete";
