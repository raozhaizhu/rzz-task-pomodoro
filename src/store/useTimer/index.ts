import { create } from "zustand";
import { Actions, Mode, States } from "./types";
import { useTasks } from "@/store/useTasks";

function handleTimeOut(id: number | null, mode: Mode) {
    const startWorkSound = new Audio("/sounds/startWork.wav");
    const startBreakSound = new Audio("/sounds/startBreak.wav");

    const { taskCompletedTimePlus1, tasks } = useTasks.getState();

    if (id !== null) {
        taskCompletedTimePlus1(id);
    }

    if (mode === Mode.Work) {
        startBreakSound.play().catch((e) => {
            console.warn("Failed to play sound:", e);
        });
    } else {
        startWorkSound.play().catch((e) => {
            console.warn("Failed to play sound:", e);
        });
    }
}

export const useTimer = create<States & Actions>((set, get) => ({
    isRunning: false,
    mode: Mode.Work,
    // workSeconds: 45 * 60,
    // breakSeconds: 15 * 60,
    // remainSeconds: 45 * 60,
    // HACK 这里改了测试环境,到时候部署时候记得改回来
    workSeconds: 5,
    breakSeconds: 3,
    remainSeconds: 5,
    intervalId: null,

    setSeconds: (workSeconds: number, breakSeconds: number) => {
        set((state) => ({ workSeconds: workSeconds, breakSeconds: breakSeconds }));
    },

    createAndStartTimer: (id: number | null) => {
        const { clearTimer, mode } = get();
        // 如果已经有计时器,就返回,不要重复制造计时器
        if (get().intervalId !== null) return;

        const intervalId = setInterval(() => {
            if (get().remainSeconds < 1) {
                // 重新用get调取最新值
                clearTimer();
                handleTimeOut(id, mode);
                // TODO 设定全局状态,自动切换分3种,1完全不切换,2仅在1次循环内由工作切换到休息,3一次循环结束后自动切换进入下一次循环
                set((state) => ({ mode: mode === Mode.Work ? Mode.Break : Mode.Work }));

                return;
            }
            set((state) => ({ remainSeconds: state.remainSeconds - 1 }));
        }, 1000);

        set((state) => ({ intervalId: intervalId, isRunning: true }));
    },

    clearTimer: () => {
        const { intervalId } = get();
        // 如果没有计时器,直接返回
        if (!intervalId) return;
        clearInterval(intervalId);
        set((state) => ({ intervalId: null, isRunning: false }));
    },

    pauseTimer: () => {
        get().clearTimer();
        set((state) => ({ isRunning: true }));
    },

    resetTimer: () => {
        // 清除计时器
        get().clearTimer();
        // 然后重设时间为初始值
        set((state) => ({
            remainSeconds: state.mode === Mode.Work ? state.workSeconds : state.breakSeconds,
        }));
    },

    resetAndStartTimer: (id: number | null) => {
        const { resetTimer, createAndStartTimer } = get();
        resetTimer();
        createAndStartTimer(id);
    },

    resetCreateWorkTimer: (id: number | null) => {
        const { resetTimer, createAndStartTimer } = get();

        set((state) => ({ mode: Mode.Work }));

        resetTimer();
        createAndStartTimer(id);
    },
    resetCreateBreakTimer: (id: number | null) => {
        const { resetTimer, createAndStartTimer } = get();

        set((state) => ({ mode: Mode.Break }));

        resetTimer();
        createAndStartTimer(id);
    },
    resetCreateToggledTimer: (id: number | null) => {
        const { resetTimer, createAndStartTimer, mode } = get();

        set((state) => ({ mode: mode === Mode.Work ? Mode.Break : Mode.Work }));

        resetTimer();
        createAndStartTimer(id);
    },
}));
