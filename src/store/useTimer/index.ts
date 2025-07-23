import { create } from "zustand";
import { Actions, Mode, States } from "./types";

export const useTimer = create<States & Actions>((set, get) => ({
    isRunning: false,
    mode: Mode.Work,
    // workSeconds: 45 * 60,
    // breakSeconds: 15 * 60,
    // remainSeconds: 45 * 60,
    workSeconds: 5,
    breakSeconds: 3,
    remainSeconds: 5,
    intervalId: null,

    setSeconds: (workSeconds: number, breakSeconds: number) => {
        set((state) => ({ workSeconds: workSeconds, breakSeconds: breakSeconds }));
    },

    createAndStartTimer: () => {
        const { clearTimer } = get();
        // 如果已经有计时器,就返回,不要重复制造计时器
        if (get().intervalId !== null) return;

        const intervalId = setInterval(() => {
            if (get().remainSeconds < 1) {
                // 重新用get调取最新值
                clearTimer();
                alert("Time out!"); // TODO 换成function，播放音乐
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

    resetAndStartTimer: () => {
        const { resetTimer, createAndStartTimer } = get();
        resetTimer();
        createAndStartTimer();
    },

    resetCreateWorkTimer: () => {
        const { resetTimer, createAndStartTimer } = get();

        set((state) => ({ mode: Mode.Work }));

        resetTimer();
        createAndStartTimer();
    },
    resetCreateBreakTimer: () => {
        const { resetTimer, createAndStartTimer } = get();

        set((state) => ({ mode: Mode.Break }));

        resetTimer();
        createAndStartTimer();
    },
    resetCreateToggledTimer: () => {
        const { resetTimer, createAndStartTimer, mode } = get();

        set((state) => ({ mode: mode === Mode.Work ? Mode.Break : Mode.Work }));

        resetTimer();
        createAndStartTimer();
    },
}));
