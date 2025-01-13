import React from 'react';
import { getDatasets } from 'app/content/utils/mdx';
import { Suspense } from 'react';
import Catalog from './catalog';
import { transformDatasets } from '@helpers/data';

export default function Page() {
  const posts: any[] = getDatasets(); // @TODO: Revist type here, should use data types from veda-ui
  const transformed = transformDatasets(posts);

  return (
    <section>
      <h1 className='font-semibold text-2xl mb-8 tracking-tighter'>Datasets</h1>
      <Suspense fallback={<>Loading...</>}>
        <Catalog datasets={transformed} />
      </Suspense>
    </section>
  );
}
