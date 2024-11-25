'use client';
import React from 'react';
import { CatalogView, useFiltersWithQS } from '@lib';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Catalog({ datasets }: { datasets: any }) {
  const pathname = usePathname();
  const controlVars = useFiltersWithQS();

  return (
    <CatalogView
      datasets={datasets}
      onFilterChanges={() => controlVars}
      pathname={pathname}
      linkProperties={{
        LinkElement: Link,
        pathAttributeKeyName: 'href',
      }}
    />
  );
}
