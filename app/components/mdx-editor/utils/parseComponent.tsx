import { handleTwoColumn } from './parseTwoColumn';

export const parseComponent = (ast) => {
  const component: any = [];
  const visit = (node, parent = null, index = null) => {
    if (!node || typeof node !== 'object') return;

    if (
      node.type === 'mdxJsxFlowElement' &&
      parent &&
      node.name.includes('TwoColumn')
    ) {
      parent.children.splice(index, 1, handleTwoColumn(node));

      return;
    } else if (
      node.type === 'html' &&
      parent &&
      Array.isArray(parent.children) &&
      typeof index === 'number'
    ) {
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
