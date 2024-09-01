"use client"
import { EditorContent } from '@tiptap/react'
import React, { useMemo, useRef } from 'react'

import { LinkMenu } from '@/components/editor/components/menus'

import { useBlockEditor } from '@/hooks/useBlockEditor'

import '@/styles/index.css'

import ImageBlockMenu from '@/components/editor/extensions/ImageBlock/components/ImageBlockMenu'
import { ColumnsMenu } from '@/components/editor/extensions/MultiColumn/menus'
import { TableColumnMenu, TableRowMenu } from '@/components/editor/extensions/Table/menus'
import { EditorHeader } from './components/EditorHeader'
import { TextMenu } from '../menus/TextMenu'
import { ContentItemMenu } from '../menus/ContentItemMenu'
import { useSidebar } from '@/hooks/useSidebar'
import * as Y from 'yjs'
import { HocuspocusProvider} from '@hocuspocus/provider'
import { useAppState } from '@/lib/providers/state-provider'
import HeaderOption from '../../HeaderOptions'

export const BlockEditor = ({
  path,
  ydoc,
  provider,
}: {
  path: string
  hasCollab: boolean
  ydoc: Y.Doc
  provider?: HocuspocusProvider | null | undefined
}) => {
  const menuContainerRef = useRef(null)
  const {workspaceId,folderId,fileId} = useAppState()
  const leftSidebar = useSidebar()
  const { editor, users, collabState } = useBlockEditor({ ydoc, provider })

  if (!editor || !users) {
    return null
  }
  const breadcrumbsString = useMemo(()=>{
    return `${workspaceId}/${folderId}/${fileId?.split("folder")[1]}`
  },[path,workspaceId])

  return (
    <div className="flex h-full" ref={menuContainerRef}>
      {/* <Sidebar isOpen={leftSidebar.isOpen} onClose={leftSidebar.close} editor={editor} /> */}
      <div className="relative flex flex-col flex-1 h-full overflow-hidden">
        {/* <EditorHeader
          editor={editor}
          collabState={collabState}
          users={users}
          isSidebarOpen={leftSidebar.isOpen}
          toggleSidebar={leftSidebar.toggle}
          path={breadcrumbsString}
        /> */}
        <EditorContent editor={editor} className="flex-1 overflow-y-auto" />
        <ContentItemMenu editor={editor} />
        <LinkMenu editor={editor} appendTo={menuContainerRef} />
        <TextMenu editor={editor} />
        <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
        <TableRowMenu editor={editor} appendTo={menuContainerRef} />
        <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
        <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
      </div>
    </div>
  )
}

export default BlockEditor
