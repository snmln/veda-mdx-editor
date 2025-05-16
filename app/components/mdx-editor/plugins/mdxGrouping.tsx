import React, { useEffect } from 'react';
import { $isCodeNode, CodeNode } from '@lexical/code';
import { $isHeadingNode, HeadingNode } from '@lexical/rich-text';
import { $isListItemNode, $isListNode } from '@lexical/list';
import {
  $getRoot,
  $getSelection,
  LexicalEditor,
  $isRangeSelection,
  $isParagraphNode,
  $isElementNode,
  $isTextNode,
  ElementNode,
  TextNode,
  LexicalNode,
} from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

/**
 * Generic node grouping plugin that allows custom filtering and grouping of nodes
 */
export const GenericNodeGroupingPlugin: React.FC = ({
  groupingFunction = defaultGroupingFunction,
  transformFunction = defaultTransformFunction,
}) => {
  const [editor] = useLexicalComposerContext();
  // Default grouping logic - groups code blocks with same language
  function defaultGroupingFunction(node, index, allNodes) {
    if ($isCodeNode(node)) {
      return node.getLanguage() || 'unknown';
    }
    return null;
  }

  // Default transform for a group - combines code blocks of same language
  function defaultTransformFunction(nodeGroup, groupKey) {
    if (nodeGroup.length > 1 && groupKey !== 'unknown') {
      const parentNode = nodeGroup[0].getParentOrThrow();

      // Combine code content
      const combinedContent = nodeGroup
        .map((node) => node.getTextContent())
        .join('\n\n// --- Combined Code Block ---\n\n');

      // Create new code block
      const newCodeNode = new CodeNode(groupKey);
      newCodeNode.append(combinedContent);

      // Insert before first node in group
      parentNode.insertBefore(newCodeNode, nodeGroup[0]);

      // Remove original nodes
      nodeGroup.forEach((node) => node.remove());
    }
  }

  useEffect(() => {
    // This transform will run before serialization
    const removeListener = editor.registerUpdateListener(
      ({ tags, dirtyElements, dirtyLeaves }) => {
        // Only run during serialization or when there are changes
        if (
          tags.has('serialize') ||
          dirtyElements.size > 0 ||
          dirtyLeaves.size > 0
        ) {
          editor.update(() => {
            const root = $getRoot();
            const allNodes = root.getChildren();

            // Group nodes based on the grouping function
            const groups = {};

            allNodes.forEach((node, index) => {
              const groupKey = groupingFunction(node, index, allNodes);

              if (groupKey) {
                if (!groups[groupKey]) {
                  groups[groupKey] = [];
                }
                groups[groupKey].push(node);
              }
            });

            // Process each group using the transform function
            Object.entries(groups).forEach(([groupKey, nodeGroup]) => {
              if (nodeGroup.length > 1) {
                transformFunction(nodeGroup, groupKey);
              }
            });
          });
        }
      },
    );

    return () => {
      removeListener();
    };
  }, [editor, groupingFunction, transformFunction]);

  return null;
};

/**
 * Example grouping function for related Maps and Charts
 */
function groupRelatedVisualizationsFunction(node, index, allNodes) {
  // Check if this is a paragraph containing a JSX element
  if ($isParagraphNode(node)) {
    const content = node.getTextContent();

    // Check if this paragraph contains a Map or Chart component
    if (content.includes('<Map') || content.includes('<Chart')) {
      // Extract the type (Map or Chart)
      const isMap = content.includes('<Map');
      const isChart = content.includes('<Chart');

      // Group maps and charts that appear consecutively
      if (isMap) return 'visualization-map';
      if (isChart) return 'visualization-chart';
    }
  }

  // Group code blocks by language
  if ($isCodeNode(node)) {
    return `code-${node.getLanguage() || 'unknown'}`;
  }

  // Group headings that have similar prefixes (like "Step 1:", "Step 2:")
  if ($isHeadingNode(node)) {
    const text = node.getTextContent();
    const match = text.match(/^([\w\s]+\d+):/);
    if (match) {
      const prefix = match[1].split(/\d+/)[0].trim();
      return `heading-sequence-${prefix}`;
    }
  }

  return null;
}

/**
 * Example transformation function for visualization groups
 */
function transformVisualizationsFunction(nodeGroup, groupKey) {
  // Add comment to first code block in each group
  if (groupKey.startsWith('code-') && nodeGroup.length > 1) {
    const language = groupKey.replace('code-', '');
    const parentNode = nodeGroup[0].getParentOrThrow();

    // Combine code content with separators
    const combinedContent = nodeGroup
      .map((node, i) => {
        const content = node.getTextContent();
        return i === 0
          ? `// Combined ${language} code block (${nodeGroup.length} blocks merged)\n${content}`
          : `\n\n// --- Block ${i + 1} ---\n${content}`;
      })
      .join('');

    // Create new code block
    const newCodeNode = new CodeNode(language);
    newCodeNode.append(combinedContent);

    // Insert before first node in group
    parentNode.insertBefore(newCodeNode, nodeGroup[0]);

    // Remove original nodes
    nodeGroup.forEach((node) => node.remove());
  }

  // Process visualization sequences (Maps or Charts)
  if (groupKey.startsWith('visualization-') && nodeGroup.length > 1) {
    // For now, we'll just add an annotation to the first one
    // In a real implementation, you might want to combine them or wrap them in a container
    const firstNode = nodeGroup[0];
    const content = firstNode.getTextContent();

    // This is a simple demonstration - in production you'd likely do something
    // more sophisticated like adding a wrapper JSX component
    firstNode.clear();
    firstNode.append(
      `${content.trim()} {/* First of ${nodeGroup.length} visualizations */}`,
    );
  }

  // Process heading sequences
  if (groupKey.startsWith('heading-sequence-') && nodeGroup.length > 1) {
    const prefix = groupKey.replace('heading-sequence-', '');

    // Add a note to the first heading in the sequence
    const firstNode = nodeGroup[0];
    const content = firstNode.getTextContent();

    firstNode.clear();
    firstNode.append(`${content} (${nodeGroup.length}-part sequence)`);
  }
}

/**
 * Create a plugin for MDXEditor from our generic grouping plugin
 */
export const nodeGroupingPlugin = () => {
  return {
    plugin: {
      resolve: () => (props) => (
        <GenericNodeGroupingPlugin
          groupingFunction={groupRelatedVisualizationsFunction}
          transformFunction={transformVisualizationsFunction}
          {...props}
        />
      ),
    },
  };
};
