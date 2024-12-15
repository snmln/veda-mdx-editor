'use client';
import React, { useCallback } from 'react';
import { CatalogView, useFiltersWithQS } from '@lib';
import { useRouter } from 'next/navigation';

export default function Catalog({ datasets }: { datasets: any }) {
  const controlVars = useFiltersWithQS();
  const router = useRouter();

  const handleCardNavigation = useCallback((path: string) => {
    router.push(path);
  }, [router]);

  return (
    <CatalogView
      datasets={datasets}
      onFilterChanges={() => controlVars}
      onCardNavigate={handleCardNavigation}
    />
  );
}
