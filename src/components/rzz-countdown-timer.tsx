"use client";

interface Props {
    hours: number;
    minutes: number;
    seconds: number;
}

export default function ShiftingCountdown({ hours, minutes, seconds }: Props) {
    return (
        <>
            <section className=" dark:bg-black bg-white dark:text-white text-black flex items-center justify-center p-4 transition-colors duration-500">
                <div className="flex w-full max-w-5xl items-center bg-transparent">
                    <CountdownItem unit={String(hours)} label="Hours" />
                    <CountdownItem unit={String(minutes)} label="Minutes" />
                    <CountdownItem unit={String(seconds)} label="Seconds" />
                </div>
            </section>
        </>
    );
}

function CountdownItem({ unit, label }: { unit: string; label: string }) {
    return (
        <div className="flex flex-1 flex-col items-center justify-center gap-1 px-4 py-6 md:gap-2 md:py-8">
            <div className="relative w-full overflow-hidden text-center">
                <span className="block text-3xl font-mono font-semibold dark:text-white text-black md:text-5xl lg:text-7xl transition-colors duration-500">
                    {Number(unit) < 10 ? `0${unit}` : unit}
                </span>
            </div>
            <span className="text-sm font-light dark:text-gray-400 text-gray-500 md:text-base lg:text-lg transition-colors duration-500">
                {label}
            </span>
            <div className="h-px w-full dark:bg-gray-700 bg-gray-300 mt-4 transition-colors duration-500"></div>
        </div>
    );
}
