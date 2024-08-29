import { lazy, ReactNode, Suspense } from 'react'
import { createPortal } from 'react-dom'
import { childWindowsManager, WindowId } from './windows-manager'
import { observer } from 'mobx-react-lite'

const StyleProvider = lazy(() =>
  import('./style-provider').then((m) => ({ default: m.StyleProvider }))
)

export const ChildWindow = observer(({ children, id }: { id: WindowId; children: ReactNode }) => {
  const window = childWindowsManager.getWindow(id)

  if (!window) {
    return null
  }

  return createPortal(
    <Suspense>
      <StyleProvider>{children}</StyleProvider>
    </Suspense>,
    window?.document.body ?? null
  )
})
