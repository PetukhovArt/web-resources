import { observer } from "mobx-react-lite";
import { ChildWindow } from "./child-window";

export enum WindowsIds {
  MAIN = "main",
  TREE_CHILD_WINDOW = "tree-child-window",
  FORM = "form",
}

export const TreeChildWindow = observer(
  ({ windowId }: { windowId: string }) => {
    return (
      <ChildWindow id={windowId}>
        <div
          className={
            "size-full h-full w-full overflow-y-hidden border-2 border-slate-600 dark:bg-slate-950 dark:text-white"
          }
        >
          <div
            className={"w-full space-y-2 rounded-s p-3"}
            style={{ height: "calc(100vh )" }}
          >
            {/*<ScrollArea className="relative h-full">*/}
            {/*    {treeModel.nodes.map((node) => node.NodeItem())}*/}
            {/*</ScrollArea>*/}
          </div>
        </div>
      </ChildWindow>
    );
  },
);
