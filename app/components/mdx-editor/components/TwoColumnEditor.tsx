'use client';
import React from 'react';
import { NestedLexicalEditor, useMdastNodeUpdater } from '@mdxeditor/editor';

export const TwoColumnEditorWrapper = ({ props }) => {
  const { mdastNode } = props;

  const updateMdastNode = useMdastNodeUpdater();

  const setInitialChildren = () => {
    const checkForColumns = (children) =>
      children.name === 'LeftColumn' || children.name === 'RightColumn';
    if (mdastNode.children && mdastNode.children.some(checkForColumns)) {
      const currentIndex = mdastNode.children.findIndex(
        (obj) => obj.name === 'LeftColumn',
      );
      if (currentIndex != 0) {
        const [foundElement] = mdastNode.children.splice(currentIndex, 1);
        return mdastNode.children.unshift(foundElement);
      }
      return mdastNode;
    } else {
      return mdastNode.children.push(
        { type: 'mdxJsxFlowElement', name: 'LeftColumn', children: [] },
        { type: 'mdxJsxFlowElement', name: 'RightColumn', children: [] },
      );
    }
  };
  setInitialChildren();

  const columnFields = (column) => {
    return (
      <NestedLexicalEditor
        getContent={(node) => node.children}
        block={true}
        getUpdatedMdastNode={(currentMdastNode, children: any) => {
          try {
            const newColumnNode = {
              type: 'mdxJsxFlowElement',
              name: column,
              children: children,
            };

            const filteredChildren =
              currentMdastNode.children?.filter(
                (c: any) => c.name !== column,
              ) || [];

            const updatedChildren = [...filteredChildren, newColumnNode];
            const getColumnIndex = currentMdastNode.children.findIndex(
              (obj) => obj.name == column,
            );
            currentMdastNode.children[getColumnIndex] = newColumnNode;

            updateMdastNode({ ...currentMdastNode });

            return {
              ...currentMdastNode,
              children: updatedChildren,
            };
          } catch (error) {
            console.error('Error updating MDAST node:', error);
            return currentMdastNode;
          }
        }}
      />
    );
  };
  return (
    <div className='grid-container maxw-full'>
      <div className='grid-row'>
        <div className='grid-col border rounded-md p-2'>
          {columnFields('LeftColumn')}
        </div>
        <div className='grid-col border rounded-md p-2'>
          {columnFields('RightColumn')}
        </div>
      </div>
    </div>
  );
};
