"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useWindowSize } from "@/hooks/use-window-size";

interface SpringMotionProps {
    children: ReactNode;
    className?: string;
    modeAndCountingTask: string;
}

const SpringMotion = ({ children, className, modeAndCountingTask }: SpringMotionProps) => {
    const [responsiveY, setResponsiveY] = useState<number>(0);
    const { width } = useWindowSize();
    useEffect(() => {
        if (width !== undefined) {
            setResponsiveY(width <= 768 ? 0 : 50);
        }
    }, [width]);

    return (
        <>
            <motion.div
                key={`${modeAndCountingTask}-${responsiveY}`}
                className={cn(className)}
                initial={{ opacity: 0, y: responsiveY }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    delay: 0.2,
                    duration: 0.5,
                    // ease: "easeIn",
                    type: "spring",
                    stiffness: 100,
                    damping: 10,
                    mass: 0.5,
                }}
            >
                {children}
            </motion.div>
        </>
    );
};
export default SpringMotion;
