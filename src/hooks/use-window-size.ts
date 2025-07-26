"use client";

import { useEffect, useState } from "react";

export function useWindowSize() {
    const [size, setSize] = useState<{ width?: number; height?: number }>({});

    useEffect(() => {
        function handleResize() {
            setSize({ width: window.innerWidth, height: window.innerHeight });
        }

        handleResize();

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return size;
}
