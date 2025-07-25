import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dispatch, SetStateAction } from "react";
import { Button } from "./ui/button";

const RzzAlertDialog = ({
    showAlertDialog,
    setShowAlertDialog,
    handleConfirm,
}: {
    showAlertDialog: boolean;
    setShowAlertDialog: Dispatch<SetStateAction<boolean>>;
    handleConfirm: () => void;
}) => {
    return (
        <AlertDialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this task, and the task could not be
                        recoverable.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button asChild onClick={handleConfirm} variant="destructive">
                        <AlertDialogAction>Continue</AlertDialogAction>
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
export default RzzAlertDialog;
