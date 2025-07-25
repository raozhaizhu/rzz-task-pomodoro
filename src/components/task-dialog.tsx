import { ActionType } from "@/app/types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogClose, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cardInfoSchemaClient, CardInfoSchemaClient, useTasks } from "@/store/useTasks";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { DialogDescription } from "@radix-ui/react-dialog";
import RzzAlertDialog from "@/components/alert-dialog";

export const TaskDialog = ({
    showDialog,
    setShowDialog,
    actionType,
    currentTask,
}: {
    showDialog: boolean;
    setShowDialog: Dispatch<SetStateAction<boolean>>;
    actionType: ActionType;
    currentTask: number | null;
}) => {
    const { getLatestId, addTask, editTask, deleteTask, getTask } = useTasks();
    const [showAlertDialog, setShowAlertDialog] = useState(false);

    const latestId = getLatestId();

    const defaultValues: CardInfoSchemaClient = {
        id: latestId + 1,
        title: "",
        description: "",
        remark: "",
        workingMinutes: 45,
        breakingMinutes: 15,
        completedTimes: 0,
        targetTimes: 3,
        tags: [],
    };

    const form = useForm<CardInfoSchemaClient>({
        resolver: zodResolver(cardInfoSchemaClient),
        defaultValues: defaultValues,
    });

    const { reset } = form;

    let message;

    useEffect(() => {
        if (currentTask !== null) {
            const { data, message } = getTask(currentTask);
            reset(data ?? defaultValues);
        } else {
            reset(defaultValues);
            toast(message);
        }
    }, [currentTask, getTask, reset]);

    const isSubmitting = form.formState.isSubmitting;

    const onSubmit = (data: CardInfoSchemaClient) => {
        switch (actionType) {
            case ActionType.ADD: {
                const { message } = addTask(data);
                toast(message);
                break;
            }
            case ActionType.EDIT: {
                const { message } = editTask(data);
                toast(message);
                break;
            }
            case ActionType.DELETE: {
                setShowAlertDialog(true);
                break;
            }
            default:
                console.log("Invalid action type");
                break;
        }

        setShowDialog(false);
    };

    function handleConfirm() {
        const { id } = form.getValues();
        const { message } = deleteTask(id);
        toast(message);
    }

    return (
        <>
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{actionType} Task</DialogTitle>
                        <DialogDescription className="text-black/70 mt-2">
                            You are now {actionType.toLowerCase()}ing your task.
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                            <FormField
                                control={form.control}
                                name="id"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>ID</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter id"
                                                {...field}
                                                className="col-span-3"
                                                disabled
                                                type="number"
                                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter Title"
                                                {...field}
                                                className="col-span-3"
                                                disabled={isSubmitting || actionType === ActionType.DELETE}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter Description"
                                                {...field}
                                                className="col-span-3"
                                                disabled={isSubmitting || actionType === ActionType.DELETE}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="remark"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Remark</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter Remark"
                                                {...field}
                                                className="col-span-3"
                                                disabled={isSubmitting || actionType === ActionType.DELETE}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="workingMinutes"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Working Minutes</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter Working Minutes"
                                                {...field}
                                                className="col-span-3"
                                                disabled={isSubmitting || actionType === ActionType.DELETE}
                                                type="number"
                                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="breakingMinutes"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Breaking Minutes</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter Breaking Minutes"
                                                {...field}
                                                className="col-span-3"
                                                disabled={isSubmitting || actionType === ActionType.DELETE}
                                                type="number"
                                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="completedTimes"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Completed Times</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter Completed Times"
                                                {...field}
                                                className="col-span-3"
                                                disabled={isSubmitting || actionType === ActionType.DELETE}
                                                type="number"
                                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="targetTimes"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Target Times</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter Target Times"
                                                {...field}
                                                className="col-span-3"
                                                disabled={isSubmitting || actionType === ActionType.DELETE}
                                                type="number"
                                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline" className="w-24">
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button
                                    type="submit"
                                    className="w-24"
                                    variant={actionType === ActionType.DELETE ? "destructive" : "default"}
                                >
                                    {actionType}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
            <RzzAlertDialog
                showAlertDialog={showAlertDialog}
                setShowAlertDialog={setShowAlertDialog}
                handleConfirm={handleConfirm}
            />
        </>
    );
};
