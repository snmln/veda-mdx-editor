import React from 'react';
import Link from 'next/link';
import { PageHeader } from '@lib';
import { NavItem } from '@lib';
import NasaLogoColor from 'app/components/nasa-logo-color.js';


const navItems: NavItem[] = [
  {
    id: 'data-catalog',
    title: 'Data Catalog',
    to: '/data-catalog',
    type: 'internalLink'
  },
  {
    id: 'exploration',
    title: 'Exploration',
    to: '/exploration',
    type: 'internalLink'
  },
  {
    id: 'stories',
    title: 'Stories',
    to: '/stories',
    type: 'internalLink'
  }
];

const subNavItems: NavItem[] = [
  {
    id: 'about',
    title: 'About',
    to: '/about',
    type: 'internalLink'
  },
  {
    id: 'contact-us',
    title: 'Contact us',
    actionId: 'open-google-form',
    type: 'action'
  }
]

export function Navbar() {
  const linkProps = {
    LinkElement: Link,
    pathAttributeKeyName: 'href',
  };

  return (
    <aside className='-ml-[8px] tracking-tight'>
      <nav id='nav'>
        <PageHeader
          mainNavItems={navItems}
          subNavItems={subNavItems}
          logoSvg={<NasaLogoColor />}
          title={'Earthdata VEDA Dashboard'}
          linkProperties={linkProps}
        />
      </nav>
    </aside>
  );
}
