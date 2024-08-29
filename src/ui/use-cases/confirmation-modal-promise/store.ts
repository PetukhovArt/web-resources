import { makeAutoObservable } from 'mobx'
export type ConfirmationParams = {
  title: React.ReactNode
  description?: React.ReactNode
  acceptText?: React.ReactNode
  cancelText?: React.ReactNode
}

export class ConfirmationStore {
  params?: ConfirmationParams
  private onAccept?: () => void
  private onCancel?: () => void

  constructor() {
    makeAutoObservable(this)
  }

  openConfirmation = (params: ConfirmationParams, throwOnCancel = true): Promise<void> => {
    return new Promise((resolve, reject) => {
      this.params = params
      this.onAccept = resolve
      this.onCancel = throwOnCancel ? reject : () => {}
    })
  }

  accept() {
    this.close()
    this.onAccept?.()
  }
  cancel() {
    this.close()
    this.onCancel?.()
  }

  get isOpen() {
    return !!this.params
  }
  private close() {
    this.params = undefined
  }
}

export const confirmationModel = new ConfirmationStore()
