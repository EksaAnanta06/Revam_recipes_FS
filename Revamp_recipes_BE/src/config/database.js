/**
 * src/config/database.js
 *
 * Konfigurasi MySQL connection pool.
 *
 * Tanggung jawab:
 * - Membuat dan mengekspor satu instance pool yang dipakai seluruh aplikasi
 * - Menyediakan fungsi testConnection() untuk verifikasi koneksi saat startup
 *
 * Tidak melakukan env.config() sendiri — dotenv sudah dimuat di server.js
 * sebelum module ini diimport.
 */

import mysql from "mysql2/promise";
import env from "./env.js";

const db = mysql.createPool({
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASS,
    database: env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

/**
 * Menguji koneksi ke database saat startup.
 * Jika gagal, proses akan exit agar server tidak berjalan tanpa DB.
 */
export async function testConnection() {
    const conn = await db.getConnection();
    console.log("[Database] MySQL berhasil terkoneksi!");
    conn.release();
}

export default db;
