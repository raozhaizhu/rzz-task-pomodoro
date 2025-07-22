export enum Mode {
    Work = "WORK",
    Break = "BREAK",
}

export type States = {
    isRunning: boolean;
    /**
     * Mode {
    Work = "WORK",
    Break = "BREAK",
    }   
     */
    mode: Mode;
    workSeconds: number;
    breakSeconds: number;
    remainSeconds: number;

    intervalId: NodeJS.Timeout | null;
};

export type Actions = {
    /**
     * 1.基础函数: 创造计时器,开始计时;
     */
    createTimer: () => void;
    /**
     * 1.基础函数: 清除计时器,不停止计时;
     */
    clearTimer: () => void;
    /**
     * 1.复杂函数: 清除计时器,停止计时;
     * 2.引入函数: clearTimer;
     */
    resetTimer: () => void;
    /**
     * 1.复杂函数: 清除计时器,并根据现有模式开始计时;
     * 2.引入函数: clearTimer;
     */
    resetAndStartTimer: () => void;
    /**
     * 1.复杂函数: 清除计时器,创造工作计时器,开始计时;
     * 2.引入函数:resetTimer, createTimer;
     */
    resetCreateWorkTimer: () => void;
    /**
     * 1.复杂函数: 清除计时器,创造休息计时器,开始计时;
     * 2.引入函数:resetTimer, createTimer;
     */
    resetCreateBreakTimer: () => void;
    /**
     * 1.复杂函数: 清除计时器,根据当前工作/休息状态,切换到相反计时器,开始计时;
     * 2.引入函数:resetTimer, createTimer;
     */
    resetCreateToggledTimer: () => void;
};
