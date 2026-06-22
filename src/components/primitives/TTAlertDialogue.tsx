import { AlertDialog } from "radix-ui";
import React from "react";
import TTButton from "#/components/primitives/TTButton.tsx";
import "@/styles/TTDialogue.css";

interface Props {
  title: string;
  description?: string;
  buttonText: string;
  onConfirm?: () => void;
  showCancel?: boolean;
  children: React.ReactNode;
}
export default function TTAlertDialogue({ title, description, buttonText, onConfirm, showCancel = true, children }: Props) {


  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>{children}</AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="ttdialogue-overlay fixed inset-0" />
        <AlertDialog.Content
          className="ttdialogue-content fixed column gap-8 p-4 bg-surface border border-dark rounded-lg shadow-lg"
          style={{ maxWidth: "500px" }}
        >
          <div className="column w-full gap-2">
            <AlertDialog.Title className="m-0 text-xl text-primary font-bold">{title}</AlertDialog.Title>

            {(description?.trim()?.length ?? 0) > 0 && <AlertDialog.Description>{description}</AlertDialog.Description>}
          </div>

          <div className="row justify-end items-end gap-2">
            {showCancel && (
              <AlertDialog.Cancel asChild>
                <TTButton buttonStyle="outline" className="px-2 min-h-9">Cancel</TTButton>
              </AlertDialog.Cancel>
            )}

            <AlertDialog.Action asChild>
              <TTButton className="px-2 min-h-9" onClick={onConfirm}>{buttonText}</TTButton>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}