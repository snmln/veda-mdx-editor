import React from 'react';
import { getStoriesMetadata } from 'app/content/utils/mdx';
import Hub from './hub';

export default function Page() {
  const stories = getStoriesMetadata().map(d => ({...d.metadata, path: `stories/${d.slug}`}));

  return (
    <section>
      <h1 className='font-semibold text-2xl mb-8 tracking-tighter'>Stories</h1>
      <Hub stories={stories} />
    </section>
  );
}
