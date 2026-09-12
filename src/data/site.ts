// Add the real PDF at this path, then set the Resume entry's available flag.
// Keep its destination configured while avoiding a broken public link.
export const RESUME_HREF = '/resume/Wangdong-Jia-Resume.pdf';
export const PROFILE_LINKS: { label: string; href: string; available?: boolean }[] = [
  { label: 'Resume', href: RESUME_HREF, available: false },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/wangdong-jia' },
];

export const EMAIL: string | null = null;

// Replace the portrait by overwriting this stable public asset path.
export const PORTRAIT: { src: string | null; alt: string; width: number; height: number } = {
  src: '/images/portrait.jpg',
  alt: 'Portrait of Wangdong Jia',
  width: 3024,
  height: 4032,
};
