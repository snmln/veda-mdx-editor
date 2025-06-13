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
        } else if (
          child.name === 'Block' ||
          child.name === 'Chart' ||
          child.name === 'Map'
        ) {
          groups.push(currentGroup);

          const generatedProps = child.attributes.reduce((acc, item) => {
            acc[item.name] = item.value;
            return acc;
          }, {});

          const wrappedComponent = {
            type: 'mdxJsxFlowElement',
            name: 'Figure',
            attributes: [],
            children: [
              { ...child },
              {
                type: 'mdxJsxFlowElement',
                name: 'Caption',
                attributes: [
                  { name: 'attrAuthor', value: generatedProps.attrAuthor },
                  { name: 'attrUrl', value: generatedProps.attrUrl },
                ],
                children: [{ type: 'text', value: generatedProps.caption }],
              },
            ],
          };

          groups.push([wrappedComponent]);

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
