
"use client";

import * as React from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Trash2 } from "lucide-react";
import { TableRow } from "./table";

interface SwipeToDeleteProps {
  children: React.ReactNode;
  onDelete: () => void;
  className?: string;
  [key: string]: any; 
}

const SWIPE_THRESHOLD = -100;

export const SwipeToDelete = React.forwardRef<HTMLTableRowElement, SwipeToDeleteProps>(
  ({ children, onDelete, className, ...props }, ref) => {
    const x = useMotionValue(0);

    const handleDragEnd = (event: any, info: any) => {
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
        <TableRow
            ref={ref}
            className="relative" // A row is the container now
            {...props}
        >
            <motion.td
                colSpan={React.Children.count(children)}
                style={{ background }}
                className="absolute inset-0 flex items-center justify-end pr-8 z-0"
            >
                <motion.div style={{ opacity: iconOpacity }}>
                    <Trash2 className="text-destructive-foreground" />
                </motion.div>
            </motion.td>
            <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                style={{ x }}
                onDragEnd={handleDragEnd}
                className="contents z-10 cursor-grab" // 'contents' makes this div layout-less
            >
                {children}
            </motion.div>
        </TableRow>
    );
  }
);
SwipeToDelete.displayName = "SwipeToDelete";
