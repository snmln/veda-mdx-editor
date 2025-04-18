//app/components/mdx-plugins/plugins/InsertScrollytellingButton.tsx

import React from 'react'
import { useCellValue, rootEditor$, Button } from '@mdxeditor/editor'
import { DocumentPlusIcon } from '@heroicons/react/24/outline'
import { INSERT_SCROLLYTELLING_NODE } from './scrollytellingButtonPlugin'

export const InsertScrollytellingButton = () => {
  const rootEditor = useCellValue(rootEditor$)

  const handleInsert = () => {
    rootEditor?.dispatchCommand(INSERT_SCROLLYTELLING_NODE, undefined)
  }

  return (
    <Button 
      onClick={handleInsert} 
      title="Insert Scrollytelling Block" 
      className="text-xs"
    >
      <DocumentPlusIcon className="w-3 h-3 mr-1" /> Scroll
    </Button>
  )
}