//app/components/mdx-plugins/visitors/DummyButtonLexicalVisitor.ts

import { LexicalExportVisitor } from '@mdxeditor/editor'
import { DummyButtonNode } from '../nodes/DummyButtonNode'

export const DummyButtonLexicalVisitor: LexicalExportVisitor<DummyButtonNode> = {
  testLexicalNode: (node) => node instanceof DummyButtonNode,

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
            { type: 'mdxJsxAttribute', name: 'datetime', value: '2003-01-01' }
          ]
        },
        () => {
          // explicitly add heading child node inside Chapter
          actions.addAndStepInto('heading', { depth: 2 }, () => {
            actions.addAndStepInto('text', { value: 'Freshwater is depleting' })
          })

          // explicitly add paragraph node inside Chapter
          actions.addAndStepInto('paragraph', {}, () => {
            actions.addAndStepInto('text', {
              value:
                'Over the globe, terrestrial water storage in many places is decreasing, driven by the independent or combined impacts of natural variability, human groundwater pumping, and climate change.'
            })
          })
        }
      )
    })
  }
}
