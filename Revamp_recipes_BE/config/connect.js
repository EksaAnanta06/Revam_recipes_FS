import mysql from "mysql2/promise";
import env from "dotenv";

env.config()

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export async function testConnections() {
    try {
        const connect = await db.getConnection()
        console.log("MySQL database berhasil terkoneksi!");
        connect.release()
    } catch(err) {
        console.log("Error, gagal koneksi ke databse: ", err)
    }
}


export default db