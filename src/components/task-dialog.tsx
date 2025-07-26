import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogClose, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cardInfoSchemaClient, CardInfoSchemaClient, useTasks } from "@/store/useTasks";
import { EditingStatus } from "@/store/useTasks/types";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { DialogDescription } from "@radix-ui/react-dialog";

import RzzAlertDialog from "@/components/alert-dialog";

export const TaskDialog = ({
    showDialog,
    setShowDialog,
    intervalId,
}: {
    showDialog: boolean;
    setShowDialog: Dispatch<SetStateAction<boolean>>;
    intervalId: NodeJS.Timeout | null;
}) => {
    const { editingTask, editingStatus, getLatestId, addTask, editTask, deleteTask, getTask } = useTasks();
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
        tags: "",
    };

    const form = useForm<CardInfoSchemaClient>({
        resolver: zodResolver(cardInfoSchemaClient),
        defaultValues: defaultValues,
    });

    const { reset } = form;

    useEffect(() => {
        if (editingTask !== null) {
            const { data } = getTask(editingTask);
            reset(data ?? defaultValues);
        } else {
            reset(defaultValues);
        }
    }, [editingTask]);

    const isSubmitting = form.formState.isSubmitting;
    const canNotModify = intervalId !== null || isSubmitting || editingStatus === EditingStatus.DELETE;

    const onSubmit = (data: CardInfoSchemaClient) => {
        switch (editingStatus) {
            case EditingStatus.ADD: {
                const { message } = addTask(data);
                toast(message);
                break;
            }
            case EditingStatus.EDIT: {
                const { message } = editTask(data);
                toast(message);
                break;
            }
            case EditingStatus.DELETE: {
                setShowAlertDialog(true); // 外包给alertDialog处理
                break;
            }
            default:
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
                <DialogContent className="max-h-[calc(100vh-100px)] overflow-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingStatus.charAt(0).toUpperCase() + editingStatus.slice(1).toLowerCase()} Task
                        </DialogTitle>
                        <DialogDescription className="text-black/70 mt-2">
                            You are now {editingStatus.toLowerCase()}ing your task.
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
                                        <FormLabel>
                                            Title <span className="text-red-700">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Title"
                                                {...field}
                                                className="col-span-3"
                                                disabled={canNotModify}
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
                                                placeholder="Description"
                                                {...field}
                                                className="col-span-3"
                                                disabled={canNotModify}
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
                                                placeholder="Remark"
                                                {...field}
                                                className="col-span-3"
                                                disabled={canNotModify}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="tags"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Tags</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="study,guitar 45/15 <-- divide tags by comma or space"
                                                {...field}
                                                className="col-span-3"
                                                disabled={canNotModify}
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
                                        <FormLabel>
                                            Working Minutes <span className="text-red-700">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                className="col-span-3"
                                                disabled={canNotModify}
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
                                        <FormLabel>
                                            Breaking Minutes <span className="text-red-700">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                className="col-span-3"
                                                disabled={canNotModify}
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
                                        <FormLabel>
                                            Completed Times <span className="text-red-700">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                className="col-span-3"
                                                disabled={canNotModify}
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
                                        <FormLabel>
                                            Target Times <span className="text-red-700">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                className="col-span-3"
                                                disabled={canNotModify}
                                                type="number"
                                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter className="flex flex-row justify-end">
                                <DialogClose asChild>
                                    <Button variant="outline" className="w-24 ">
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button
                                    type="submit"
                                    className="w-24 "
                                    variant={editingStatus === EditingStatus.DELETE ? "destructive" : "default"}
                                >
                                    {editingStatus}
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

export default TaskDialog;
