/**
 * Platform Logos - Logos oficiais das plataformas em SVG
 * Qualidade: Ultra Premium AAA
 */

import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

export const WhatsAppLogo: React.FC<LogoProps> = ({ size = 32, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="whatsapp-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#5BD066" />
        <stop offset="100%" stopColor="#27B43E" />
      </linearGradient>
    </defs>
    <path
      fill="url(#whatsapp-gradient)"
      d="M16.004 0C7.168 0 0 7.168 0 16c0 2.816.73 5.504 2.112 7.904L0 32l8.352-2.176c2.304 1.248 4.928 1.952 7.68 1.952 8.832 0 16-7.168 16-16S24.832 0 16.004 0z"
    />
    <path
      fill="#fff"
      d="M16 5.6c-5.76 0-10.4 4.64-10.4 10.4 0 1.984.576 3.872 1.632 5.504L6.08 26.08l4.736-1.12c1.568.896 3.36 1.408 5.184 1.408 5.76 0 10.4-4.64 10.4-10.4S21.76 5.6 16 5.6zm0 18.72c-1.664 0-3.264-.448-4.672-1.28l-.32-.192-3.36.8.832-3.264-.224-.352C7.36 18.816 6.848 17.44 6.848 16c0-5.056 4.096-9.152 9.152-9.152S25.152 10.944 25.152 16 21.056 24.32 16 24.32z"
    />
    <path
      fill="#fff"
      d="M20.8 18.4c-.288-.16-1.696-.832-1.952-.928-.256-.096-.448-.128-.64.128-.192.288-.736.928-.896 1.12-.16.192-.32.224-.608.064-.288-.128-1.216-.448-2.304-1.408-.864-.768-1.408-1.696-1.568-1.984-.16-.288-.032-.448.128-.576.128-.128.288-.32.416-.48.128-.16.192-.288.288-.48.096-.192.032-.352-.032-.512-.064-.128-.64-1.536-.864-2.112-.224-.544-.448-.48-.64-.48h-.544c-.192 0-.48.064-.736.352-.256.288-.992.96-.992 2.336 0 1.376 1.024 2.72 1.152 2.912.128.192 2.016 3.072 4.864 4.32.672.288 1.216.448 1.664.576.704.224 1.344.192 1.856.128.576-.096 1.696-.704 1.952-1.376.256-.672.256-1.216.16-1.376-.064-.128-.256-.192-.544-.32z"
    />
  </svg>
);

export const InstagramLogo: React.FC<LogoProps> = ({ size = 32, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <radialGradient id="instagram-gradient" cx="30%" cy="107%" r="150%">
        <stop offset="0%" stopColor="#FDCB5C" />
        <stop offset="15%" stopColor="#FDCB5C" />
        <stop offset="30%" stopColor="#FD8444" />
        <stop offset="50%" stopColor="#EF4B75" />
        <stop offset="70%" stopColor="#D22A8E" />
        <stop offset="90%" stopColor="#8E3ABF" />
        <stop offset="100%" stopColor="#5851D6" />
      </radialGradient>
    </defs>
    <rect width="32" height="32" rx="8" fill="url(#instagram-gradient)" />
    <path
      fill="#fff"
      d="M16 9.6c2.08 0 2.336.008 3.152.048.768.032 1.184.16 1.464.272.368.144.632.312.904.592.28.28.448.536.592.904.104.28.24.696.272 1.464.04.824.048 1.072.048 3.152s-.008 2.336-.048 3.152c-.032.768-.16 1.184-.272 1.464a2.42 2.42 0 01-.592.904 2.42 2.42 0 01-.904.592c-.28.104-.696.24-1.464.272-.824.04-1.072.048-3.152.048s-2.336-.008-3.152-.048c-.768-.032-1.184-.16-1.464-.272a2.42 2.42 0 01-.904-.592 2.42 2.42 0 01-.592-.904c-.104-.28-.24-.696-.272-1.464-.04-.824-.048-1.072-.048-3.152s.008-2.336.048-3.152c.032-.768.16-1.184.272-1.464.144-.368.312-.632.592-.904.28-.28.536-.448.904-.592.28-.104.696-.24 1.464-.272.816-.04 1.072-.048 3.152-.048zm0-1.4c-2.112 0-2.384.008-3.216.048-.832.04-1.4.176-1.896.368-.52.208-.96.472-1.4.92-.44.44-.712.88-.92 1.4-.192.496-.328 1.064-.368 1.896-.04.832-.048 1.104-.048 3.216s.008 2.384.048 3.216c.04.832.176 1.4.368 1.896.208.52.472.96.92 1.4.44.44.88.712 1.4.92.496.192 1.064.328 1.896.368.832.04 1.104.048 3.216.048s2.384-.008 3.216-.048c.832-.04 1.4-.176 1.896-.368a3.77 3.77 0 001.4-.92c.44-.44.712-.88.92-1.4.192-.496.328-1.064.368-1.896.04-.832.048-1.104.048-3.216s-.008-2.384-.048-3.216c-.04-.832-.176-1.4-.368-1.896a3.77 3.77 0 00-.92-1.4 3.77 3.77 0 00-1.4-.92c-.496-.192-1.064-.328-1.896-.368-.832-.04-1.104-.048-3.216-.048z"
    />
    <path
      fill="#fff"
      d="M16 11.896a4.104 4.104 0 100 8.208 4.104 4.104 0 000-8.208zm0 6.77a2.666 2.666 0 110-5.332 2.666 2.666 0 010 5.332z"
    />
    <circle fill="#fff" cx="20.264" cy="11.736" r=".96" />
  </svg>
);

export const TelegramLogo: React.FC<LogoProps> = ({ size = 32, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="telegram-gradient" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor="#2AABEE" />
        <stop offset="100%" stopColor="#229ED9" />
      </linearGradient>
    </defs>
    <circle cx="16" cy="16" r="16" fill="url(#telegram-gradient)" />
    <path
      fill="#fff"
      d="M7.24 15.744l15.232-5.872c.704-.256 1.328.176 1.104 1.24l-2.592 12.216c-.192.864-.704 1.072-1.432.664l-3.96-2.92-1.912 1.84c-.208.216-.392.392-.792.392l.28-4.016 7.304-6.6c.32-.28-.064-.44-.488-.16l-9.016 5.68-3.896-1.216c-.84-.264-.864-.84.184-1.248z"
    />
  </svg>
);

export const GmailLogo: React.FC<LogoProps> = ({ size = 32, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="32" height="32" rx="8" fill="#fff" />
    <path
      fill="#4285F4"
      d="M6 10l10 7.5L26 10v12a2 2 0 01-2 2h-3V14.5l-5 3.75L11 14.5V24H8a2 2 0 01-2-2V10z"
    />
    <path
      fill="#34A853"
      d="M6 10v12a2 2 0 002 2h3V14.5L6 10z"
    />
    <path
      fill="#FBBC04"
      d="M21 24h3a2 2 0 002-2V10l-5 4.5V24z"
    />
    <path
      fill="#EA4335"
      d="M6 10l5 4.5 5 3.75 5-3.75L26 10v-.5a2 2 0 00-3.2-1.6L16 13.5 9.2 7.9A2 2 0 006 9.5V10z"
    />
    <path
      fill="#C5221F"
      d="M26 10v-.5a2 2 0 00-3.2-1.6L16 13.5v4.75l5-3.75L26 10z"
    />
  </svg>
);

export const FacebookMessengerLogo: React.FC<LogoProps> = ({ size = 32, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <radialGradient id="messenger-gradient" cx="19%" cy="99%" r="108%">
        <stop offset="0%" stopColor="#0099FF" />
        <stop offset="60%" stopColor="#A033FF" />
        <stop offset="90%" stopColor="#FF5280" />
        <stop offset="100%" stopColor="#FF7061" />
      </radialGradient>
    </defs>
    <path
      fill="url(#messenger-gradient)"
      d="M16 0C7.04 0 0 6.56 0 15.2c0 4.512 1.92 8.416 5.04 11.12V32l4.624-2.528c1.232.336 2.528.528 3.888.592a17.08 17.08 0 002.448 0c8.96 0 16-6.56 16-14.816S24.96 0 16 0z"
    />
    <path
      fill="#fff"
      d="M6.4 20L11.136 12.48l4.768 3.568 4.48-3.568 4.416 3.568-4.16 3.952-4.736-3.568-4.544 3.568z"
    />
  </svg>
);

// Helper para renderizar o logo correto baseado na plataforma
export const PlatformLogo: React.FC<{ platform: string; size?: number }> = ({ platform, size = 32 }) => {
  switch (platform) {
    case 'whatsapp':
      return <WhatsAppLogo size={size} />;
    case 'instagram':
      return <InstagramLogo size={size} />;
    case 'telegram':
      return <TelegramLogo size={size} />;
    case 'email':
      return <GmailLogo size={size} />;
    case 'facebook_messenger':
      return <FacebookMessengerLogo size={size} />;
    default:
      return null;
  }
};
