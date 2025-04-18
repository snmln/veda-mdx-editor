//app/components/mdx-plugins/plugins/scrollytellingButtonPlugin.ts

import { createCommand, LexicalCommand, $insertNodes } from 'lexical'
import { 
  realmPlugin, 
  addImportVisitor$, 
  addExportVisitor$, 
  addLexicalNode$, 
  createRootEditorSubscription$
} from '@mdxeditor/editor'
import { ScrollytellingNode } from './ScrollytellingNode'
import { ScrollytellingLexicalVisitor } from './ScrollytellingLexicalVisitor'
import { ScrollytellingMdastVisitor } from './ScrollytellingMdastVisitor'

// Define the command for inserting the node
export const INSERT_SCROLLYTELLING_NODE: LexicalCommand<void> = createCommand('INSERT_SCROLLYTELLING_NODE')

export const scrollytellingButtonPlugin = realmPlugin({
  init(realm) {
    // Register our components with the editor realm
    realm.pubIn({
      [addLexicalNode$]: ScrollytellingNode,
      [addImportVisitor$]: ScrollytellingMdastVisitor,
      [addExportVisitor$]: ScrollytellingLexicalVisitor
    })

    // Register the command handler
    realm.pub(createRootEditorSubscription$, (editor) => {
      return editor.registerCommand(
        INSERT_SCROLLYTELLING_NODE,
        () => {
          editor.update(() => {
            const node = new ScrollytellingNode()
            $insertNodes([node])
          })
          return true
        },
        0 // high priority
      )
    })
  }
})