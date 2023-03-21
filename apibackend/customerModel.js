const dbConnection = require("./db");
const dbTable = require("./db.table");
const passwordHash = require('password-hash');
/** Class for executing all DB related query */
class CustomerExe {
    /**
     * Get all customer
     * @param {*} req 
     * @returns Promise
     */
    static getAllCustomer(req) {
        return new Promise((resolve, reject) => {
            let numrows = 0;
            let query = `SELECT *
                            FROM ${dbTable.customer} AS customer
                            LEFT JOIN ${dbTable.address} AS address
                            ON customer.customerId = address.customerId `;
            let queryWithLimit = query;

            if (req.body.free_search_text && req.body.free_search_text != '') {
                queryWithLimit += ` WHERE customer.firstName LIKE '%${req.body.free_search_text}%'
                                        OR customer.lastName LIKE '%${req.body.free_search_text}%'
                                        OR customer.email LIKE '%${req.body.free_search_text}%'`;
            }
            queryWithLimit += ` ORDER BY customer.customerId ASC LIMIT ${req.body.startIndex},${req.body.pageSize}`;

            dbConnection.query(query, (err, allRows) => {
                numrows = allRows.length;
            })
            dbConnection.query(queryWithLimit, (err, rows) => {
                if (err) {
                    console.log(err)
                    reject(err);
                } else {
                    //console.log(rows)
                    rows.totalRecords = numrows;
                    resolve(rows);
                }
            });
        })
    }
    /**
     * Get customer details by customerId
     * @param {*} req 
     * @returns 
     */
    static getCustomerById(req) {
        return new Promise((resolve, reject) => {
            let query = `SELECT *
                            FROM ${dbTable.customer} AS customer 
                            LEFT JOIN ${dbTable.address} AS address
                            ON customer.customerId = address.customerId
                            WHERE customer.customerId =?`;
            dbConnection.query(query, [req.body.customerId], (err, rows) => {
                if (err) {
                    console.log(err)
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        })
    }
    /** Add a new customer */
    static addNewCustomer(req) {
        return new Promise((resolve, reject) => {

            let insertCustomerData = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                userName: req.body.userName,
                email: req.body.email,
                phone: req.body.phone,
                dob: req.body.dob,
                gender: req.body.gender,
                password: passwordHash.generate(req.body.password),
                image: photoNewName,
                createdDate: new Date(),
            }

            let query = `INSERT INTO ${dbTable.customer} SET ?`;
            dbConnection.query(query, insertCustomerData, async (err, rows) => {
                if (err) {
                    console.log(err)
                    reject(err);
                } else {
                    console.log(rows)
                    /** Add address of this customer */
                    await this.addNewCustomerAddress(req, rows['insertId']).then(() => {
                        resolve(rows);
                    }).catch((err) => {
                        reject(err);
                    })

                }
            });
        })
    }
    /**
     * Add customer address
     * @param {*} req 
     * @param {*} customerIdValue 
     * @returns 
     */
    static addNewCustomerAddress(req, customerIdValue) {
        return new Promise((resolve, reject) => {
            let insertAddressData = {
                customerId: customerIdValue,
                address: req.body.address,
                landmark: req.body.landmark,
                city: req.body.city,
                state: req.body.state,
                country: req.body.country,
                zipcode: req.body.zipcode
            }
            let query = `INSERT INTO ${dbTable.address} SET ?`;
            dbConnection.query(query, insertAddressData, (err, rows) => {
                if (err) {
                    console.log(err)
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        })
    }
    /**
     * Update a customer
     * @param {*} req 
     * @returns 
     */
    static updateCustomer(req) {
        return new Promise((resolve, reject) => {
            let insertCustomerData = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                userName: req.body.userName,
                email: req.body.email,
                phone: req.body.phone,
                dob: req.body.dob,
                gender: req.body.gender,
                password: passwordHash.generate(req.body.password),
                createdDate: new Date()
            }

            let query = `UPDATE ${dbTable.customer} SET ? WHERE customerId=?`;
            dbConnection.query(query, [insertCustomerData, req.body.customerId], async (err, rows) => {
                if (err) {
                    console.log(err)
                    reject(err);
                } else {
                    await this.updateCustomerAddress(req, req.body.customerId);
                    resolve(rows);
                }
            });
        })
    }
    /**
     * Update customer address
     * @param {*} req 
     * @param {*} customerIdValue 
     * @returns 
     */
    static updateCustomerAddress(req, customerIdValue) {
        return new Promise((resolve, reject) => {
            let insertAddressData = {
                address: req.body.address,
                landmark: req.body.landmark,
                city: req.body.city,
                state: req.body.state,
                country: req.body.country,
                zipcode: req.body.zipcode
            }
            let query = `UPDATE ${dbTable.address} SET ? WHERE customerId=?`;
            dbConnection.query(query, [insertAddressData, customerIdValue], (err, rows) => {
                if (err) {
                    console.log(err)
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        })
    }
    /**
     * Delete a customer
     * @param {*} req 
     * @returns 
     */
    static deleteCustomer(req) {
        return new Promise((resolve, reject) => {

            let query = `DELETE FROM ${dbTable.customer} WHERE customerId=?`;
            let addressQuery = `DELETE FROM ${dbTable.address} WHERE customerId=?`;
            dbConnection.query(query, [req.body.customerId], async (err, rows) => {
                if (err) {
                    console.log(err)
                    reject(err);
                } else {
                    await dbConnection.query(addressQuery, [req.body.customerId]);
                    resolve(rows);
                }
            });
        })
    }
    /**
     * Upload a customer image
     * @param {*} customerId 
     * @param {*} filename 
     * @returns 
     */
    static updateCustomerImage(customerId, filename) {
        return new Promise((resolve, reject) => {
            let insertCustomerData = {
                image: filename
            }
            let query = `UPDATE ${dbTable.customer} SET ? WHERE customerId=?`;
            dbConnection.query(query, [insertCustomerData, customerId], async (err, rows) => {
                if (err) {
                    console.log(err)
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        })
    }
}

module.exports = CustomerExe;