import { toMarkdown } from 'mdast-util-to-markdown';
import { mdxToMarkdown } from 'mdast-util-mdx';
import { gfmToMarkdown } from 'mdast-util-gfm';
import { mdxJsxToMarkdown } from 'mdast-util-mdx-jsx';
import { extractImports } from './extractImports';

import { groupByBreakIntoBlocks } from './groupElements';

const blockItem = {
  type: 'mdxJsxFlowElement',
  name: 'Block',
  children: [],
};

const proseItem = {
  type: 'mdxJsxFlowElement',
  name: 'Prose',
  children: [],
};

//TO DO: Create seperate block prose containers

const transformMdast = (node) => {
  if (!node || typeof node !== 'object') return node;

  if (node.type === 'root') {
    const newChildren: any = [];

    for (const child of node.children) {
      if (child.type === 'paragraph') {
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
            case 'mdxJsxTextElement':
              newChildren.push(sub);
              break;
            case 'mdxJsxFlowElement':
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

export const reserializedMdxContent = (MDAST) => {
  const seperatedMDAST = transformMdast(MDAST);

  const groupedMDSAT = groupByBreakIntoBlocks(seperatedMDAST);
  extractImports(seperatedMDAST);

  const newMDast = { ...seperatedMDAST, children: groupedMDSAT };
  const mdastToMdx = (mdast) => {
    return toMarkdown(mdast, {
      extensions: [mdxToMarkdown(), gfmToMarkdown(), mdxJsxToMarkdown()],
    });
  };

  return mdastToMdx(newMDast);
};
