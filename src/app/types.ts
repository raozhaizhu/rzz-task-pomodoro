export enum ActionType {
    ADD = "Add",
    EDIT = "Edit",
    DELETE = "Delete",
}

export type IdActionType = { id: number | null; action: ActionType };
