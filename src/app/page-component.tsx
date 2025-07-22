"use client";

import { Button } from "@/components/ui/button";
import ShiftingCountdown from "@/components/rzz-countdown-timer";
import { useTimer } from "@/store/useTimer";
import { getHoursMinutesSeconds } from "@/utils/get-hours-minutes-seconds";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Particles } from "@/components/ui/particles";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const CardInfo = {
    title: "Study WEB3",
    description: "I should finish the course of WEB3 this month.",
    tags: ["study", "course", "web3"],
    remark: "I hate testing!",
    workingSeconds: 45,
    breakingSeconds: 15,
};

const CardInfoGroup = [CardInfo, CardInfo, CardInfo];

const HomePageComponent = () => {
    // 获取全局变量和方法
    const {
        isRunning,
        mode,
        workSeconds,
        breakSeconds,
        remainSeconds,
        intervalId,
        setSeconds,
        createTimer,
        clearTimer,
        resetTimer,
        resetAndStartTimer,
        resetCreateWorkTimer,
        resetCreateBreakTimer,
    } = useTimer();
    const { theme } = useTheme();
    const [color, setColor] = useState("#ffffff");

    useEffect(() => {
        setColor(theme === "dark" ? "#ffffff" : "#000000");
    }, [theme]);

    const [hours, minutes, seconds] = getHoursMinutesSeconds(remainSeconds);

    function handleStart(workingSeconds: number, breakingSeconds: number) {
        setSeconds(workingSeconds * 60, breakingSeconds * 60);
        resetCreateWorkTimer();
    }

    return (
        <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background">
            <span
                className="mb-32 pointer-events-none whitespace-pre-wrap 
            bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10"
            >
                NOW : {mode}ING
            </span>
            <Particles className="absolute inset-0" quantity={100} ease={80} color={color} refresh />
            <section className=" container mx-auto flex flex-col justify-center items-center gap-4">
                {/* 倒计时UI + 按钮组*/}
                <Card className="w-xs sm:w-sm md:w-md lg:w-lg xl:w-xl">
                    {/* 倒计时UI */}
                    <ShiftingCountdown hours={hours} minutes={minutes} seconds={seconds} />

                    {/* 按钮组 */}
                    <div className="flex gap-2 justify-center">
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
                </Card>
                {/* 任务卡片UI */}
                <div className="flex flex-wrap justify-center gap-4">
                    {CardInfoGroup.map(({ title, description, tags, remark, workingSeconds, breakingSeconds }) => (
                        <Card className="w-full max-w-xs">
                            <CardHeader className="relative">
                                <CardTitle>{title}</CardTitle>
                                {/* <CardDescription className="mt-2 ml-auto">
                                    {workingSeconds} mins / {breakingSeconds} mins
                                </CardDescription> */}
                                <div className="absolute right-4 top-0 flex gap-1">
                                    <Tooltip>
                                        <TooltipTrigger>🕚 </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Work: {workingSeconds} mins</p>
                                            <p>Break: {breakingSeconds} mins</p>
                                        </TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger>📑 </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{remark}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                            </CardHeader>
                            <CardContent className="max-w-xs">
                                <p className="text-black/75 mb-2">{description}</p>
                                <div className="w-full flex justify-end gap-2">
                                    {tags.map((tag) => (
                                        <Badge variant="outline">{tag}</Badge>
                                    ))}
                                </div>
                            </CardContent>

                            <CardFooter className="flex flex-col gap-2">
                                <Button
                                    className="ml-auto"
                                    onClick={() => handleStart(workingSeconds, breakingSeconds)}
                                    disabled={isRunning}
                                >
                                    Start
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </section>
        </section>
    );
};
export default HomePageComponent;

/* <div className="flex flex-col items-center gap-4">
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
                <div>remainSeconds:{remainSeconds}</div>
                <div>hour:{hours}</div>
                <div>minute:{minutes}</div>
                <div>seconds:{seconds}</div>
                </div> */
