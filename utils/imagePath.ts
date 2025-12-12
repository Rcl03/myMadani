/**
 * Helper function to get the correct image path for both local dev and GitHub Pages
 * Vite automatically handles base path, but we need to ensure it works correctly
 */
export function getImagePath(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Get base URL - Vite sets this at build time
  // For GitHub Pages: '/myMadani/' or '/mymadani/' (case-sensitive!)
  // For local dev: '/'
  const baseUrl = import.meta.env.BASE_URL || '/';
  
  // Ensure base URL ends with slash
  const base = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  
  return `${base}${cleanPath}`;
}

