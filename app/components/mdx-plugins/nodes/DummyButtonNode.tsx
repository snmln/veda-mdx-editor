//app/components/mdx-plugins/nodes/DummyButtonNode.tsx

import { DecoratorNode } from 'lexical'

export class DummyButtonNode extends DecoratorNode<JSX.Element> {
  static getType() { return 'dummy-button-node' }

  static clone(node: DummyButtonNode): DummyButtonNode {
    return new DummyButtonNode(node.__key)
  }

  static importJSON(_serializedNode: any): DummyButtonNode {
    return new DummyButtonNode()
  }

  exportJSON(): any {
    return {
      type: 'dummy-button-node',
      version: 1
    }
  }

  createDOM() { return document.createElement('div') }

  updateDOM() { return false }

  decorate() { 
    return <div className="border rounded p-2 bg-purple-100">Dummy Button Placeholder</div>
  }
}
