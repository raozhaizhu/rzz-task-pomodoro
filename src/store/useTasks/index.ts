import { create } from "zustand";
import { z } from "zod";
import { persist } from "zustand/middleware";
import { format } from "date-fns";
import { Actions, EditingStatus, States, TasksResponse } from "./types";

function getLocalDateString() {
    return format(new Date(), "yyyy-MM-dd");
}

export const cardInfoSchemaClient = z.object({
    id: z.number().int().min(0, { message: "The id number must be greater than 0" }),

    title: z
        .string()
        .trim()
        .min(1, { message: "Title is required" })
        .max(30, { message: "The length of title can't exceed 30 characters" }),
    description: z
        .string()
        .trim()
        .max(300, { message: "The length of description can't exceed 300 characters" })
        .optional(),

    remark: z.string().trim().max(200, { message: "The length of remark can't exceed 200 characters" }).optional(),
    tags: z.string().trim().max(35, { message: "The target of times be can't exceed 35 times" }).optional(),

    workingMinutes: z
        .number()
        // HACK 这是测试环境的设置,部署后需要改回来
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
                    title: "Title",
                    description: "Description \n\u2197 minutes-icon / remark-icon \n\u2198 delete / edit / start",
                    tags: "tag1 tag2 tag3",
                    remark: "Remark(optional)",
                    workingMinutes: 25,
                    breakingMinutes: 5,
                    completedTimes: 0,
                    targetTimes: 4,
                },
            ],
            lastResetDate: " ",
            countingTask: null,
            editingTask: null,
            editingStatus: EditingStatus.ADD,

            setCountingTask: (id: number | null) => {
                set(() => ({ countingTask: id }));
            },

            setEditingTask: (id: number | null) => {
                set(() => ({ editingTask: id }));
            },

            setEditingStatus: (status: EditingStatus) => {
                set(() => ({ editingStatus: status }));
            },

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
                const { id } = cardInfo;
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

            setCompletedTimePlus1: (id: number) => {
                set((state) => ({
                    tasks: state.tasks.map((task) =>
                        task.id === id ? { ...task, completedTimes: task.completedTimes + 1 } : task
                    ),
                }));
            },

            resetIfNewDay: () => {
                const today = getLocalDateString();
                const last = get().lastResetDate;

                // HACK It's a client console.log, it should be commented out before deployment.
                console.log("*** [resetIfNewDay] today:", today, "last:", last, "***");
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
