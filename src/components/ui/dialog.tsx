import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const Dialog = DialogPrimitive.Root;
export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;

// The content box is centred with `inset-0 m-auto` (no transform), so a `position: fixed`
// child such as the toaster still sits against the viewport.
export function DialogContent({
  className,
  children,
  ...props
}: ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        data-dialog-anim
        className="fixed inset-0 z-50 bg-green/50 data-[state=closed]:animate-[overlay-out_150ms_ease-in_forwards] data-[state=open]:animate-[overlay-in_200ms_ease-out]"
      />
      <DialogPrimitive.Content
        data-dialog-anim
        className={cn(
          "fixed inset-0 z-50 m-auto h-fit max-h-[92svh] w-[calc(100%-2rem)] max-w-5xl overflow-y-auto overscroll-contain rounded-2xl bg-cream shadow-2xl focus:outline-none data-[state=closed]:animate-[dialog-out_150ms_ease-in_forwards] data-[state=open]:animate-[dialog-in_200ms_ease-out]",
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          aria-label="Close"
          className="absolute top-3 right-3 z-10 flex size-11 items-center justify-center rounded-full bg-cream/90 text-green transition-colors hover:bg-rice focus-visible:outline-2 focus-visible:outline-green"
        >
          <X aria-hidden="true" className="size-5" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
