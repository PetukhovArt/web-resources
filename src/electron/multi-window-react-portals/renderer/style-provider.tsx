import gs from '@/app/global.css?inline'
import { useTheme } from '../../../app/themeProvider/theme-provider'

export function StyleProvider({ children }: { children?: React.ReactNode }) {
  const { theme } = useTheme()
  return (
    <>
      <style>{gs}</style>
      <div className={theme === 'dark' ? 'dark' : ''}>{children}</div>
    </>
  )
}
