export const groupByBreakIntoBlocks = (ast) => {
  const result: any = [];

  const groupChildren = (children) => {
    const groups: any = [];
    let currentGroup: any = [];

    for (const child of children) {
      if (
        child.type === 'mdxJsxTextElement' ||
        child.type === 'mdxJsxFlowElement'
      ) {
        if (child.name === 'Break') {
          if (currentGroup.length > 0) {
            groups.push(currentGroup);
            currentGroup = [];
          }
        } else if (child.name === 'Block') {
          groups.push(currentGroup);
          groups.push([child]);

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
