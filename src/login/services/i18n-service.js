/**
 * i18n Service - Loads locale files dynamically via fetch
 * Avoids polluting window global scope
 */

let cachedLocale = null;
let cachedTexts = null;

const SUPPORTED_LOCALES = ['es', 'en'];

/**
 * Load locale texts from JSON file
 * @param {string} locale - Locale code (e.g., 'es', 'en')
 * @param {string} resourcesPath - Base path for resources (from Keycloak)
 * @returns {Promise<Object>} Locale texts
 */
export async function loadLocale(locale = 'es', resourcesPath = '') {
  // Validate against supported locales whitelist to prevent path traversal or unexpected input
  const normalized = (locale || 'es').substring(0, 2).toLowerCase();
  const safeLocale = SUPPORTED_LOCALES.includes(normalized) ? normalized : 'es';

  // Return cached if already loaded
  if (cachedLocale === safeLocale && cachedTexts) {
    return cachedTexts;
  }

  // Build the full path
  const basePath = resourcesPath || '/resources';
  const url = `${basePath}/i18n/${safeLocale}.json`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to load locale ${safeLocale}: ${response.status}`);
    }
    
    const texts = await response.json();
    
    // Cache the loaded locale
    cachedTexts = texts;
    cachedLocale = safeLocale;
    
    return texts;
  } catch (error) {
    console.error(`Error loading locale ${safeLocale}, falling back to 'es'`, error);
    
    // Fallback to Spanish if requested locale fails
    if (safeLocale !== 'es') {
      const basePath = resourcesPath || '/resources';
      const fallbackResponse = await fetch(`${basePath}/i18n/es.json`);
      return await fallbackResponse.json();
    }
    
    // If even Spanish fails, return empty structure
    return { pages: {} };
  }
}

/**
 * Clear cached locale (useful for testing or manual locale switching)
 */
export function clearCache() {
  cachedLocale = null;
  cachedTexts = null;
}
