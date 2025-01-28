import React from 'react';
import Link from 'next/link';
import { navItems, subNavItems } from './header';
import NasaLogoColor from './nasa-logo-color';
import { PageFooter } from '@lib';

export default function Footer() {
  const defaultFooterSettings = {
    secondarySection: {
      division: 'NASA EarthData 2024',
      version: 'BETA VERSION',
      title: 'NASA Official',
      name: 'Manil Maskey',
      to: 'test@example.com',
      type: 'email',
    },
    returnToTop: true,
  };
  return (
    <PageFooter
      mainNavItems={navItems}
      subNavItems={subNavItems}
      hideFooter={false}
      logoSvg={<NasaLogoColor />}
      linkProperties={{ LinkElement: Link, pathAttributeKeyName: 'href' }}
      footerSettings={defaultFooterSettings}
    />
  );
}
