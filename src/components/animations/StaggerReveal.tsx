"use client";

import { motion } from "framer-motion";
import { ReactNode, Children, isValidElement } from "react";

interface StaggerRevealProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export default function StaggerReveal({ 
  children, 
  className = "",
  staggerDelay = 0.15 
}: StaggerRevealProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay
      }
    }
  };

  const childVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
    }
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-5% 0px" }}
      variants={containerVariants}
    >
      {Children.map(children, (child) => {
        if (isValidElement(child)) {
          return (
            <motion.div variants={childVariants} style={{ height: "100%" }}>
              {child}
            </motion.div>
          );
        }
        return child;
      })}
    </motion.div>
  );
}
