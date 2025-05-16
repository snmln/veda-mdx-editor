import { ElementNode } from 'lexical';
//BREAD CRUMBS:
// Need to reserialize the components into <block<prose> structure
// You can do so either through string manipulation, but want to keept hat in the back pocket for the time being
// 
// Should go through the lexical node functionality and create groups based off how that is handled. 
export class BlockNode extends ElementNode {
  static getType() {
    return 'block';
  }

  static clone(node) {
    return new BlockNode(node.__key);
  }

  createDOM() {
    const dom = document.createElement('div');
    dom.classList.add('block-container'); // Add any necessary styling
    return dom;
  }

  updateDOM(prevNode, dom, config) {
    return false;
  }
}

export class ProseNode extends ElementNode {
  static getType() {
    return 'prose';
  }

  static clone(node) {
    return new ProseNode(node.__key);
  }

  createDOM() {
    const dom = document.createElement('div');
    dom.classList.add('prose-content'); // Add any necessary styling
    return dom;
  }

  updateDOM(prevNode, dom, config) {
    return false;
  }
}

export function $createBlockNode(): BlockNode {
  return new BlockNode();
}

export function $createProseNode(): ProseNode {
  return new ProseNode();
}