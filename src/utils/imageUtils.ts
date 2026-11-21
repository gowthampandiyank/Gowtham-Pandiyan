
const imageModules = import.meta.glob(
  '../assets/images/*.{png,jpg,jpeg,webp,avif,gif,svg}',
  {
    eager: true,
    query: '?url',
    import: 'default',
  }
) as Record<string, string>;

export function resolvePortfolioImage(
  src?: string | null
): string {
  if (!src) return '';

  // Keep external and dynamic image URLs unchanged
  if (/^(https?:|data:|blob:)/i.test(src)) {
    return src;
  }

  // Resolve images stored inside src/assets/images
  const marker = 'src/assets/images/';

  if (src.includes(marker)) {
    const filename = src.split(marker).pop()?.split('?')[0];

    if (!filename) return '';

    const key = `../assets/images/${filename}`;

    return imageModules[key] || '';
  }

  // Resolve public folder images using Vite's base URL
  const cleanPath = src.replace(/^\/+/, '');

  return `${import.meta.env.BASE_URL}${cleanPath}`;
}
