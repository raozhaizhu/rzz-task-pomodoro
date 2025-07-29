import { CardInfoSchemaClient } from ".";

export enum EditingStatus {
    ADD = "ADD",
    EDIT = "EDIT",
    DELETE = "DELETE",
}

export type States = {
    tasks: CardInfoSchemaClient[]; // Better to nest the array in an object for future expansion
    lastResetDate: string;
    countingTask: number | null;
    editingTask: number | null;
    editingStatus: EditingStatus;
};

export type Actions = {
    setCountingTask: (id: number | null) => void;
    setEditingTask: (id: number | null) => void;
    setEditingStatus: (status: EditingStatus) => void;
    setCompletedTimePlus1: (id: number) => void;

    checkIfTheTaskExist: (id: number) => boolean;
    checkIfTasksLengthLessThan30: () => boolean;

    getLatestId: () => number;
    getTask: (id: number) => TasksResponse;

    addTask: (cardInfo: CardInfoSchemaClient) => TasksResponse;
    editTask: (cardInfo: CardInfoSchemaClient) => TasksResponse;
    deleteTask: (id: number) => TasksResponse;

    resetIfNewDay: () => void;
    resetCompletedTimes: () => void;
};

export type TasksResponse = {
    success: boolean;
    message: string;
    data?: CardInfoSchemaClient;
};
