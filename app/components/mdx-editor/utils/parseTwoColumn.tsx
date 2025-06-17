import { wrapComponent } from './wrapComponent';

export const handleTwoColumn = (MDAST) => {
  const newTwoColumn: any = [];
  for (const twoColumnChildren of MDAST.children) {
    if (
      twoColumnChildren.children.some(
        (e) => e.name === 'Chart' || e.name === 'Map',
      )
    ) {
      for (const columnChild of twoColumnChildren.children) {
        if (columnChild.name === 'Chart' || columnChild.name === 'Map') {
          newTwoColumn.push(wrapComponent(columnChild));
        }
      }
    } else {
      newTwoColumn.push({
        type: 'mdxJsxFlowElement',
        name: 'Prose',
        attributes: [],
        children: [...twoColumnChildren.children],
      });
    }
  }
  return newTwoColumn;
};
