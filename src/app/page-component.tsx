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
import { ActionType, IdActionType } from "./types";
import { IoAddOutline } from "react-icons/io5";

import TaskDialog from "@/components/task-dialog";
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
        clearTimer,
        resetAndStartTimer,
        resetCreateWorkTimer,
        resetCreateBreakTimer,
    } = useTimer();
    const { tasks, getTask } = useTasks();

    // ANCHOR 状态
    const { theme } = useTheme();
    const [color, setColor] = useState("#ffffff");
    const [showDialog, setShowDialog] = useState(false);
    const [idActionType, setIdActionType] = useState<IdActionType>({ id: null, action: ActionType.ADD }); // 该任务仅用于跟踪当前正在增删查改的任务
    const [currentTask, setCurrentTask] = useState<number | null>(null); // 该任务仅用于监控当前正在倒计时的任务

    // ANCHOR 副作用
    useEffect(() => {
        setColor(theme === "dark" ? "#ffffff" : "#000000");
    }, [theme]);

    // ANCHOR 衍生计算
    const [hours, minutes, seconds] = getHoursMinutesSeconds(remainSeconds);
    const canNotModify = intervalId !== null;
    const currentProject = currentTask !== null ? (getTask(currentTask).data ?? null) : null;

    // ANCHOR 处理点击逻辑
    function handleStart(id: number | null, workingSeconds: number, breakingSeconds: number) {
        setSeconds(workingSeconds * 60, breakingSeconds * 60);
        resetCreateWorkTimer(id);
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
                {/* ANCHOR 倒计时UI + 按钮组*/}
                <Card className="w-xs sm:w-sm md:w-md lg:w-lg xl:w-xl">
                    {/* ANCHOR 倒计时UI */}
                    <ShiftingCountdown
                        hours={hours}
                        minutes={minutes}
                        seconds={seconds}
                        currentProject={currentProject}
                    />

                    {/* ANCHOR 按钮组 */}
                    <div className="flex gap-2 justify-center">
                        <Button onClick={() => resetCreateWorkTimer(currentTask)} className="w-24">
                            Work
                        </Button>

                        {!isRunning ? (
                            <Button onClick={() => resetAndStartTimer(currentTask)} className="w-24">
                                <VscDebugStart />
                            </Button>
                        ) : canNotModify ? (
                            <Button onClick={pauseTimer} className="w-24">
                                <VscDebugPause />
                            </Button>
                        ) : (
                            <Button onClick={() => createAndStartTimer(currentTask)} className="w-24">
                                <VscDebugContinue />
                            </Button>
                        )}

                        <Button onClick={() => resetCreateBreakTimer(currentTask)} className="w-24">
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
                            <Card className="w-xs flex flex-col" key={`card-${id}`}>
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
                                    <p className="text-black/75 mb-2">
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
                                        <div className="w-full flex justify-end gap-2 mt-auto">
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
                                            setIdActionType(() => ({ id, action: ActionType.DELETE }));
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
                                            setIdActionType(() => ({ id, action: ActionType.EDIT }));
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
                                            setCurrentTask(() => id);
                                            handleStart(currentTask, workingMinutes, breakingMinutes);
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
                    <Card className="w-xs flex justify-center items-center">
                        <IoAddOutline
                            size={28}
                            className="cursor-pointer"
                            onClick={() => {
                                setCurrentTask(null);
                                setIdActionType(() => ({ id: null, action: ActionType.EDIT }));
                                setShowDialog(true);
                            }}
                        />
                    </Card>
                </div>
                {/* TODO 做一个给我买咖啡功能 */}
            </section>
            <TaskDialog
                showDialog={showDialog}
                setShowDialog={setShowDialog}
                idActionType={idActionType}
                currentTask={currentTask}
                intervalId={intervalId}
            />
        </section>
    );
};
export default HomePageComponent;

{
    /* ANCHOR 测试信息 */
}
{
    /* <div className="flex flex-col items-center gap-4">
                {isRunning ? <div>isRunning</div> : <div>notRunning</div>}
                {canNotModify ? <div>interval</div> : <div>no interval</div>}
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
}
