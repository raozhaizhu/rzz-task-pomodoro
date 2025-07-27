# 🧠 Task-Pomodoro

> A minimal and structured productivity tool based on the Pomodoro Technique — enhanced with task tracking, persistence, and highly customizable timer behaviors.

## 🌟 Features

- 📝 **Task Management**
  - Add, edit, and delete tasks
  - Tagging and remarks
  - Track working sessions with `completedTimes` and `targetTimes`
  - Built-in schema validation with [`Zod`](https://zod.dev)
  

- ⏱️ **Pomodoro Timer**
  - Fully customizable work/break durations
  - 3 smart toggle behaviors:
    - `AUTO`: auto-switch on work→break, wait after break
    - `LOOP`: auto-loop between work/break
    - `MANUAL`: stop after each session
  - Visual countdown timer with audio cues
  - State persists even after page reload

- 🔁 **Daily Reset**
  - Completed session counts reset at the start of a new day
  - Powered by local date checking and persisted storage hydration

## 🧰 Tech Stack

| Tech / Library       | Purpose                                               |
|----------------------|--------------------------------------------------------|
| **TypeScript**       | Strongly typed language for safer and more reliable code |
| **Next.js**          | React-based framework with file-based routing and SSR |
| **Tailwind CSS**     | Utility-first CSS framework for rapid UI development and responsive web design  |
| **Shadcn UI**        | Composable UI components built on Radix and Tailwind  |
| **Zustand**          | Lightweight state management with persistence support  |
| **Zod**              | Type-safe schema validation for data structures        |
| **Framer Motion**    | Animation library for smooth and interactive motion   |
| **date-fns**         | Utility library for date formatting and manipulation  |
| **react-icons**      | Icon library for decorative and functional UI icons   |


## 🧠 Zustand Stores Overview

### `useTasks` – Task Store

Handles all task-related logic:

```typescript
{
  tasks: CardInfoSchemaClient[]; // persisted
  lastResetDate: string;
  countingTask: number | null;
  editingTask: number | null;

  // Actions
  addTask(card): TasksResponse;
  editTask(card): TasksResponse;
  deleteTask(id): TasksResponse;
  getTask(id): { success, data? };
  setCompletedTimePlus1(id);
  resetCompletedTimes();
  resetIfNewDay(); // auto-invoked on hydration
}
```

### `useTimer` – Timer Store

Handles all timer-related logic:

```typescript

{
  isRunning: boolean;
  mode: "WORK" | "BREAK";
  workSeconds: number;
  breakSeconds: number;
  remainSeconds: number;
  toggleBehavior: "AUTO" | "MANUAL" | "LOOP";

  // Actions

  createAndStartTimer(id);
  pauseTimer();
  resetTimer();
  resetAndStartTimer(id);
  resetCreateWorkTimer(id);
  resetCreateBreakTimer(id);
}
```

---

# 🧠 Task-Pomodoro

> 一款基于番茄工作法的简洁高效生产力工具 —— 支持任务追踪、数据持久化和高度可定制的计时器行为。

## 🌟 功能亮点

- 📝 **任务管理**
  - 支持添加、编辑和删除任务
  - 标签与备注功能
  - 可跟踪工作次数（`completedTimes`）与目标次数（`targetTimes`）
  - 使用 [`Zod`](https://zod.dev) 进行内建数据校验

- ⏱️ **番茄计时器**
  - 工作 / 休息时长可完全自定义
  - 支持三种智能切换模式：
    - `AUTO`：工作结束自动切换到休息，休息结束后暂停
    - `LOOP`：工作与休息自动循环切换
    - `MANUAL`：每次工作 / 休息结束后手动开始下一轮
  - 倒计时界面配有提示音
  - 页面刷新后状态依然保持

- 🔁 **每日自动重置**
  - 每日开始时自动重置任务的完成次数
  - 基于本地日期判断与持久化存储初始化逻辑完成

## 🧰 技术栈

| 技术 / 库              | 用途                                               |
|------------------------|----------------------------------------------------|
| **TypeScript**         | 强类型语言，提升代码安全性与可靠性                |
| **Next.js**            | 基于 React 的前端框架，支持文件路由和服务器渲染    |
| **Tailwind CSS**       | 原子化 CSS 框架，快速构建响应式 UI                 |
| **Shadcn UI**          | 基于 Radix 和 Tailwind 构建的可组合 UI 组件库      |
| **Zustand**            | 轻量状态管理工具，支持数据持久化                   |
| **Zod**                | 类型安全的数据模式验证工具                         |
| **Framer Motion**      | 动效库，实现流畅且具交互感的动画                   |
| **date-fns**           | 日期格式化与处理工具库                             |
| **react-icons**        | 图标库，用于展示功能性与装饰性图标                 |

## 🧠 Zustand 状态管理概览

### `useTasks` – 任务存储（Task Store）

处理所有任务相关的逻辑：

```ts
{
  tasks: CardInfoSchemaClient[]; // 持久化保存
  lastResetDate: string;
  countingTask: number | null;
  editingTask: number | null;

  // 操作方法
  addTask(card): TasksResponse;
  editTask(card): TasksResponse;
  deleteTask(id): TasksResponse;
  getTask(id): { success, data? };
  setCompletedTimePlus1(id);
  resetCompletedTimes();
  resetIfNewDay(); // 初始化时自动调用
}
```

### `useTasks` – 计时器存储（Timer Store）

处理所有与番茄计时相关的逻辑：

```ts
{
  isRunning: boolean;
  mode: "WORK" | "BREAK";
  workSeconds: number;
  breakSeconds: number;
  remainSeconds: number;
  toggleBehavior: "AUTO" | "MANUAL" | "LOOP";

  // 操作方法
  createAndStartTimer(id);
  pauseTimer();
  resetTimer();
  resetAndStartTimer(id);
  resetCreateWorkTimer(id);
  resetCreateBreakTimer(id);
}
```

---