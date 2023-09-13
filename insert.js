const MongoClient = require('./connection');

//Insert doc into banking collection
const insertOne = async (client, dataToInsert) => {
    try {
        console.log('Preparing for inserting document ⚙️');
        const dbo = await client.db('sample_airbnb').collection('banking');
        const result = await dbo.insertOne(dataToInsert);
        console.log(`Inserted document with id: ${result.insertedId}`);
    } catch (error) {
        console.error(`Error inserting document ${error}`);
    } finally {
        await client.close();
    }
}

const data = {
    accountHolder: "Toan Nguyen",
    accountId: "MTC" + Math.floor(Math.random() * 1000),
    accountTier: "Diamond",
    balance: Math.floor(Math.random() * 100000),
    last_updated: new Date(),
}

const main = async () => {
    try {
        insertOne(MongoClient, data);
    } catch (error) {
        console.error(error);
    }
}

main();