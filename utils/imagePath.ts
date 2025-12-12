/**
 * Helper function to get the correct image path for both local dev and GitHub Pages
 * Vite automatically handles base path, but we need to ensure it works correctly
 */
export function getImagePath(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  // Vite's import.meta.env.BASE_URL already includes the trailing slash
  // For GitHub Pages it will be '/myMadani/', for local dev it will be '/'
  return `${import.meta.env.BASE_URL}${cleanPath}`;
}

