import { LexicalExportVisitor } from '@mdxeditor/editor'
import { DummyButtonNode } from '../nodes/DummyButtonNode'

export const DummyButtonLexicalVisitor: LexicalExportVisitor<DummyButtonNode> = {
  testLexicalNode: (node) => node instanceof DummyButtonNode,
  
  visitLexicalNode: ({ actions }) => {
    actions.addAndStepInto('mdxJsxFlowElement', {
      name: 'ScrollytellingBlock',
      attributes: [],
      children: [
        {
          type: 'mdxJsxFlowElement',
          name: 'Chapter',
          attributes: [
            { type: 'mdxJsxAttribute', name: 'center', value: '[77.63,24.27]' },
            { type: 'mdxJsxAttribute', name: 'zoom', value: '2' },
            { type: 'mdxJsxAttribute', name: 'datasetId', value: 'lis-global-da-trends' },
            { type: 'mdxJsxAttribute', name: 'layerId', value: 'lis-global-da-tws-trend' },
            { type: 'mdxJsxAttribute', name: 'datetime', value: '2003-01-01' }
          ],
          children: [
            { type: 'heading', depth: 2, children: [{ type: 'text', value: 'Freshwater is depleting' }] },
            { type: 'paragraph', children: [{ type: 'text', value: 'Over the globe, terrestrial water storage...' }] }
          ]
        }
      ]
    })
  }
}
