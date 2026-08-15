import { useToast } from "@/state/toastStore.ts";
import React from "react";
import Toast from "@/components/primitives/Toast/Toast.tsx";

const baseZIndex = 3;
const stackOffset = 22;

export default function Toaster() {
  const [animatedItemIds, setAnimatedItemIds] = React.useState<string[]>([]);

  const { toastItems } = useToast();

  const handlingIds = React.useRef<string[]>([]);

  const sortedToasts = React.useMemo(() => {
    return [...toastItems].sort((a, b) => b.created - a.created);
  }, [toastItems]);

  const handleNewToast = React.useCallback(
    (id: string) => {
      if (!handlingIds.current.includes(id)) {
        handlingIds.current = [...handlingIds.current, id];
        setTimeout(() => {
          setAnimatedItemIds([...animatedItemIds, id]);
          handlingIds.current = handlingIds.current.filter(
            otherId => otherId !== id,
          );
        }, 12);
      }
    },
    [animatedItemIds],
  );

  return (
    <div className="fixed bottom-4 right-4 w-full max-w-82 z-7">
      {sortedToasts.map((toast, index, list) => {
        const zIndex = baseZIndex + index;
        const bottom = `${stackOffset * (list.length - 1 - index)}px`;
        let isNew = false;
        if (!animatedItemIds.includes(toast.id)) {
          isNew = true;
          handleNewToast(toast.id);
        }

        return (
          <Toast
            key={toast.id}
            toast={toast}
            style={{ zIndex, bottom }}
            isNew={isNew}
          />
        );
      })}
    </div>
  );
}
