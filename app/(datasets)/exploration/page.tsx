import React from 'react';
import dynamic from 'next/dynamic';
import { getTransformedDatasetMetadata } from 'app/content/utils/mdx';
import { PageHero } from 'app/lib';

const ExplorationAnalysis = dynamic(
  () => import('./exploration'),
  { 
    ssr: false,
    loading: () => <p>Loading...</p>
  },
);

export default function Page() {
  const datasets: any[] = getTransformedDatasetMetadata();
  return (
    <section>
      <PageHero title='Exploration' isHidden />
      <ExplorationAnalysis datasets={datasets} />
    </section>
  );
}
