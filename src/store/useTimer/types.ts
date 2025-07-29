export enum Mode {
    WORK = "WORK",
    BREAK = "BREAK",
}

export enum ToggleBehavior {
    MANUAL = "MANUAL",
    AUTO = "AUTO",
    LOOP = "LOOP",
}

export type States = {
    isRunning: boolean;
    mode: Mode;
    toggleBehavior: ToggleBehavior;

    workSeconds: number;
    breakSeconds: number;
    remainSeconds: number;

    intervalId: NodeJS.Timeout | null;
};

export type Actions = {
    /* -------------------------------------------------------------------------- */
    /*                                    基础函数                                    */
    /* -------------------------------------------------------------------------- */
    setToggleBehavior: (behavior: ToggleBehavior) => void;

    switchMode: () => void;

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
