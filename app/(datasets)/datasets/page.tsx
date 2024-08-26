'use client';
import { useDataStore } from "app/store/providers/data";
import { CatalogView, useFiltersWithQS } from '../../lib';
import { useRouter } from "next/navigation";
import { usePathname } from 'next/navigation'

export default function Page() {
  const { datasets: posts } = useDataStore();

  const transformData = () => {
    const data = posts?.map((post) => ({
      ...post.metadata
    }));

    const result = data?.map((d) => {
      const updatedTax = d.taxonomy.map((t) => {
        const updatedVals = t.values.map((v) => {
          return {
            id: v.replace(/ /g, '_').toLowerCase(),
            name: v
          }
        })
        return {...t, values: updatedVals}
      })
      return {...d, taxonomy: updatedTax}
    })

    return result
  };

  const transformed = transformData();

  const router = useRouter();
  const pathName = usePathname();
  const controlVars = useFiltersWithQS({navigate: router, push: true});

  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">Datasets</h1>
      <CatalogView datasets={transformed} onFilterChanges={() => controlVars} location={pathName}/>
    </section>
  )
}

