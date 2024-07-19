const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
const port = 3012; // Adjusted port number if needed

app.use(cors());
app.use(express.json());

// MSSQL configuration
const config = {
    server: 'localhost\\SQLEXPRESS', // Adjust server name if necessary
    database: 'WebApp',
    driver: 'msnodesqlv8',
    options: {
        trustServerCertificate: true,
        trustedConnection: true,
        enableArithAbort: true,
        integratedSecurity: true, // Use integrated security (Windows Authentication)
    },
};

// Connect to the database
sql.connect(config).then(pool => {
    if (pool.connected) {
        console.log('Connected to MSSQL');
    }

    // CRUD operations for Lookups table

    // GET all lookups
    app.get('/lookups', async (req, res) => {
        try {
            const result = await pool.request().query('SELECT * FROM Lookups');
            res.json(result.recordset);
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // POST a new lookup
    app.post('/lookups', async (req, res) => {
        const { Lookup_Code, Lookup_Type, Lookup_Desc, Is_Active } = req.body;
        console.log('Received request to add lookup:', req.body); // Log request body for debugging
        try {
            const result = await pool.request()
                .input('Lookup_Code', sql.Int, Lookup_Code)
                .input('Lookup_Type', sql.VarChar(20), Lookup_Type)
                .input('Lookup_Desc', sql.VarChar(20), Lookup_Desc)
                .input('Is_Active', sql.VarChar(10), Is_Active)
                .query('INSERT INTO Lookups (Lookup_Code, Lookup_Type, Lookup_Desc, Is_Active) VALUES (@Lookup_Code, @Lookup_Type, @Lookup_Desc, @Is_Active); SELECT SCOPE_IDENTITY() AS Lookup_Id;');
            const newLookupId = result.recordset[0].Lookup_Id;
            const newLookup = { Lookup_Id: newLookupId, Lookup_Code, Lookup_Type, Lookup_Desc, Is_Active };
            console.log('Lookup added successfully'); // Log success message
            res.status(201).send(newLookup);
        } catch (err) {
            console.error('Error adding lookup:', err); // Log detailed error message
            res.status(500).send(err.message);
        }
    });

    // PUT (update) a lookup by ID
    app.put('/lookups/:id', async (req, res) => {
        const { id } = req.params;
        const { Lookup_Code, Lookup_Type, Lookup_Desc, Is_Active } = req.body;
        try {
            await pool.request()
                .input('Lookup_Id', sql.Int, id)
                .input('Lookup_Code', sql.Int, Lookup_Code)
                .input('Lookup_Type', sql.VarChar(20), Lookup_Type)
                .input('Lookup_Desc', sql.VarChar(20), Lookup_Desc)
                .input('Is_Active', sql.VarChar(10), Is_Active)
                .query('UPDATE Lookups SET Lookup_Code = @Lookup_Code, Lookup_Type = @Lookup_Type, Lookup_Desc = @Lookup_Desc, Is_Active = @Is_Active WHERE Lookup_Id = @Lookup_Id');
            res.send('Lookup updated');
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // DELETE a lookup by ID
    app.delete('/lookups/:id', async (req, res) => {
        const { id } = req.params;
        try {
            await pool.request()
                .input('Lookup_Id', sql.Int, id)
                .query('DELETE FROM Lookups WHERE Lookup_Id = @Lookup_Id');
            res.send('Lookup deleted');
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // CRUD operations for Account_table

    // GET all accounts
    app.get('/accounts', async (req, res) => {
        try {
            const result = await pool.request().query('SELECT * FROM Account_table');
            res.json(result.recordset);
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // POST a new account
    app.post('/accounts', async (req, res) => {
        const { AccountNumber, AccountStatus_id } = req.body;
        console.log('Received request to add account:', req.body); // Log request body for debugging
        try {
            const result = await pool.request()
                .input('AccountNumber', sql.VarChar(50), AccountNumber)
                .input('AccountStatus_id', sql.Int, AccountStatus_id)
                .query('INSERT INTO Account_table (AccountNumber, AccountStatus_id) VALUES (@AccountNumber, @AccountStatus_id); SELECT SCOPE_IDENTITY() AS AccId;');
            const newAccountId = result.recordset[0].AccId;
            const newAccount = { AccId: newAccountId, AccountNumber, AccountStatus_id };
            console.log('Account added successfully'); // Log success message
            res.status(201).send(newAccount);
        } catch (err) {
            console.error('Error adding account:', err); // Log detailed error message
            res.status(500).send(err.message);
        }
    });

    // PUT (update) an account by ID
    app.put('/accounts/:id', async (req, res) => {
        const { id } = req.params;
        const { AccountNumber, AccountStatus_id } = req.body;
        try {
            await pool.request()
                .input('AccId', sql.Int, id)
                .input('AccountNumber', sql.VarChar(50), AccountNumber)
                .input('AccountStatus_id', sql.Int, AccountStatus_id)
                .query('UPDATE Account_table SET AccountNumber = @AccountNumber, AccountStatus_id = @AccountStatus_id WHERE AccId = @AccId');
            res.send('Account updated');
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // DELETE an account by ID
    app.delete('/accounts/:id', async (req, res) => {
        const { id } = req.params;
        try {
            await pool.request()
                .input('AccId', sql.Int, id)
                .query('DELETE FROM Account_table WHERE AccId = @AccId');
            res.send('Account deleted');
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // CRUD operations for Address_table

    // GET all addresses
    app.get('/addresses', async (req, res) => {
        try {
            const result = await pool.request().query('SELECT * FROM Address_table');
            res.json(result.recordset);
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // POST a new address
    app.post('/addresses', async (req, res) => {
        const { AccountID, AddressTypeID, Address } = req.body;
        console.log('Received request to add address:', req.body); // Log request body for debugging
        try {
            const result = await pool.request()
                .input('AccountID', sql.Int, AccountID)
                .input('AddressTypeID', sql.Int, AddressTypeID)
                .input('Address', sql.VarChar(255), Address)
                .query('INSERT INTO Address_table (AccountID, AddressTypeID, Address) VALUES (@AccountID, @AddressTypeID, @Address); SELECT SCOPE_IDENTITY() AS AddressID;');
            const newAddressId = result.recordset[0].AddressID;
            const newAddress = { AddressID: newAddressId, AccountID, AddressTypeID, Address };
            console.log('Address added successfully'); // Log success message
            res.status(201).send(newAddress);
        } catch (err) {
            console.error('Error adding address:', err); // Log detailed error message
            res.status(500).send(err.message);
        }
    });

    // PUT (update) an address by ID
    app.put('/addresses/:id', async (req, res) => {
        const { id } = req.params;
        const { AccountID, AddressTypeID, Address } = req.body;
        try {
            await pool.request()
                .input('AddressID', sql.Int, id)
                .input('AccountID', sql.Int, AccountID)
                .input('AddressTypeID', sql.Int, AddressTypeID)
                .input('Address', sql.VarChar(255), Address)
                .query('UPDATE Address_table SET AccountID = @AccountID, AddressTypeID = @AddressTypeID, Address = @Address WHERE AddressID = @AddressID');
            res.send('Address updated');
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // DELETE an address by ID
    app.delete('/addresses/:id', async (req, res) => {
        const { id } = req.params;
        try {
            await pool.request()
                .input('AddressID', sql.Int, id)
                .query('DELETE FROM Address_table WHERE AddressID = @AddressID');
            res.send('Address deleted');
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // CRUD operations for Account_holder_table

    // GET all account holders
    app.get('/account_holders', async (req, res) => {
        try {
            const result = await pool.request().query('SELECT * FROM Account_holder_table');
            res.json(result.recordset);
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // POST a new account holder
    app.post('/account_holders', async (req, res) => {
        const { AccNUM, AccTypeID, Acc_holders_N, AC_Balance, CD } = req.body;
        console.log('Received request to add account holder:', req.body); // Log request body for debugging
        try {
            const result = await pool.request()
                .input('AccNUM', sql.VarChar(20), AccNUM)
                .input('AccTypeID', sql.Int, AccTypeID)
                .input('Acc_holders_N', sql.VarChar(255), Acc_holders_N)
                .input('AC_Balance', sql.Decimal(10, 2), AC_Balance)
                .input('CD', sql.Date, CD)
                .query('INSERT INTO Account_holder_table (AccNUM, AccTypeID, Acc_holders_N, AC_Balance, CD) VALUES (@AccNUM, @AccTypeID, @Acc_holders_N, @AC_Balance, @CD); SELECT SCOPE_IDENTITY() AS AccHID;');
            const newAccountHolderId = result.recordset[0].AccHID;
            const newAccountHolder = { AccHID: newAccountHolderId, AccNUM, AccTypeID, Acc_holders_N, AC_Balance, CD };
            console.log('Account holder added successfully'); // Log success message
            res.status(201).send(newAccountHolder);
        } catch (err) {
            console.error('Error adding account holder:', err); // Log detailed error message
            res.status(500).send(err.message);
        }
    });

    // PUT (update) an account holder by ID
    app.put('/account_holders/:id', async (req, res) => {
        const { id } = req.params;
        const { AccNUM, AccTypeID, Acc_holders_N, AC_Balance, CD } = req.body;
        try {
            await pool.request()
                .input('AccHID', sql.Int, id)
                .input('AccNUM', sql.VarChar(20), AccNUM)
                .input('AccTypeID', sql.Int, AccTypeID)
                .input('Acc_holders_N', sql.VarChar(255), Acc_holders_N)
                .input('AC_Balance', sql.Decimal(10, 2), AC_Balance)
                .input('CD', sql.Date, CD)
                .query('UPDATE Account_holder_table SET AccNUM = @AccNUM, AccTypeID = @AccTypeID, Acc_holders_N = @Acc_holders_N, AC_Balance = @AC_Balance, CD = @CD WHERE AccHID = @AccHID');
            res.send('Account holder updated');
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // DELETE an account holder by ID
    app.delete('/account_holders/:id', async (req, res) => {
        const { id } = req.params;
        try {
            await pool.request()
                .input('AccHID', sql.Int, id)
                .query('DELETE FROM Account_holder_table WHERE AccHID = @AccHID');
            res.send('Account holder deleted');
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // CRUD operations for Transaction_Table

    // GET all transactions
    app.get('/transactions', async (req, res) => {
        try {
            const result = await pool.request().query('SELECT * FROM Transaction_Table');
            res.json(result.recordset);
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // POST a new transaction
    app.post('/transactions', async (req, res) => {
        const { AccountID, TransTypeID, Amount, Date, Transaction_type } = req.body;
        console.log('Received request to add transaction:', req.body); // Log request body for debugging
        try {
            const result = await pool.request()
                .input('AccountID', sql.Int, AccountID)
                .input('TransTypeID', sql.Int, TransTypeID)
                .input('Amount', sql.Decimal(10, 2), Amount)
                .input('Date', sql.Date, Date)
                .input('Transaction_type', sql.VarChar(10), Transaction_type)
                .query('INSERT INTO Transaction_Table (AccountID, TransTypeID, Amount, Date, Transaction_type) VALUES (@AccountID, @TransTypeID, @Amount, @Date, @Transaction_type); SELECT SCOPE_IDENTITY() AS TransID;');
            const newTransactionId = result.recordset[0].TransID;
            const newTransaction = { TransID: newTransactionId, AccountID, TransTypeID, Amount, Date, Transaction_type };
            console.log('Transaction added successfully'); // Log success message
            res.status(201).send(newTransaction);
        } catch (err) {
            console.error('Error adding transaction:', err); // Log detailed error message
            res.status(500).send(err.message);
        }
    });

    // PUT (update) a transaction by ID
    app.put('/transactions/:id', async (req, res) => {
        const { id } = req.params;
        const { AccountID, TransTypeID, Amount, Date, Transaction_type } = req.body;
        try {
            await pool.request()
                .input('TransID', sql.Int, id)
                .input('AccountID', sql.Int, AccountID)
                .input('TransTypeID', sql.Int, TransTypeID)
                .input('Amount', sql.Decimal(10, 2), Amount)
                .input('Date', sql.Date, Date)
                .input('Transaction_type', sql.VarChar(10), Transaction_type)
                .query('UPDATE Transaction_Table SET AccountID = @AccountID, TransTypeID = @TransTypeID, Amount = @Amount, Date = @Date, Transaction_type = @Transaction_type WHERE TransID = @TransID');
            res.send('Transaction updated');
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // DELETE a transaction by ID
    app.delete('/transactions/:id', async (req, res) => {
        const { id } = req.params;
        try {
            await pool.request()
                .input('TransID', sql.Int, id)
                .query('DELETE FROM Transaction_Table WHERE TransID = @TransID');
            res.send('Transaction deleted');
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

}).catch(err => {
    console.error('Database connection failed:', err);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
