/** Import DB Configuration Data */
var DB_CONFIG = require("./db.config");
var mysql = require("mysql");

/** Create MySql Connection */
let connection = mysql.createConnection({
    host: DB_CONFIG.DB_HOST,
    user: DB_CONFIG.DB_USER,
    password: DB_CONFIG.DB_PASSWORD,
    database: DB_CONFIG.DB_NAME,
    multipleStatements: true
});

/** Checking MySql connection  */
connection.connect((err) => {
    if (err) {
        console.log("DB connection failed. Due to => ",JSON.stringify(err));
        return;
    }
    console.log('DB connected!');
})

/** Export connection */
module.exports = connection;