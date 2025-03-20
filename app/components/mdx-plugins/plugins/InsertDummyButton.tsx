//app/components/mdx-plugins/plugins/InsertDummyButton.tsx

import React from 'react'
import { useCellValue, rootEditor$, Button } from '@mdxeditor/editor'
import { DocumentPlusIcon } from '@heroicons/react/24/outline'
import { INSERT_DUMMY_NODE } from './dummyButtonPlugin' // Adjust import path explicitly clearly 

export const InsertDummyButton = () => {
  const rootEditor = useCellValue(rootEditor$)

  const handleInsert = () => {
    rootEditor?.dispatchCommand(INSERT_DUMMY_NODE, undefined)
  }

  return (
    <Button onClick={handleInsert} title="Insert Scrollytelling Block" className="text-xs">
      <DocumentPlusIcon className="w-3 h-3 mr-1" /> Scrollytelling
    </Button>
  )
}
