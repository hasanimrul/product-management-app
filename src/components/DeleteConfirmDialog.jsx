"use client";

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

export default function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  productName,
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-rust/30">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-dark">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-dark/70">
            This action cannot be undone. This will permanently delete the
            product{" "}
            <span className="font-semibold text-dark">"{productName}"</span>{" "}
            from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-sage/30 text-sage hover:bg-sage hover:text-light">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-rust hover:bg-rust/90 text-light"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
