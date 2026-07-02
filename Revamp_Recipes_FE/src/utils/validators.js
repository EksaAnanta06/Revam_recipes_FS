/**
 * src/utils/validators.js
 *
 * Utility functions untuk validasi input di sisi frontend.
 *
 * Dipindah dari utils/constants.jsx — nama file sebelumnya menyesatkan
 * karena mencampur "konstanta" dengan "fungsi utility".
 */

/**
 * Validasi format email menggunakan regex standar.
 * @param {string} email
 * @returns {RegExpMatchArray | null} — null jika tidak valid
 */
export const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};
