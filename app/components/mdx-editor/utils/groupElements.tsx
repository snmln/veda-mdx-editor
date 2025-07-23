import { handleTwoColumn } from './parseTwoColumn';
import { wrapComponent } from './wrapComponent';

export const groupByBreakIntoBlocks = (ast) => {
  const result: any = [];
  const proseWrapper = (children) => {
    return {
      type: 'mdxJsxFlowElement',
      name: 'Prose',
      children: [...children],
    };
  };

  const groupChildren = (children) => {
    const groups: any = [];
    let currentGroup: any = [];

    const BLOCK_LIKE_ELEMENTS = new Set(['Block', 'Chart', 'Map', 'TwoColumn']);

    for (const child of children) {
      const isSpecialMdxElement =
        child.type === 'mdxJsxTextElement' ||
        child.type === 'mdxJsxFlowElement';

      if (
        isSpecialMdxElement &&
        (child.name === 'Break' || BLOCK_LIKE_ELEMENTS.has(child.name))
      ) {
        // When a block-level or Break component is found, the current group of prose is complete.
        if (currentGroup.length > 0) {
          // The 'Map' component has special wrapping logic where its preceding prose
          // group is not wrapped in a <Prose> component.
          if (child.name === 'Map') {
            groups.push(currentGroup);
          } else {
            groups.push([proseWrapper(currentGroup)]);
          }
        }
        currentGroup = []; // Reset for the next group.

        // Handle the component that broke the group
        if (child.name === 'Chart' || child.name === 'Map') {
          groups.push([wrapComponent(child)]);
        } else if (child.name === 'TwoColumn') {
          groups.push(handleTwoColumn(child));
        }
        // Note: 'Break' and 'Block' elements are not added to a new group here,
        // which matches the original logic. The handling of 'Block' seems like a
        // potential bug as it gets dropped from the final output.
      } else {
        currentGroup.push(child);
      }
    }

    if (currentGroup.length > 0) {
      groups.push([...currentGroup]);
    }
    return groups;
  };

  if (ast.type === 'root' && Array.isArray(ast.children)) {
    const groups = groupChildren(ast.children);

    for (const group of groups) {
      // Check for prose wrapper inside group If no prose wrapper
      // then wrap group inside prose object before adding to block element

      if (
        group.some((item) => {
          console.log('item', item);
          return item.name === 'Prose' || item.name === 'Figure';
        })
      ) {
        result.push({
          type: 'mdxJsxFlowElement',
          name: 'Block',
          children: [...group],
        });
      } else {
        console.log('block>prose');
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
  }

  return result;
};
