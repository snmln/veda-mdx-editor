// @TODO: Revist type here, should use data types from veda-ui
export const transformData = (content: any) => {
  const data = content?.map((post) => ({
    ...post.metadata,
  }));

  const result = data?.map((d) => {
    const updatedTax = d.taxonomy.map((t) => {
      const updatedVals = t.values.map((v) => {
        return {
          id: v.replace(/ /g, '_').toLowerCase(),
          name: v,
        };
      });
      return { ...t, values: updatedVals };
    });
    return { ...d, taxonomy: updatedTax };
  });

  return result;
};
