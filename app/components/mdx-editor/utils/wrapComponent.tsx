export const wrapComponent = (mdastChild) => {
  const generatedProps = mdastChild.attributes.reduce((acc, item) => {
    acc[item.name] = item.value;
    return acc;
  }, {});

  const wrappedComponent = {
    type: 'mdxJsxFlowElement',
    name: 'Figure',
    attributes: [],
    children: [
      { ...mdastChild },
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
  return wrappedComponent;
};
