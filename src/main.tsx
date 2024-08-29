import { createRoot } from "react-dom/client";
import { ConfirmationModal } from "./ui/use-cases/confirmation-modal-promise/modal";

createRoot(document.getElementById("root") as HTMLElement).render(
  <div>
    <div className={"h-screen w-full bg-background text-foreground"}>
      {/*{childWindowsManager.windowIds.includes(WindowsIds.TREE_CHILD_WINDOW) && (*/}
      {/*  <TreeChildWindow windowId={WindowsIds.TREE_CHILD_WINDOW} />*/}
      {/*)}*/}
      <ConfirmationModal />
    </div>
  </div>,
);
