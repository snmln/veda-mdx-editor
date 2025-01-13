import { DatasetData, VedaData } from "@lib";

export const transformToDatasetsList = (content: any): DatasetData[] => {
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

export const transformToVedaData = (datasets: any): VedaData<DatasetData> => {
  const transformed = {};
  datasets?.map((dataset) => {
    const id = dataset.metadata.id;
    transformed[id] = {
      content: dataset.content,
      data: dataset.metadata,
    };
  });
  return transformed;
}
