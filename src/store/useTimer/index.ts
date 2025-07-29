import { create } from "zustand";
import { Actions, Mode, States, ToggleBehavior } from "./types";
import { useTasks } from "@/store/useTasks";
// 处理,时间到了以后,提高次数,切换状态,重设时间,播放音效
function handleTimeOut(id: number | null, mode: Mode) {
    const startWorkSound = new Audio("/sounds/startWork.wav");
    const startBreakSound = new Audio("/sounds/startBreak.wav");

    const { setCompletedTimePlus1 } = useTasks.getState();
    const { switchMode, resetCreateBreakTimer, toggleBehavior, clearTimer, resetTimer, resetAndStartTimer } =
        useTimer.getState();

    if (id !== null) {
        setCompletedTimePlus1(id);
    }

    if (mode === Mode.WORK) {
        startBreakSound.play().catch((e) => {
            console.warn("Failed to play sound:", e);
        });
    } else {
        startWorkSound.play().catch((e) => {
            console.warn("Failed to play sound:", e);
        });
    }
    // 如果是MANUAL,就清除计时器,但是不切换MODE(工作状态)
    if (toggleBehavior === ToggleBehavior.MANUAL) {
        clearTimer();
    }
    // 如果是AUTO,当Mode为Work的时候,切换一次,清除计时器并开始休息
    // 当Mode为Break的时候,不切换,仅清除计时器
    else if (toggleBehavior === ToggleBehavior.AUTO) {
        if (mode === Mode.WORK) {
            resetCreateBreakTimer(id);
        } else {
            clearTimer();
        }
    }
    // 如果是LOOP,每次都切换
    else {
        switchMode();
        resetAndStartTimer(id);
    }
}
export const useTimer = create<States & Actions>((set, get) => ({
    isRunning: false,
    mode: Mode.WORK,
    // workSeconds: 45 * 60,
    // breakSeconds: 15 * 60,
    // remainSeconds: 45 * 60,
    // HACK 这里改了测试环境,到时候部署时候记得改回来
    workSeconds: 5,
    breakSeconds: 3,
    remainSeconds: 5,
    intervalId: null,
    toggleBehavior: ToggleBehavior.AUTO,

    setToggleBehavior: (behavior: ToggleBehavior) => {
        set((state) => ({ toggleBehavior: behavior }));
    },

    switchMode: () => {
        const { mode } = get();

        set(() => ({ mode: mode === Mode.WORK ? Mode.BREAK : Mode.WORK }));
    },

    setSeconds: (workSeconds: number, breakSeconds: number) => {
        set((state) => ({ workSeconds: workSeconds, breakSeconds: breakSeconds }));
    },

    createAndStartTimer: (id: number | null) => {
        const { mode } = get();
        // 如果已经有计时器,就返回,不要重复制造计时器
        if (get().intervalId !== null) return;

        const intervalId = setInterval(() => {
            if (get().remainSeconds < 1) {
                // 重新用get调取最新值
                handleTimeOut(id, mode);
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
            remainSeconds: state.mode === Mode.WORK ? state.workSeconds : state.breakSeconds,
        }));
    },

    resetAndStartTimer: (id: number | null) => {
        const { resetTimer, createAndStartTimer } = get();
        resetTimer();
        createAndStartTimer(id);
    },

    resetCreateWorkTimer: (id: number | null) => {
        const { resetTimer, createAndStartTimer } = get();

        set((state) => ({ mode: Mode.WORK }));

        resetTimer();
        createAndStartTimer(id);
    },
    resetCreateBreakTimer: (id: number | null) => {
        const { resetTimer, createAndStartTimer } = get();

        set((state) => ({ mode: Mode.BREAK }));

        resetTimer();
        createAndStartTimer(id);
    },
    resetCreateToggledTimer: (id: number | null) => {
        const { resetTimer, createAndStartTimer, mode } = get();

        set((state) => ({ mode: mode === Mode.WORK ? Mode.BREAK : Mode.WORK }));

        resetTimer();
        createAndStartTimer(id);
    },
}));
