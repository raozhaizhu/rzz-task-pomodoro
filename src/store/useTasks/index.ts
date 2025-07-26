import { create } from "zustand";
import { z } from "zod";
import { persist } from "zustand/middleware";
import { format } from "date-fns";

function getLocalDateString() {
    return format(new Date(), "yyyy-MM-dd");
}

export type States = {
    tasks: CardInfoSchemaClient[]; // Better to nest the array in an object for future expansion
    lastResetDate: string;
};

export type Actions = {
    checkIfTheTaskExist: (id: number) => boolean;
    checkIfTasksLengthLessThan30: () => boolean;
    getLatestId: () => number;
    getTask: (id: number) => TasksResponse;
    addTask: (cardInfo: CardInfoSchemaClient) => TasksResponse;
    editTask: (cardInfo: CardInfoSchemaClient) => TasksResponse;
    deleteTask: (id: number) => TasksResponse;
    taskCompletedTimePlus1: (id: number) => void;
    resetIfNewDay: () => void;
    resetCompletedTimes: () => void;
};

export type TasksResponse = {
    success: boolean;
    message: string;
    data?: CardInfoSchemaClient;
};

export const cardInfoSchemaClient = z.object({
    id: z.number().int().min(0, { message: "The id number must be greater than 0" }),

    title: z.string().trim().min(1, { message: "Title is required" }),
    description: z
        .string()
        .trim()
        .max(300, { message: "The length of description can't exceed 300 characters" })
        .optional(),
    remark: z.string().trim().max(300, { message: "The length of remark can't exceed 300 characters" }).optional(),

    workingMinutes: z
        .number()
        // .int()
        // .min(1, { message: "It can't be smaller than 1" })
        .max(1439, { message: "It can't be bigger than 1439" }),
    breakingMinutes: z
        .number()
        // .int()
        // .min(1, { message: "It can't be smaller than 1" })
        .max(1439, { message: "It can't be bigger than 1439" }),
    completedTimes: z.number().int(),
    targetTimes: z
        .number()
        .int()
        .min(1, { message: "The target of times must be greater than 0" })
        .max(24, { message: "The target of times be can't exceed 24 times" }),

    tags: z.string().trim().optional(),
});
// .refine((data) => data.completedTimes <= data.targetTimes, {
//     path: ["completedTimes"],
//     message: "Completed times cannot exceed target times",
// });

export type CardInfoSchemaClient = z.infer<typeof cardInfoSchemaClient>;

export const useTasks = create<States & Actions>()(
    persist(
        (set, get) => ({
            tasks: [
                // HACK 重写placeholder让整个设定更易懂
                {
                    id: 0,
                    title: "Study French",
                    description: "I should study French...",
                    tags: "study,course,French",
                    remark: "I did a great job yesterday!",
                    workingMinutes: 45,
                    breakingMinutes: 15,
                    completedTimes: 0,
                    targetTimes: 4,
                },
                {
                    id: 1,
                    title: "Practice Guitar",
                    description: "I should practice guitar chords for 25 minutes today",
                    tags: "music,practice,guitar",
                    remark: "Need to work on the F chord transition",
                    workingMinutes: 25,
                    breakingMinutes: 5,
                    completedTimes: 0,
                    targetTimes: 4,
                },
            ],
            lastResetDate: " ",

            checkIfTheTaskExist: (id: number) => {
                const existedTask = get().tasks.some((task) => task.id === id);

                return existedTask;
            },

            checkIfTasksLengthLessThan30: () => {
                const { tasks } = get();

                const checkIfTasksLengthLessThan30 = tasks.length < 31 ? true : false;

                return checkIfTasksLengthLessThan30;
            },
            getLatestId: () => {
                const tasks = get().tasks;
                if (tasks.length === 0) return 0;
                const id = tasks.reduce((acc, task) => (task.id > acc ? task.id : acc), 0);
                return id;
            },
            getTask: (id: number) => {
                const task = get().tasks.find((task) => task.id === id);
                if (!task) return { success: false, message: "The task is not existed" };
                return { success: true, message: "The task has been found successfully", data: task };
            },
            addTask: (cardInfo: CardInfoSchemaClient): TasksResponse => {
                const { id } = cardInfo;
                if (get().checkIfTheTaskExist(id))
                    return { success: false, message: "The title of task can't be repeated" };
                if (!get().checkIfTasksLengthLessThan30())
                    return { success: false, message: "The length of the list of tasks can't exceed 30" };

                set((state) => ({ tasks: [...state.tasks, cardInfo] }));

                return { success: true, message: "The task has been added to the list successfully" };
            },

            editTask: (cardInfo: CardInfoSchemaClient): TasksResponse => {
                const { id, completedTimes, targetTimes } = cardInfo;
                if (!get().checkIfTheTaskExist(id)) return { success: false, message: "The task has not been created" };

                set((state) => ({
                    tasks: state.tasks.map((task) => (task.id === id ? cardInfo : task)),
                }));

                return { success: true, message: "The task has been edited successfully" };
            },

            deleteTask: (id: number): TasksResponse => {
                if (!get().checkIfTheTaskExist(id)) return { success: false, message: "The task has not been created" };

                set((state) => ({
                    tasks: state.tasks.filter((task) => task.id !== id),
                }));

                return { success: true, message: "The task has been deleted successfully" };
            },

            taskCompletedTimePlus1: (id: number) => {
                set((state) => ({
                    tasks: state.tasks.map((task) =>
                        task.id === id ? { ...task, completedTimes: task.completedTimes + 1 } : task
                    ),
                }));
            },

            resetIfNewDay: () => {
                const today = getLocalDateString();
                if (get().lastResetDate !== today) {
                    get().resetCompletedTimes();
                }
            },

            resetCompletedTimes: () => {
                set((state) => ({
                    tasks: state.tasks.map((task) => ({ ...task, completedTimes: 0 })),
                    lastResetDate: getLocalDateString(),
                }));
            },

            // TODO 完成状态持久化
        }),
        {
            name: "task-storage",
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.resetIfNewDay();
                }
            },
        }
    )
);
// 我认为事务操作依旧是有必要的,进行简单的模拟事务操作,对修改这样危险的行为进行校验,尽管我们可以通过前端Block用户对ID的修改,或者干脆不给他入口
// 但必要性不大,所以不做了
// checkIfIdRepeated: () => {
//     const { tasks } = get();

//     const idSet = new Set();

//     tasks.map((task) => {
//         if (idSet.has(task.id)) return true;
//         idSet.add(task.id);
//     });
// },
