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
    /* -------------------------------------------------------------------------- */
    /*                                    基础函数                                    */
    /* -------------------------------------------------------------------------- */
    setSeconds: (arg0: number, agr1: number) => void;

    createAndStartTimer: () => void;

    clearTimer: () => void;
    /* -------------------------------------------------------------------------- */
    /*                                    复杂函数                                    */
    /* -------------------------------------------------------------------------- */
    pauseTimer: () => void;

    resetTimer: () => void;

    resetAndStartTimer: () => void;

    resetCreateWorkTimer: () => void;

    resetCreateBreakTimer: () => void;

    resetCreateToggledTimer: () => void;
};
