# customer_manage_gdkn
# Step 1
Please make sure first you have install the following applications in your system:-
1. NodeJs (https://nodejs.org/en/download)
2. Angular(npm install -g @angular/cli)
3. Mysql (https://dev.mysql.com/downloads/installer/)
# Step 2
If all the above services are running then create a Database => `customer_manage_gdkn`

Then run this two sql statement to create necessery tables => 
db\customer_manage_gdkn_address.sql
db\customer_manage_gdkn_customer.sql

# Step 3
Modify the Mysql Server details in this page =>
apibackend\db.config.js
    {
        DB_HOST => Your Mysql Server Host
        DB_USER => Your Mysql Server username
        DB_PASSWORD => Your Mysql Server password
        DB_NAME: => 'customer_manage_gdkn' // Database name
    }

# step 4
Run all applications =>
apibackend / => npm run start
    ** This service will run on port 3000 => http://localhost:3000
webapp / => ng serve 
    ** This service will run on port 4200 => http://localhost:4200
    ## If you wish to run with another port then please whitelist your host
        => apibackend\app.js =>> Line No. 15 (res.header(`Access-Control-Allow-Origin`, `http://localhost:4200`))