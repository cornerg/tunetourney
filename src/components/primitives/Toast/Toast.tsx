import type { ToastItem } from "@/models/ToastItem.ts";
import React from "react";
import { useToast } from "@/state/toastStore.ts";
import { MdClose } from "react-icons/md";
import { cn } from "@/utils/utils.ts";

type Props = {
  toast: ToastItem;
  style?: React.CSSProperties;
  isNew?: boolean;
}
export default function ChToast({ toast, style, isNew }: Props) {
  const { hideToast } = useToast();

  const { title, message, type, id } = React.useMemo(() => toast, [toast]);

  const typeClasses = React.useMemo(() => {
    switch (type) {
      case "success":
        return {
          toast: "bg-emerald-200 border-emerald-700 text-emerald-800",
          bar: "bg-emerald-700",
        };
      case "warning":
        return {
          toast: "bg-amber-200 border-amber-700 text-amber-800",
          bar: "bg-amber-700",
        };
      case "error":
        return {
          toast: "bg-rose-200 border-rose-700 text-rose-800",
          bar: "bg-rose-700",
        };
      default:
        return {
          toast: "bg-[#b9e8e3] border-primary text-primary",
          bar: "bg-primary",
        };
    }
  }, [type]);

  const toastStyles = React.useMemo(() => {
    let bottom = style?.bottom;
    if (isNew) {
      bottom = "-128px";
    }
    const otherStyles = { ...style };
    delete otherStyles.bottom;
    return { ...otherStyles, bottom };
  }, [style, isNew]);

  return (
    <div
      className={cn(
        "absolute column w-full max-w-82 min-h-18 p-2 gap-px rounded-xl border overflow-hidden",
        typeClasses.toast,
      )}
      style={{ transition: "bottom 200ms ease", ...toastStyles }}>
      {title && (
        <p className="text-inherit text-sm font-semibold w-full pr-6">
          {title}
        </p>
      )}
      {message && <p className="text-inherit text-xs">{message}</p>}

      <div
        className="absolute row top-0 right-0 w-5 h-5 pt-1 pr-1 z-3 text-inherit cursor-pointer"
        onClick={() => hideToast(id)}>
        <MdClose size={16} className="w-4 h-4 text-inherit" />
      </div>

      <div
        className={cn("absolute h-0.5 bottom-0 left-0", typeClasses.bar)}
        style={{
          transition: `width ${Math.max(toast.duration - 20, 0)}ms linear`,
          width: isNew ? "0%" : "100%",
        }}
      />
    </div>
  );
}
