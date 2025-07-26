"use client";

import { Button } from "@/components/ui/button";
import ShiftingCountdown from "@/components/rzz-countdown-timer";
import { useTimer } from "@/store/useTimer";
import { getHoursMinutesSeconds } from "@/utils/get-hours-minutes-seconds";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Particles } from "@/components/ui/particles";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useTasks } from "@/store/useTasks";

import { VscDebugStart } from "react-icons/vsc";
import { VscDebugPause } from "react-icons/vsc";
import { VscDebugContinue } from "react-icons/vsc";
import { IoAddOutline } from "react-icons/io5";

import { EditingStatus } from "@/store/useTasks/types";

import TaskDialog from "@/components/task-dialog";
import SpringMotion from "@/components/spring-motion";

import { divideStringByCommaSpace } from "@/utils/divide-string-by-comma-space";

const HomePageComponent = () => {
    // ANCHOR 获取全局变量和方法
    const {
        isRunning,
        mode,
        remainSeconds,
        intervalId,
        setSeconds,
        createAndStartTimer,
        pauseTimer,
        // clearTimer,
        resetAndStartTimer,
        resetCreateWorkTimer,
        resetCreateBreakTimer,
    } = useTimer();

    const { tasks, getTask, editingTask, setEditingTask, countingTask, setCountingTask, setEditingStatus } = useTasks();

    // ANCHOR 状态
    const { theme } = useTheme();
    const [color, setColor] = useState("#ffffff");
    const [showDialog, setShowDialog] = useState(false);

    // ANCHOR 副作用
    useEffect(() => {
        setColor(theme === "dark" ? "#ffffff" : "#000000");
    }, [theme]);

    // ANCHOR 衍生计算
    const [hours, minutes, seconds] = getHoursMinutesSeconds(remainSeconds);
    const canNotModify = intervalId !== null;
    const currentProject = countingTask !== null ? (getTask(countingTask).data ?? null) : null;

    // ANCHOR 处理点击逻辑
    function handleStart(id: number | null, workingSeconds: number, breakingSeconds: number) {
        setSeconds(workingSeconds * 60, breakingSeconds * 60);
        resetCreateWorkTimer(id);
    }

    return (
        <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background mb-4">
            {/* 动效文字 */}
            <SpringMotion modeAndCountingTask={`${mode + countingTask}`} className="my-6 lg:my-18">
                <span
                    className="pointer-events-none whitespace-pre-wrap 
            bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-4xl lg:text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10"
                >
                    NOW : {mode}ING
                </span>
            </SpringMotion>
            <Particles className="absolute inset-0" quantity={100} ease={80} color={color} refresh />
            <section className=" container px-4 md:px-0 mx-auto flex flex-col justify-center items-center gap-4 ">
                {/* ANCHOR 倒计时UI + 按钮组*/}
                <Card className="w-full md:w-1/2 lg:mb-12">
                    {/* ANCHOR 倒计时UI */}
                    <ShiftingCountdown
                        hours={hours}
                        minutes={minutes}
                        seconds={seconds}
                        currentProject={currentProject}
                    />

                    {/* ANCHOR 按钮组 */}
                    <div className="flex gap-2 justify-center">
                        <Button onClick={() => resetCreateWorkTimer(countingTask)} className="w-24">
                            Work
                        </Button>

                        {!isRunning ? (
                            <Button onClick={() => resetAndStartTimer(countingTask)} className="w-24">
                                <VscDebugStart />
                            </Button>
                        ) : canNotModify ? (
                            <Button onClick={pauseTimer} className="w-24">
                                <VscDebugPause />
                            </Button>
                        ) : (
                            <Button onClick={() => createAndStartTimer(countingTask)} className="w-24">
                                <VscDebugContinue />
                            </Button>
                        )}

                        <Button onClick={() => resetCreateBreakTimer(countingTask)} className="w-24">
                            Break
                        </Button>
                    </div>
                </Card>
                {/* ANCHOR 任务卡片UI */}
                <div className="w-full flex flex-wrap justify-center gap-4">
                    {tasks.map(
                        ({
                            id,
                            title,
                            description,
                            tags,
                            remark,
                            workingMinutes,
                            breakingMinutes,
                            completedTimes,
                            targetTimes,
                        }) => (
                            <Card
                                className="w-full md:flex-1 md:max-w-1/2 md:min-w-[calc(30vw)] flex flex-col overflow-hidden "
                                key={`card-${id}`}
                            >
                                <CardHeader className="relative flex-none">
                                    <CardTitle>{title}</CardTitle>
                                    <div className="absolute right-4 top-0 flex gap-1">
                                        <Tooltip>
                                            <TooltipTrigger>🕚 </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Work: {workingMinutes} mins</p>
                                                <p>Break: {breakingMinutes} mins</p>
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

                                <CardContent className="flex-1 flex flex-col">
                                    <p className="text-black/75 mb-2  whitespace-pre-line">
                                        {description && description.length > 100
                                            ? `${description.slice(0, 100)}...`
                                            : description}
                                    </p>
                                    {description && description.length > 100 && (
                                        <div className="ml-auto mb-4" key={`tooltip-${id}`}>
                                            <Tooltip>
                                                <TooltipTrigger>📖</TooltipTrigger>
                                                <TooltipContent className="text-md">
                                                    <p className="break-all hyphens-auto max-w-80">{description}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                    )}
                                    {tags && tags.length > 0 && (
                                        <div className="w-full flex flex-wrap justify-end gap-1 mt-auto">
                                            {divideStringByCommaSpace(tags).map((tag, index) => (
                                                <Badge variant="outline" key={`tag-${index}`}>
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>

                                <CardFooter className="flex-none w-full flex flex-row justify-end items-center gap-2 mt-auto">
                                    {/* 任务进度 */}
                                    <div className="mr-auto font-mono font-bold text-xs">
                                        {completedTimes} / {targetTimes}
                                    </div>
                                    {/* 按钮组 */}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-8"
                                        onClick={() => {
                                            setEditingStatus(EditingStatus.DELETE);
                                            setEditingTask(id);
                                            setShowDialog(true);
                                        }}
                                        disabled={canNotModify}
                                    >
                                        🗑️
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-8"
                                        onClick={() => {
                                            setEditingStatus(EditingStatus.EDIT);
                                            setEditingTask(id);
                                            setShowDialog(true);
                                        }}
                                        disabled={canNotModify}
                                    >
                                        ✏️
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-8"
                                        onClick={() => {
                                            setCountingTask(id);
                                            handleStart(id, workingMinutes, breakingMinutes);
                                        }}
                                        disabled={canNotModify}
                                    >
                                        ▶️
                                    </Button>
                                </CardFooter>
                            </Card>
                        )
                    )}
                    {/* 空白卡片,用于增加新任务 */}
                    <Card className="w-full md:flex-1 md:max-w-1/2 md:min-w-[calc(30vw)] flex justify-center items-center">
                        <IoAddOutline
                            size={28}
                            className="cursor-pointer"
                            onClick={() => {
                                const latestId = useTasks.getState().getLatestId();
                                setEditingStatus(EditingStatus.ADD);
                                setEditingTask(latestId + 1);
                                setShowDialog(true);
                            }}
                        />
                    </Card>
                </div>
                {/* TODO 做一个给我买咖啡功能 */}
            </section>
            <TaskDialog showDialog={showDialog} setShowDialog={setShowDialog} intervalId={intervalId} />
            {/* TEST PART */}
            {/* <div className="flex flex-col items-center gap-4">
                {isRunning ? <div>isRunning</div> : <div>notRunning</div>}
                {canNotModify ? <div>interval</div> : <div>no interval</div>}
                <div className="text-4xl font-bold">
                    Remain
                    <span className="text-red-700"> {remainSeconds} </span>
                    Seconds
                </div>
                <div>Now {mode}ING </div>
                <div>remainSeconds:{remainSeconds}</div>
                <div>{countingTask ?? "no task"}</div>
                <div>{editingTask}</div>
            </div> */}
        </section>
    );
};
export default HomePageComponent;
