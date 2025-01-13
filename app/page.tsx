import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <section>
      <div className='grid-container'>
        <h1 className='mb-8 text-2xl font-semibold tracking-tighter'>
          VEDA Dashboard Template Instance
        </h1>

        <p>
          The Visualization, Exploration, and Data Analysis (VEDA) platform is intended to show the capabilities of Analysis-Ready, Cloud-Optimized (ARCO) data. The VEDA Dashboard is one interface for the VEDA platform, that allows science teams to showcase their work for a variety of stakeholders. This flexible dashboard can be customized for your own needs. To learn more about creating your own self-hosted instance of the VEDA Dashboard, and how to manage it, visit our <Link href='https://docs.openveda.cloud/instance-management/' className='text-neutral-600 dark:text-neutral-300'> VEDA Documentation</Link>.
        </p>
        <br/>
        <p>
          This is a template for what your own instance of the VEDA Dashboard might look like. It includes the core VEDA Dashboard features, compiled using Next JS. You can copy this template instance to start your own custom instance of the VEDA Dashboard. For more help with this, reach out to veda@uah.edu. 
        </p>
      </div>
    </section>
  );
}