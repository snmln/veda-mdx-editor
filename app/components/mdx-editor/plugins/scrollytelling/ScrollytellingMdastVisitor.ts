//app/components/mdx-plugins/visitors/ScrollytellingMdastVisitor.ts

import { MdastImportVisitor } from '@mdxeditor/editor'
import { ScrollytellingNode } from './ScrollytellingNode'

export const ScrollytellingMdastVisitor: MdastImportVisitor<any> = {
  // Test for the outer ScrollytellingBlock element
  testNode: node => node.type === 'mdxJsxFlowElement' && node.name === 'ScrollytellingBlock',
  
  // Simply convert it to a ScrollytellingNode - the content details don't matter for visualization
  visitNode: _node => new ScrollytellingNode()
}