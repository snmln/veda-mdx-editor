'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  ExplorationAndAnalysis,
  DatasetSelectorModal,
  useTimelineDatasetAtom,
  externalDatasetsAtom,
} from 'app/lib';
import { useSetAtom } from 'jotai';

export default function ExplorationAnalysis({ datasets }: { datasets: any }) {
  const transformData = () => {
    const data = datasets?.map((post) => ({
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

  const transformed = transformData();

  const setExternalDatasets = useSetAtom(externalDatasetsAtom);

  setExternalDatasets(transformed);

  const openModal = () => {
    setDatasetModalRevealed(true);
  };
  const closeModal = () => {
    setDatasetModalRevealed(false);
  };

  const [timelineDatasets, setTimelineDatasets] = useTimelineDatasetAtom();
  const [datasetModalRevealed, setDatasetModalRevealed] = useState(
    !timelineDatasets.length,
  );

  return (
    <>
      <DatasetSelectorModal
        revealed={datasetModalRevealed}
        close={closeModal}
        linkProperties={{
          LinkElement: Link,
          pathAttributeKeyName: 'href',
        }}
        timelineDatasets={timelineDatasets}
        setTimelineDatasets={setTimelineDatasets}
        datasetPathName={'data-catalog'}
        datasets={transformed}
      />

      <ExplorationAndAnalysis
        datasets={timelineDatasets}
        setDatasets={setTimelineDatasets}
        openDatasetsSelectionModal={openModal}
      />
    </>
  );
}
