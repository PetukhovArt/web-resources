import { observable } from 'mobx'
import { observer } from 'mobx-react-lite'
import TreeModel from '../../../features/tree/model/tree-model'
import { useState } from 'react'
import { nanoid } from '@reduxjs/toolkit'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../ui/shadcn/ui/select'
import { childWindowsManager } from './windows-manager'
import * as Icons from '@/shared/assets/icons'
import { ChildWindow } from './child-window'
import { Button } from '../../ui/shadcn/ui/button'
import { ServerTreeElement, TreeElement } from '@/features/tree/model/types'
import { CustomTitleBarTree } from '@/features/tree/ui/tree-bar/custom-title-bar-tree'
import { TreeItem } from '@/features/tree/ui/tree-editor/tree-item'
import { Tree } from '@/features/tree/ui/tree-view'
import { ScrollArea } from '@/shared/ui/shadcn/ui/scroll-area'
import { useTheme } from '../../../app/themeProvider/theme-provider'

const counter = observable({
  count: 0
})

export const TestWindow = observer(() => {
  const { theme } = useTheme()
  // const themeClasses = theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-black'
  const themeStyles =
    theme === 'dark'
      ? { backgroundColor: 'rgba(2, 6, 23, 1)', color: '#ffffff' }
      : { backgroundColor: 'rgba(255, 255, 255, 1)', color: '#000000' }
  const companies = TreeModel.companies ?? []
  const companiesFolder = TreeModel.companiesFolder ?? []
  const addIsSelectable = (element: ServerTreeElement): TreeElement => {
    return { ...element, isSelectable: true }
  }

  const selectableCompanies = companies.map(addIsSelectable)
  const selectableCompaniesFolder = companiesFolder.map(addIsSelectable)

  // const id ='child-window'
  const [windowIds, setWindowIds] = useState<string[]>([])
  const [currentId, setCurrentId] = useState('')

  const onCreateWindow = () => {
    const id = nanoid()
    setWindowIds([...windowIds, id])
    childWindowsManager.createWindow(id, {
      alwaysOnTop: true,
      autoHideMenuBar: true,
      // transparent: true
      frame: false
    })
    if (!currentId) setCurrentId(id)
  }
  const onDeleteWindow = () => {
    const isOpen = childWindowsManager.getWindowIsOpen(currentId)
    if (isOpen) {
      childWindowsManager.closeWindow(currentId)
    }
  }
  return (
    <div className={'m-2 flex flex-col gap-3'}>
      <div>Status :{childWindowsManager.getWindowIsOpen(currentId) ? 'Opened' : 'Closed'}</div>
      <Select onValueChange={(value) => setCurrentId(value)}>
        <SelectTrigger className="w-[300px]">
          <SelectValue placeholder="Select windowId" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {windowIds.map((id) => {
              return (
                <SelectItem key={id} value={id}>
                  {id}
                </SelectItem>
              )
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button onClick={onCreateWindow}>Create</Button>
      <Button onClick={onDeleteWindow}>Close</Button>

      <Button onClick={() => counter.count++}>Increment {counter.count}</Button>

      {windowIds.map((id) => (
        <ChildWindow id={id} key={id}>
          <Tree
            className={`border-[1px]-solid h-full w-full overflow-y-hidden border-slate-300`}
            style={themeStyles}
            indicator={true}
            folderIcon={{
              CompanyFolder: Icons.FolderIcon,
              DepositFolder: Icons.FolderIcon,
              BushFolder: Icons.FolderIcon,
              WellFolder: Icons.FolderIcon,
              BoreholeFolder: Icons.FolderIcon,
              PlanFolder: Icons.FolderIcon,
              Company: Icons.CompanyIcon,
              Deposit: Icons.DepositIcon,
              Bush: Icons.BushesIcon,
              Well: Icons.WellIcon,
              Borehole: Icons.BoreholeIcon,
              Plan: Icons.PlanIcon,
              Fact: Icons.FactIcon
            }}
          >
            <CustomTitleBarTree
              dataAzimut={{
                companies: selectableCompanies,
                companiesFolder: selectableCompaniesFolder
              }}
            />
            <div className={'w-full space-y-2 rounded-s p-3'} style={{ height: 'calc(100vh )' }}>
              <ScrollArea className="relative h-full">
                {[...selectableCompanies, ...selectableCompaniesFolder].map((element) => (
                  <TreeItem key={element?.uniqueTreeId} elements={[addIsSelectable(element)]} />
                ))}
              </ScrollArea>
            </div>
          </Tree>
        </ChildWindow>
      ))}
      {/*<ChildWindow id={id}>*/}
      {/*  <Button>Hello from child window</Button>*/}
      {/*  <Button onClick={() => counter.count++}>Increment {counter.count}</Button>*/}
      {/*</ChildWindow>*/}
    </div>
  )
})
