export const handleTwoColumn = (MDAST) => {
  const newTwoColumn: any = [];
  for (const child of MDAST.children) {
    if (child.children.some((e) => e.type === 'html')) {
      newTwoColumn.push({
        type: 'mdxJsxFlowElement',
        name: 'Figure',
        attributes: [],
        children: [
          ...child.children,
          {
            type: 'mdxJsxFlowElement',
            name: 'Caption',
            attributes: [],
            children: [],
          },
        ],
      });
    } else {
      newTwoColumn.push({
        type: 'mdxJsxFlowElement',
        name: 'Prose',
        attributes: [],
        children: [...child.children],
      });
    }
  }
  return {
    type: 'mdxJsxFlowElement',
    name: 'Block',
    children: [...newTwoColumn],
  };
};
