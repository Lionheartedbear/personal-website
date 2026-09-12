import card from '../content/event-time-volatility/project-card.json';

export interface Project {
  number: string;
  category: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  githubUrl: string | null;
  tags: string[];
  heroAsset: string;
  primaryCta: string;
}

export const eventTimeVolatility: Project = {
  number: '01',
  category: card.eyebrow,
  title: card.title,
  subtitle: card.subtitle,
  description: card.description,
  href: `/projects/${card.slug}`,
  githubUrl: card.github_url,
  tags: card.tags,
  heroAsset: `/projects/${card.slug}/${card.hero_asset.replace(/^assets\//, '')}`,
  primaryCta: card.primary_cta,
};

export const projects: Project[] = [eventTimeVolatility];
