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

    for (const child of children) {
      if (
        child.type === 'mdxJsxTextElement' ||
        child.type === 'mdxJsxFlowElement'
      ) {
        if (child.name === 'Break') {
          if (currentGroup.length > 0) {
            groups.push([proseWrapper(currentGroup)]);
          }
          currentGroup = [];
        } else if (
          child.name === 'Block' ||
          child.name === 'Chart' ||
          child.name === 'Map' ||
          child.name === 'TwoColumn' ||
          child.name === 'Emit'
        ) {
          if (currentGroup.length > 0) {
            groups.push([proseWrapper(currentGroup)]);
          }
          currentGroup = [];

          if (child.name === 'Chart' || child.name === 'Map' || child.name === 'Emit') {
            groups.push([wrapComponent(child)]);
          } else if (child.name === 'TwoColumn') {
            const parsedColumn = handleTwoColumn(child);
            groups.push(parsedColumn);
          } else {
            groups.push([child]);
          }
        } else {
          currentGroup.push(child);
        }
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
          return item.name === 'Prose';
        })
      ) {
        result.push({
          type: 'mdxJsxFlowElement',
          name: 'Block',
          children: [...group],
        });
      } else {
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
  console.log('results', result);
  return result;
};

// else if (child.name === 'Emit') {
//   const returnMockItem = {
//     type: 'mdxJsxFlowElement',
//     name: 'Block',
//     attributes: [
//       {
//         type: 'mdxJsxAttribute',
//         name: 'type',
//         value: 'wide',
//       },
//     ],
//     children: [
//       {
//         type: 'mdxJsxFlowElement',
//         name: 'Figure',
//         children: [
//           {
//             type: 'mdxJsxFlowElement',
//             name: 'Embed',
//             children: [],
//             attributes: [
//               {
//                 type: 'mdxJsxAttribute',
//                 name: 'src',
//                 value:
//                   'https://earth.gov/ghgcenter/custom-interfaces/urban-dashboard/?dataset=vulcan',
//               },
//               {
//                 type: 'mdxJsxAttribute',
//                 name: 'height',
//                 value: '800',
//               },
//             ],
//           },
//         ],
//       },
//     ],
//   };
//   result.push(returnMockItem);
// }
