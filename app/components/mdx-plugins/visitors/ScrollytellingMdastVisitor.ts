//app/components/mdx-plugins/visitors/ScrollytellingMdastVisitor.ts

import { MdastImportVisitor } from '@mdxeditor/editor'
import { DummyButtonNode } from '../nodes/DummyButtonNode'

export const ScrollytellingMdastVisitor: MdastImportVisitor = {
  testNode: node => node.type === 'mdxJsxFlowElement' && node.name === 'ScrollytellingBlock',
  visitNode: _node => new DummyButtonNode(),
}
