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
        resetAndStartTimer,
        resetCreateWorkTimer,
        resetCreateBreakTimer,
    } = useTimer();

    return (
        <>
            <section className="w-full flex flex-col justify-center items-center gap-8 ">
                {/* 测试UI展示 */}
                {/* <div className="flex flex-col items-center gap-4">
                    {isRunning ? <div>isRunning</div> : <div>notRunning</div>}
                    {intervalId !== null ? <div>interval</div> : <div>no interval</div>}
                    <div className="text-4xl font-bold">
                        Remain
                        <span className="text-red-700"> {remainSeconds} </span>
                        Seconds
                    </div>
                    <div>Now {mode}ING </div>
                    <div>Work Seconds : {workSeconds} S </div>
                    <div>Break Seconds : {breakSeconds} S </div>
                </div> */}
                {/* 生产AI展示 */}

                {/* 按钮组 */}
                <div className="flex gap-2">
                    <Button onClick={resetCreateWorkTimer} className="w-24">
                        Work
                    </Button>
                    <Button onClick={resetCreateBreakTimer} className="w-24">
                        Break
                    </Button>
                    {isRunning ? (
                        <Button onClick={clearTimer} className="w-24">
                            Pause
                        </Button>
                    ) : remainSeconds < 1 ? (
                        <Button onClick={resetAndStartTimer} className="w-24">
                            Start
                        </Button>
                    ) : (
                        <Button onClick={createTimer} className="w-24">
                            Resume
                        </Button>
                    )}
                    {/* <Button onClick={resetTimer} className="w-24">
                        Reset
                    </Button> */}
                </div>
            </section>
        </>
    );
};
export default HomePageComponent;
