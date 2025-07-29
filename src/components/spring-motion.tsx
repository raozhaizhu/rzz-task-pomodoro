"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SpringMotionProps {
    children: ReactNode;
    className?: string;
    modeAndCountingTask: string;
}

const SpringMotion = ({ children, className, modeAndCountingTask }: SpringMotionProps) => {
    return (
        <motion.div
            key={modeAndCountingTask}
            className={cn(className)}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                delay: 0.2,
                duration: 0.8,
                // ease: "easeIn",
                type: "spring",
                stiffness: 100,
                damping: 10,
                mass: 0.5,
            }}
        >
            {children}
        </motion.div>
    );
};
export default SpringMotion;
