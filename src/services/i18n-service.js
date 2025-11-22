/**
 * i18n Service - Loads locale files dynamically via fetch
 * Avoids polluting window global scope
 */

let cachedLocale = null;
let cachedTexts = null;

/**
 * Load locale texts from JSON file
 * @param {string} locale - Locale code (e.g., 'es', 'en')
 * @param {string} resourcesPath - Base path for resources (from Keycloak)
 * @returns {Promise<Object>} Locale texts
 */
export async function loadLocale(locale = 'es', resourcesPath = '') {
  // Return cached if already loaded
  if (cachedLocale === locale && cachedTexts) {
    return cachedTexts;
  }

  // Build the full path
  const basePath = resourcesPath || '/resources';
  const url = `${basePath}/i18n/${locale}.json`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to load locale ${locale}: ${response.status}`);
    }
    
    const texts = await response.json();
    
    // Cache the loaded locale
    cachedTexts = texts;
    cachedLocale = locale;
    
    return texts;
  } catch (error) {
    console.error(`Error loading locale ${locale}, falling back to 'es'`, error);
    
    // Fallback to Spanish if requested locale fails
    if (locale !== 'es') {
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
