import Link from 'next/link';
import { PageHeader } from '@lib';
import NasaLogo from '../../public/images/nasa-logo';
import { NavItem } from '@lib';

const navItems: NavItem[] = [
  // @TODO: This should use the NavLinkType from veda-ui...
  {
    id: 'test',
    title: 'Test',
    type: 'dropdown',
    children: [
      {
        id: 'dropdown-menu-item-1',
        title: 'dropdown menu item 1',
        to: '/stories',
        type: 'internalLink'
      }
    ]
  },
  {
    id: 'another-test',
    title: 'Another Test',
    type: 'dropdown',
    children: [
      {
        id: 'dropdown-menu-item-2',
        title: 'dropdown menu item 2',
        to: '/stories',
        type: 'internalLink'
      }
    ]
  },
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
          subNavItems={[]}
          logo={<NasaLogo />}
          linkProperties={linkProps}
        />
      </nav>
    </aside>
  );
}
