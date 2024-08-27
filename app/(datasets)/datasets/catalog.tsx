'use client';
import { CatalogView, useFiltersWithQS } from '../../lib';
import { useRouter } from "next/navigation";
import { usePathname } from 'next/navigation'

export default function Catalog({
  datasets
}: {
  datasets: any;
}) {
  const router = useRouter();
  const pathName = usePathname();
  const controlVars = useFiltersWithQS({navigate: router, push: true});

  return <CatalogView datasets={datasets} onFilterChanges={() => controlVars} location={pathName}/>
}