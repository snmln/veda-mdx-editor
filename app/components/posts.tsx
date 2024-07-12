'use client';
import Link from 'next/link'
import Image from 'next/image'
import { useDataStore } from 'app/store/providers/data';

export function BlogPosts({ postType, stories}: {postType: string, stories?: any[]}) {
  const { datasets } = useDataStore();
  let allBlogs;
  if (postType === 'dataset' && datasets) {
    allBlogs = datasets
  } else {
    allBlogs = stories || [];
  }
  
  const prefix = (postType === 'dataset')? 'datasets': 'stories'
  return (
    <div>
      {allBlogs
        .map((post) => (
          <Link
            key={post.slug}
            className="flex flex-col space-y-1 mb-4"
            href={`${prefix}/${post.slug}`}
          >
            <div>
              <p className="font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">
                {post.metadata.name}
              </p>
            </div>
              <p>
                {post.metadata.description}
              </p>
              <div>
                {post.metadata.media && 
                <Image 
                  src={post.metadata.media.src} 
                  alt={post.metadata.media.alt} 
                  width={300} 
                  height={300} 
                /> }
              </div>
          </Link>
        ))}
    </div>
  )
}
