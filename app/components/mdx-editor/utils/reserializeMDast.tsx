import { toMarkdown } from 'mdast-util-to-markdown';
import { mdxToMarkdown } from 'mdast-util-mdx';
import { gfmToMarkdown } from 'mdast-util-gfm';
const extractImports = (ast) => {
  const imports = [];
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

const checkForWrapper = () => {
  //Checking if Block and Prose tag already exist, if so we can
};

const checkForComponent = (ast) => {
  const component: any = [];
  const visit = (node, parent = null, index = null) => {
    if (!node || typeof node !== 'object') return;

    // Transform HTML node
    if (
      node.type === 'html' &&
      parent &&
      Array.isArray(parent.children) &&
      typeof index === 'number'
    ) {
      const htmlContent = node;

      // Replace the HTML node

      parent.children.splice(index, 1);
      component.push({
        type: 'mdxJsxFlowElement',
        name: 'Block',
        attributes: [],
        children: [
          {
            type: 'mdxJsxFlowElement',
            name: 'Prose',
            attributes: [],
            children: [
              {
                type: 'mdxJsxFlowElement',
                name: 'Figure',
                attributes: [],
                children: [
                  { ...node },
                  {
                    type: 'mdxJsxFlowElement',
                    name: 'Caption',
                    attributes: [],
                    children: [],
                  },
                ],
              },
            ],
          },
        ],
      });
      return;
    }

    // Recurse on children
    if (Array.isArray(node.children)) {
      for (let i = 0; i < node.children.length; i++) {
        visit(node.children[i], node, i);
      }
    }
  };

  visit(ast);

  if (ast.type === 'root' && Array.isArray(ast.children)) {
    ast.children = [...ast.children, ...component];
  }
  return ast;
};

//TO DO: Create seperate block prose containers

const groupElements = () => {
  //groupElements searches for the break element to determine
  //where the end of a section is. searching for type: html "value": "<Break />"

  //if break is found inside paragraph elevate to outside and seperate out
  const breaks = [];
  const visit = (node, parent, index) => {
    // If it's a text node with '</brea>' in its value
    if (node.type === 'html' && node.value && node.value.includes('</Break>')) {
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

const transformMdast = (node) => {
  if (!node || typeof node !== 'object') return node;

  if (node.type === 'root') {
    let newChildren = [];

    for (const child of node.children) {
      if (child.type === 'paragraph' && acceptableTypes(child)) {
        // Elevate each text/html child to the root
        for (const sub of child.children) {
          switch (sub.type) {
            case 'text':
              newChildren.push({
                type: 'paragraph',
                children: [sub],
              });
              break;
            case 'html':
              newChildren.push(sub);
              break;
            default:
          }
        }
      } else {
        // Recurse into child
        const transformed = transformMdast(child);
        newChildren.push(transformed);
      }
    }

    return { ...node, children: newChildren };
  }

  // Handle recursion for non-root nodes with children
  if (Array.isArray(node.children)) {
    return {
      ...node,
      children: node.children.map(transformMdast),
    };
  }

  return node;
};

const acceptableTypes = (node) => {
  return (
    node.type === 'paragraph' &&
    node.children.every(
      (child) =>
        child.type === 'text' ||
        child.type === 'html' ||
        child.type === 'heading',
    )
  );
};

const breakOut = () => {
  //if <break> is found in a paragraph element wrapped between text
  //it should all be seperated out to their own elements
};
const handleTwoColumn = () => {};

const groupByBreakIntoBlocks = (ast) => {
  const result: any = [];

  const groupChildren = (children) => {
    const groups: any = [];
    let currentGroup: any = [];

    for (const child of children) {
      if (child.type === 'html' && child.value.includes('<Break />')) {
        if (currentGroup.length > 0) {
          groups.push(currentGroup);
          currentGroup = [];
        }
      } else {
        // Recurse into children
        // if (child.children) {
        //   child.children = groupChildren(child.children);
        // }
        // console.log('child', child);
        currentGroup.push(child);
      }
    }
    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }
    return groups;
  };

  if (ast.type === 'root' && Array.isArray(ast.children)) {
    const groups = groupChildren(ast.children);
    for (const group of groups) {
      result.push({
        type: 'mdxJsxFlowElement',
        name: 'Block',
        children: [
          {
            type: 'mdxJsxFlowElement',
            name: 'Prose',
            children: [...group],
          },
        ],
      });
    }
  }

  return result;
};

export const reserializedMdxContent = (MDAST) => {
  const seperatedMDAST = transformMdast(MDAST);
  //   TYPE ERRORS

  const groupedMDSAT = groupByBreakIntoBlocks(seperatedMDAST);
  //   const iteratedMDAST = extractImports(seperatedMDAST);

  extractImports(seperatedMDAST);
  const wrapper = [
    {
      type: 'mdxJsxFlowElement',
      name: 'Block',
      children: [
        {
          type: 'mdxJsxFlowElement',
          name: 'Prose',
          children: [...seperatedMDAST.children],
        },
      ],
    },
  ];

  const newMDast = { ...seperatedMDAST, children: groupedMDSAT };

  //TO DO: Ensure that List are representing as aparagraph and not list
  //   console.log('transformMdast', transformMdast(newMDast));

  //   console.log('checkForImportStatement', checkForImportStatement(newMDast));

  //   console.log('checkForComponent', checkForComponent(newMDast));

  //   newMDast = checkForImportStatement(newMDast);
  //   newMDast = checkForComponent(newMDast);
  const mdastToMdx = (mdast) => {
    return toMarkdown(mdast, {
      extensions: [
        mdxToMarkdown(), // Handle JSX elements
        gfmToMarkdown(), // Handle GitHub Flavored Markdown
      ],
    });
  };
  console.log('newMDast', newMDast);
  return mdastToMdx(newMDast);
};
