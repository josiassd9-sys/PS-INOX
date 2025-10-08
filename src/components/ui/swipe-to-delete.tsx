
"use client";

import * as React from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Trash2 } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";

interface SwipeToDeleteProps {
  children: React.ReactElement;
  onDelete: () => void;
  asChild?: boolean;
  className?: string;
  [key: string]: any; // Allow other props to be passed down
}

const SWIPE_THRESHOLD = -100;

export const SwipeToDelete = React.forwardRef<any, SwipeToDeleteProps>(
  ({ children, onDelete, asChild = false, className, ...props }, ref) => {
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

    const iconOpacity = useTransform(
        x,
        [-60, -20],
        [1, 0]
    );

    const Comp = asChild ? Slot : motion.div;

    // We need to clone the child to pass the motion props to it
    const childWithProps = React.cloneElement(children, {
      ...children.props,
      ...props, // Pass layout, initial, animate, etc.
      ref,
      className: `relative z-10 bg-background cursor-grab ${children.props.className || ''}`,
      drag: "x",
      dragConstraints: { left: 0, right: 0 },
      style: { x, ...children.props.style },
      onDragEnd: handleDragEnd,
    });

    return (
      <div className={`relative w-full overflow-hidden ${className}`}>
          <motion.div
              className="absolute inset-0 flex items-center justify-end pr-8 z-0"
              style={{ background }}
          >
              <motion.div style={{ opacity: iconOpacity }}>
                  <Trash2 className="text-destructive-foreground" />
              </motion.div>
          </motion.div>
          {childWithProps}
      </div>
    );
  }
);
SwipeToDelete.displayName = "SwipeToDelete"
