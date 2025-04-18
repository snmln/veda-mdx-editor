import { ElementNode, LexicalNode, NodeKey, SerializedElementNode } from 'lexical'

export class ScrollytellingNode extends ElementNode {
  static getType(): string {
    return 'scrollytelling'
  }

  static clone(node: ScrollytellingNode): ScrollytellingNode {
    return new ScrollytellingNode(node.__key)
  }

  createDOM(): HTMLElement {
    const element = document.createElement('div')
    element.className = 'scrollytelling-block'
    return element
  }

  updateDOM(): boolean {
    return false
  }

  static importJSON(): ScrollytellingNode {
    return new ScrollytellingNode()
  }

  exportJSON(): SerializedElementNode {
    return {
      ...super.exportJSON(),
      type: 'scrollytelling',
      version: 1,
    }
  }
}

export function $createScrollytellingNode(): ScrollytellingNode {
  return new ScrollytellingNode()
}

export function $isScrollytellingNode(node: LexicalNode | null | undefined): node is ScrollytellingNode {
  return node instanceof ScrollytellingNode
} 