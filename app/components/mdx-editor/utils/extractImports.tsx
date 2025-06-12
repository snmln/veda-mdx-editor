export const extractImports = (ast) => {
  const imports: any = [];
  const visit = (node, parent, index) => {
    // If it's a text node with 'import' in its value
    if (
      node.type === 'text' &&
      node.value &&
      node.value.includes('import') &&
      node.value.includes('from')
    ) {
      if (
        parent &&
        Array.isArray(parent.children) &&
        typeof index === 'number'
      ) {
        // Remove the node from its original position
        parent.children.splice(index, 1);
        // Wrap it in a paragraph or keep as-is depending on your use case
        imports.push({
          type: 'paragraph',
          children: [node],
        });
        return; // Skip deeper recursion into removed node
      }
    }

    // Recurse through children if they exist
    if (node.children && Array.isArray(node.children)) {
      // Copy to avoid mutation issues when removing nodes
      const childrenCopy = [...node.children];
      for (let i = 0; i < childrenCopy.length; i++) {
        visit(childrenCopy[i], node, i);
      }
    }
  };

  visit(ast, null, null);

  // Prepend extracted imports to top-level children
  if (ast.type === 'root' && Array.isArray(ast.children)) {
    ast.children = [...imports, ...ast.children];
  }

  return ast;
};
