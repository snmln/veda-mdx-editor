import { LexicalExportVisitor } from '@mdxeditor/editor'
import { ScrollytellingNode } from '../nodes/ScrollytellingNode'

export const ScrollytellingLexicalVisitor: LexicalExportVisitor<ScrollytellingNode, any> = {
  testLexicalNode: (node) => node instanceof ScrollytellingNode,

  visitLexicalNode: ({ actions }) => {
    actions.addAndStepInto('mdxJsxFlowElement', { name: 'ScrollytellingBlock', attributes: [] }, () => {
      // explicitly add Chapter as a child node inside ScrollytellingBlock
      actions.addAndStepInto(
        'mdxJsxFlowElement',
        {
          name: 'Chapter',
          attributes: [
            { type: 'mdxJsxAttribute', name: 'center', value: '[77.63,24.27]' },
            { type: 'mdxJsxAttribute', name: 'zoom', value: '2' },
            { type: 'mdxJsxAttribute', name: 'datasetId', value: 'lis-global-da-trends' },
            { type: 'mdxJsxAttribute', name: 'layerId', value: 'lis-global-da-tws-trend' },
            { type: 'mdxJsxAttribute', name: 'dateTime', value: '2024-05-31' },
            { type: 'mdxJsxAttribute', name: 'compareDateTime', value: '2023-05-31' },
            { type: 'mdxJsxAttribute', name: 'compareLabel', value: 'May 2024 VS May 2023' }
          ]
        },
        () => {
          actions.addAndStepInto('paragraph', {}, () => {
            actions.addLeaf('text', { value: 'This is a sample chapter content.' })
          })
        }
      )
    })
  }
} 