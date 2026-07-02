/**
 * src/constants/http.js
 *
 * HTTP Status Codes — menggantikan angka magic (400, 401, 500, dst)
 * dengan nama yang bermakna dan mudah dibaca.
 *
 * Manfaat:
 * - Kode lebih ekspresif: res.status(HTTP.OK) vs res.status(200)
 * - Jika standar berubah, cukup ubah di satu tempat
 * - IDE memberikan autocomplete dan dokumentasi inline
 */

const HTTP = Object.freeze({
    // ─── 2xx Success ──────────────────────────────────────────────────────────
    OK: 200,
    CREATED: 201,

    // ─── 4xx Client Error ─────────────────────────────────────────────────────
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,

    // ─── 5xx Server Error ─────────────────────────────────────────────────────
    INTERNAL_SERVER_ERROR: 500,
});

export default HTTP;
