const client = require('./connection');

async function main() {
    try {
        client.connect();
        console.log('Connecting to database...');
        await listDatabases(client);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
        console.log('closed db connection.');
    }
}

main().catch(console.error);

async function listDatabases(MongoClient) {
    /* 
    db(); Create a new Db instance sharing the current socket connections.
    new Admin(); Create a new Admin instance 
     */
    const databasesList = await client.db().admin().listDatabases();
    console.log("Databases:");
    console.log(databasesList);
    // databasesList.databases.forEach(db => console.log(` - ${db.name}`));
}