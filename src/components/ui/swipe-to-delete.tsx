
"use client";

import * as React from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Trash2 } from "lucide-react";

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
      <motion.tr
        ref={ref}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        style={{ x }}
        onDragEnd={handleDragEnd}
        className={`relative cursor-grab ${className || ''}`}
        {...props}
      >
        <motion.td
            colSpan={3}
            style={{ background }}
            className="absolute inset-0 flex items-center justify-end pr-8 z-0"
        >
            <motion.div style={{ opacity: iconOpacity }}>
                <Trash2 className="text-destructive-foreground" />
            </motion.div>
        </motion.td>
        {React.Children.map(children, (child) => 
            React.isValidElement(child) 
            ? React.cloneElement(child, {
                ...child.props,
                className: `${child.props.className || ''} relative z-10 bg-transparent`
              })
            : child
        )}
      </motion.tr>
    );
  }
);
SwipeToDelete.displayName = "SwipeToDelete";
