import { notFound } from 'next/navigation'
import { CustomMDX } from 'app/components/mdx'
import { getDatasets } from 'app/blog/utils/mdx';
import { baseUrl } from 'app/sitemap'
import {PageHero} from 'app/lib'

function generateStaticParams() {
  let posts = getDatasets()

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export function generateMetadata({ params }) {
  let post = getDatasets().find((post) => post.slug === params.slug)
  
  if (!post) {
    return
  }

  let {
    name,
    pubDate: publishedTime,
    description,
    image,
  } = post.metadata
  let ogImage = image ? image : `${baseUrl}/og?title=${encodeURIComponent(name)}`

  return {
    name,
    description,
    openGraph: {
      name,
      description,
      type: 'article',
      publishedTime,
      url: `${baseUrl}/blog/${post.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      name,
      description,
      images: [ogImage],
    },
  }
}

export default function Blog({ params }) {
  let post = getDatasets().find((post) => post.slug === params.slug)

  if (!post) {
    notFound()
  }

  return (
    <section>
      <article className="prose">
      <PageHero
        title={post.metadata.name}
        description={post.metadata.description}
        coverSrc={post.metadata.media?.src} 
        coverAlt={post.metadata.media?.alt}
      />
        <CustomMDX source={post.content} />
      </article>
    </section>
  )
}
