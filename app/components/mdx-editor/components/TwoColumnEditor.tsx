'use client';
import React, { useEffect } from 'react';
import { NestedLexicalEditor, useMdastNodeUpdater } from '@mdxeditor/editor';

export const TwoColumnEditorWrapper = ({ props }) => {
  const { mdastNode } = props;

  const updateMdastNode = useMdastNodeUpdater();

  useEffect(() => {
    const hasLeftColumn = mdastNode.children?.some(
      (child) => child.name === 'LeftColumn'
    );
    const hasRightColumn = mdastNode.children?.some(
      (child) => child.name === 'RightColumn'
    );

    if (!hasLeftColumn || !hasRightColumn) {
      const newChildren = [...(mdastNode.children || [])];
      if (!hasLeftColumn) {
        newChildren.push({
          type: 'mdxJsxFlowElement',
          name: 'LeftColumn',
          children: [{ type: 'paragraph', children: [{ type: 'text', value: '' }] }],
        });
      }
      if (!hasRightColumn) {
        newChildren.push({
          type: 'mdxJsxFlowElement',
          name: 'RightColumn',
          children: [{ type: 'paragraph', children: [{ type: 'text', value: '' }] }],
        });
      }
      updateMdastNode({ ...mdastNode, children: newChildren });
    }
  }, [mdastNode, updateMdastNode]);

  const columnFields = (column) => {
    return (
      <NestedLexicalEditor
        getContent={(node) => {
          return node.children.find((c) => c.name === column)?.children || [];
        }}
        block={true}
        getUpdatedMdastNode={(mdastNode, children) => {
          const newChildren = mdastNode.children.map((child) =>
            child.name === column ? { ...child, children } : child
          );
          return { ...mdastNode, children: newChildren };
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
