const MongoClient = require('./connection');

//Insert ONE DOC into banking collection
const insertOne = async (client, dbName, collectionName, dataToInsert) => {
    try {
        console.log('Preparing for inserting document ⚙️');
        const dbo = await client.db(dbName).collection(collectionName);
        const result = await dbo.insertOne(dataToInsert);
        console.log(`Inserted document with id: ${result.insertedId}`);
    } catch (error) {
        console.error(`Error inserting document ${error}`);
    } finally {
        await client.close();
    }
}

//Insert MANY DOCS into banking collection
const insertMany = async (client, dbName, collectionName, dataToInsert) => {
    try {
        console.log('Preparing for inserting document ⚙️');
        const dbo = await client.db(dbName).collection(collectionName);
        const results = await dbo.insertMany(dataToInsert);
        console.log(`Inserted document(s): ${results.insertedCount}`);
        console.log(results);
    } catch (error) {
        console.error(`Error inserting documents ${error}`);
    } finally {
        await client.close();
    }
}

//data for insertOne method
const data = {
    accountHolder: "Toan Nguyen",
    accountId: "MTC" + Math.floor(Math.random() * 1000),
    accountTier: "Diamond",
    balance: Math.floor(Math.random() * 100000),
    last_updated: new Date(),
}
//data for insertMany method
const data2 = [
    {
        accountHolder: "Toan Nguyen",
        accountId: "MTC" + Math.floor(Math.random() * 1000),
        accountTier: "Diamond",
        balance: Math.floor(Math.random() * 100000),
        last_updated: new Date(),
    },
    {
        accountHolder: "Doan Nguyen",
        accountId: "MTC" + Math.floor(Math.random() * 1000),
        accountTier: "Gold",
        balance: Math.floor(Math.random() * 100000),
        last_updated: new Date(),
    }
]


const main = async () => {
    try {
        const dbName = "bank", collectionName = "accounts";
        // insertOne(MongoClient, dbName, collectionName, data);
        insertMany(MongoClient, dbName, collectionName, data2);
    } catch (error) {
        console.error(error);
    }
}

main();