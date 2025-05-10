export interface ChartProps {
  dataPath: string;
  dateFormat: string;
  idKey: string;
  xKey: string;
  yKey: string;
  altTitle: string;
  altDesc: string;
  colors?: string;
  colorScheme?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  highlightStart?: string;
  highlightEnd?: string;
  highlightLabel?: string;
  availableDomain?: string;
}

export interface MapProps {
  center: string;
  zoom: string;
  datasetId: string;
  layerId: string;
  dateTime: string;
  compareDateTime: string;
  compareLabel: string;
}
