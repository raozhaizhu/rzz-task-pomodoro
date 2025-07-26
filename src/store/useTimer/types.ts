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

    createAndStartTimer: (id: number | null) => void;

    clearTimer: () => void;
    /* -------------------------------------------------------------------------- */
    /*                                    复杂函数                                    */
    /* -------------------------------------------------------------------------- */
    pauseTimer: () => void;

    resetTimer: () => void;

    resetAndStartTimer: (id: number | null) => void;

    resetCreateWorkTimer: (id: number | null) => void;

    resetCreateBreakTimer: (id: number | null) => void;

    resetCreateToggledTimer: (id: number | null) => void;
};
