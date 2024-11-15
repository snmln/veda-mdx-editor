import { Suspense } from 'react';
import { getDatasets } from 'app/content/utils/mdx';
import ExplorationAnalysis from './exploration';
import { PageHero } from 'app/lib';

export default function Page() {
  const datasets: any[] = getDatasets();
  // @TODO: Investigate why we need to set 100vh
  return (
    <div style={{ minHeight: '100vh', height: '1px' }}>
      <Suspense fallback={<>Loading...</>}>
        <PageHero title='Exploration' isHidden />
        <ExplorationAnalysis datasets={datasets} />
      </Suspense>
    </div>
  );
}
