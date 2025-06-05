import { toMarkdown } from 'mdast-util-to-markdown';
import { mdxToMarkdown } from 'mdast-util-mdx';
import { gfmToMarkdown } from 'mdast-util-gfm';
const extractImports = (ast) => {
  const imports = [];
  console.log('imports', imports);
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

const checkForImportStatement = (MDAST) => {
  //Check the contents for any import statements.
  //Get the index and add wrapper after
  // str.includes('import') && str.includes('from')
  console.log('extractImports', extractImports(MDAST));
};

export const reserializedMdxContent = (MDAST) => {
  const wrapper = [
    {
      type: 'mdxJsxFlowElement',
      name: 'Block',
      children: [
        {
          type: 'mdxJsxFlowElement',
          name: 'Prose',
          children: [...MDAST.children],
        },
      ],
    },
  ];

  const newMDast = { ...MDAST, children: wrapper };

  //TO DO: Ensure that List are representing as aparagraph and not list
  console.log('checkForImportStatement', checkForImportStatement(newMDast));
  const mdastToMdx = (mdast) => {
    return toMarkdown(mdast, {
      extensions: [
        mdxToMarkdown(), // Handle JSX elements
        gfmToMarkdown(), // Handle GitHub Flavored Markdown
      ],
    });
  };
  console.log(newMDast);
  return mdastToMdx(newMDast);
};

const checkForwrapper = () => {};
