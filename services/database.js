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

    static async getSenders() {
        return this.query('SELECT * FROM sender where deleted = 0');
    }

    static async getShops() {
        return this.query('SELECT * FROM shop where deleted = 0');
    }

    static async markDeliveryDelivered(packageId) {
        return this.queryProcedure('delivery_status_delivered(?)', [packageId]);
    }

    static async markDeliveryCanceled(packageId) {
        return this.queryProcedure('delivery_status_canceled(?)', [packageId]);
    }

    static async deleteSender(senderId) {
        return this.queryProcedure('delete_sender(?)', [senderId]);
    }

    static async deleteShop(shopId) {
        return this.queryProcedure('delete_shop(?)', [shopId]);
    }

    static async createDelivery(shopId, senderId) {
        return this.queryProcedure('create_delivery(?,?)', [shopId, senderId]);
    }

    static async createSender(name, address, zip, phone, email) {
        return this.queryProcedure('create_sender(?,?,?,?,?)', [name, address, zip, phone, email]);
    }

    static async createShop(name, address, zip, phone, email, lat, lng) {
        return this.queryProcedure('create_shop(?,?,?,?,?,?,?)', [name, address, zip, phone, email, lat, lng]);
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