import React from 'react';
import Link from 'next/link';
import { navItems, subNavItems } from './header';
import NasaLogoColor from './nasa-logo-color';
import { PageFooter } from '@lib';

export default function Footer() {
  return (
    <PageFooter
      mainNavItems={navItems}
      subNavItems={subNavItems}
      hideFooter={false}
      linkProperties={{ LinkElement: Link, pathAttributeKeyName: 'href' }}
      logoSvg={<NasaLogoColor />}
    />
  );
}
