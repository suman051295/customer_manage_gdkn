const dbConnection = require("./db");
const dbTable = require("./db.table");
const passwordHash = require('password-hash');
const Mail = require("./sendMailModel");
const CustomerExe = require("./customerModel");

class LoginExe {
    static login(req) {
        return new Promise((resolve, reject) => {
            let query = `SELECT * 
                            FROM ${dbTable.loginData} AS logindata
                            LEFT JOIN ${dbTable.customer} AS customer
                            ON logindata.customerId = customer.customerId
                            WHERE logindata.username=?`;
            dbConnection.query(query, [req.body.userName], async (err, rows) => {
                if (err) {
                    reject(JSON.stringify(err));
                } else {
                    if (rows.length > 0) {
                        if (passwordHash.verify(req.body.password, rows[0]['password'])) {
                            await this.sendLoginCode(rows[0]['customerId'], rows[0]['email']).then((code) => console.log("code", code));
                            resolve(rows);
                        } else {
                            reject("Password not matched");
                        }
                    } else {
                        reject("Username not found.");
                    }
                }
            })
        })
    }

    static sendLoginCode(customerIdValue, customerEmail) {
        return new Promise((resolve, reject) => {
            let insertLoginData = {
                customerId: customerIdValue,
                code: String(Math.floor(Math.random() * 100001)),
                createdDate: new Date()
            }
            let query = `INSERT INTO ${dbTable.loginCode} SET ?`;

            dbConnection.query(query, [insertLoginData], async (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    let body = `Your 2FA Code Is: ${insertLoginData.code}`;
                    await Mail.sendMail(customerEmail, "2FA Code", body);
                    resolve(insertLoginData.code);
                }
            })
        })
    }

    static loginWithCode(req) {
        return new Promise((resolve, reject) => {
            let query = `SELECT * 
                            FROM ${dbTable.loginCode} AS logincode
                            LEFT JOIN ${dbTable.loginData} AS logindata
                            ON logincode.customerId = logindata.customerId
                            WHERE logincode.customerId=? AND logincode.status=? ORDER BY logincode.id DESC LIMIT 0,1`;
            dbConnection.query(query, [req.body.requestedCustomerId, 'A'], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    if (rows[0]['code'] == req.body.logincode) {
                        resolve(rows);
                    } else {
                        reject("Wrong Login Code")
                    }

                }
            })
        })
    }

    static forgotPassword(req) {
        return new Promise((resolve, reject) => {
            let query = `SELECT * 
                            FROM ${dbTable.customer}
                            WHERE email=?`;
            dbConnection.query(query, [req.body.email], async (err, rows) => {
                if (err) {
                    reject(JSON.stringify(err));
                } else {
                    if (rows.length > 0) {
                        await this.sendLoginCode(rows[0]['customerId'], rows[0]['email']).then((code) => console.log("code", code));
                        resolve(rows);
                    } else {
                        reject("Email not found.");
                    }
                }
            })
        })
    }

    static resetPassword(req) {
        return new Promise((resolve, reject) => {
            let update = {
                password:passwordHash.generate(req.body.password)
            }
            let query = `UPDATE ${dbTable.customer}
                            SET ? WHERE customerId=?`;
            dbConnection.query(query, [update,req.body.customerId], async (err, rows) => {
                if (err) {
                    reject(JSON.stringify(err));
                } else {
                    resolve(rows);
                }
            })
        })
    }
}
module.exports = LoginExe;