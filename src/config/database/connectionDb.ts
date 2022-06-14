import mysql from "mysql2";

const DATABASE_HOST = process.env.DATABASE_HOST;
const DATABASE_USER = process.env.DATABASE_USER;
const DATABASE_PASS = process.env.DATABASE_PASS;
const DATABASE_NAME = process.env.DATABASE_NAME;

export const connection = mysql.createPool({
    host: DATABASE_HOST,
    user: DATABASE_USER,
    password: DATABASE_PASS,
    database: DATABASE_NAME,
});

connection.getConnection((err: any, conn: any) => {
    if (err) console.log(err);

    if (conn) {
        console.log("Whatsapp database is connected!");
        conn.release();
    }
});
