/**
 * src/constants/index.js
 *
 * Barrel file — re-export semua constants dari satu tempat.
 *
 * Manfaat: cukup satu import di file yang butuh banyak konstanta:
 *   import { HTTP, AUTH } from '../constants/index.js';
 *
 * Daripada dua import terpisah:
 *   import HTTP from '../constants/http.js';
 *   import AUTH from '../constants/auth.js';
 */

export { default as HTTP } from "./http.js";
export { default as AUTH } from "./auth.js";
