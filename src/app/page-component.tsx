"use client";

import { Button } from "@/components/ui/button";
import { useTimer } from "@/store/useTimer";

const HomePageComponent = () => {
    const {
        isRunning,
        mode,
        workSeconds,
        breakSeconds,
        remainSeconds,
        intervalId,
        createTimer,
        clearTimer,
        resetTimer,
        resetCreateWorkTimer,
        resetCreateBreakTimer,
        resetCreateToggledTimer,
    } = useTimer();

    return (
        <>
            <section className="w-full flex flex-col justify-center items-center gap-8 ">
                <div className="flex flex-col items-center gap-4">
                    {isRunning ? <div>isRunning</div> : <div>notRunning</div>}
                    {intervalId !== null ? <div>interval</div> : <div>no interval</div>}
                    <div>Remain {remainSeconds} Seconds</div>
                    <div>Now {mode}ING </div>
                    <div>Work Seconds : {workSeconds} S </div>
                    <div>Break Seconds : {breakSeconds} S </div>
                </div>
                <div className="flex gap-4">
                    <Button onClick={resetCreateWorkTimer}>resetCreateWorkTimer</Button>
                    <Button onClick={resetCreateBreakTimer}>resetCreateBreakTimer</Button>
                    <Button onClick={resetCreateToggledTimer}>resetCreateToggledTimer</Button>
                    <Button onClick={createTimer}>createTimer</Button>
                    <Button onClick={clearTimer}>clearTimer</Button>
                    <Button onClick={resetTimer}>resetTimer</Button>
                </div>
            </section>
        </>
    );
};
export default HomePageComponent;
