/**
 * src/constants/index.js
 *
 * Central constants untuk seluruh aplikasi frontend.
 *
 * Sebelum refactor: BASE_URL berada di utils/constants.jsx bersama
 * validateEmail — dua tanggung jawab berbeda dalam satu file.
 *
 * Sekarang:
 * - Konstanta aplikasi → src/constants/index.js  (file ini)
 * - Utility functions  → src/utils/validators.js  (terpisah)
 */

// URL base API backend — ganti dengan env variable saat deploy production
export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3100";
