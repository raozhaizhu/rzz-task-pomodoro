import { create } from "zustand";
import { Actions, Mode, States } from "./types";

export const useTimer = create<States & Actions>((set, get) => ({
    isRunning: false,
    mode: Mode.Work,
    workSeconds: 45 * 60,
    breakSeconds: 15 * 60,
    remainSeconds: 45 * 60,
    intervalId: null,

    createTimer: () => {
        const { isRunning, remainSeconds, clearTimer } = get();
        // 如果已经在运行,或者已经有计时器,就返回,不要重复制造计时器
        if (isRunning || get().intervalId !== null) return;
        // 如果计时器存在,并且剩余时间小于1秒,就清除计时器,并返回
        // TODO 是否要把剩余时间设置为0,
        if (get().intervalId !== null && remainSeconds < 1) {
            clearTimer();
            return;
        }

        const intervalId = setInterval(() => {
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

    resetTimer: () => {
        // 清除计时器
        get().clearTimer();
        // 然后重设时间为初始值
        set((state) => ({
            remainSeconds: state.mode === Mode.Work ? state.workSeconds : state.breakSeconds,
        }));
    },

    resetCreateWorkTimer: () => {
        const { resetTimer, createTimer } = get();

        set((state) => ({ mode: Mode.Work }));

        resetTimer();
        createTimer();
    },
    resetCreateBreakTimer: () => {
        const { resetTimer, createTimer } = get();

        set((state) => ({ mode: Mode.Break }));

        resetTimer();
        createTimer();
    },
    resetCreateToggledTimer: () => {
        const { resetTimer, createTimer, mode } = get();

        set((state) => ({ mode: mode === Mode.Work ? Mode.Break : Mode.Work }));

        resetTimer();
        createTimer();
    },
}));
