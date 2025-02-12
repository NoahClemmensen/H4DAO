const mysql = require('mysql2/promise');

console.log(process.env.DB_HOST);

let userConf = {
    socketPath: process.env.DB_SOCKET,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
}

let userConn = mysql.createConnection(userConf);

class Database {
    static async getDeliveries() {
        return this.query('SELECT * FROM delivery_view');
    }

    static async getPendingPackages() {
        return this.query('SELECT * FROM pending_packages');
    }

    static async markPackageDelivered(packageId) {
        return this.queryProcedure('delivery_status_delivered(?)', [packageId]);
    }

    static async query(sql, args) {
        if (userConn instanceof Promise) {
            userConn = await userConn;
        }

        const [results, fields] = await userConn.query(sql, args);
        return results;
    }

    static async queryProcedure(sql, args) {
        if (userConn instanceof Promise) {
            userConn = await userConn;
        }

        const [results, fields] = await userConn.query('call ' + sql, args);
        return results;
    }
}

module.exports = Database;