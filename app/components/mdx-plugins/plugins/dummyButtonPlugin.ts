//app/components/mdx-plugins/plugins/dummyButtonPlugin.ts

import { createCommand, LexicalCommand, $insertNodes } from 'lexical'
import { 
  realmPlugin, 
  addImportVisitor$, 
  addExportVisitor$, 
  addLexicalNode$, 
  createRootEditorSubscription$
} from '@mdxeditor/editor'
import { DummyButtonNode } from '../nodes/DummyButtonNode'
import { DummyButtonLexicalVisitor } from '../visitors/DummyButtonLexicalVisitor'
import { ScrollytellingMdastVisitor } from '../visitors/ScrollytellingMdastVisitor'

// define your command clearly once
export const INSERT_DUMMY_NODE: LexicalCommand<void> = createCommand('INSERT_DUMMY_NODE')

export const dummyButtonPlugin = realmPlugin({
  init(realm) {
    realm.pubIn({
      [addLexicalNode$]: DummyButtonNode,
      [addImportVisitor$]: ScrollytellingMdastVisitor,
      [addExportVisitor$]: DummyButtonLexicalVisitor
    })

    // explicitly defer editor operations until editor initialization clearly
    realm.pub(createRootEditorSubscription$, (editor) => {
      return editor.registerCommand(
        INSERT_DUMMY_NODE,
        () => {
          editor.update(() => {
            const node = new DummyButtonNode()
            $insertNodes([node])
          })
          return true
        },
        0 // high priority
      )
    })
  }
})
