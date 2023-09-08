const MongoClient = require('./connection');

//List Collections
async function listCollections(client) {
    const dbo = await client.db('sample_airbnb');
    const collectionsList = await dbo.listCollections().toArray();
    console.log('Collections: ');
    collectionsList.forEach(cols => console.log(` - ${cols.name}`));
}

async function main() {
    try {
        await listCollections(MongoClient);
    } catch (e) {
        console.error(e);
    } finally {
        await MongoClient.close();
        console.log('closed db connection.');
    }
}

main().catch(console.error);