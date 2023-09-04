const MongoClient = require('mongodb');

async function main() {
    try {
        await MongoClient.connect();
        console.log('connecting to db...');
        await listDatabases(MongoClient);
    } catch (e) {
        console.error(e);
    } finally {
        await MongoClient.close();
        console.log('closed db connection.');
    }
}

main().catch(console.error);

async function listDatabases(MongoClient) {
    /* 
    db(); Create a new Db instance sharing the current socket connections.
    new Admin(); Create a new Admin instance 
     */
    const databasesList = await MongoClient.db().admin().listDatabases();
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
}