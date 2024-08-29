import { Button } from '@/shared/ui/shadcn/ui/button'
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/shared/ui/shadcn/ui/dialog'
import { Dialog } from '@radix-ui/react-dialog'
import { confirmationModel } from '../model/store'
import { observer } from 'mobx-react-lite'

export const ConfirmationModal = observer(() => {
  return (
    <Dialog open={confirmationModel.isOpen} onOpenChange={() => confirmationModel.cancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{confirmationModel.params?.title}</DialogTitle>
          <DialogDescription>{confirmationModel.params?.description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          {/*<DialogClose asChild>*/}
          <Button type="button" variant="secondary" onClick={() => confirmationModel.cancel()}>
            {confirmationModel.params?.cancelText}
          </Button>
          {/*</DialogClose>*/}
          {/*<DialogClose asChild>*/}
          <Button type="button" variant="destructive" onClick={() => confirmationModel.accept()}>
            {confirmationModel.params?.acceptText}
          </Button>
          {/*</DialogClose>*/}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
})
