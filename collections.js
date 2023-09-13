const MongoClient = require('./connection');

//List Collections
const listCollections = async (client) => {
    const dbo = await client.db('bank');
    try {
        const collectionsList = await dbo.listCollections().toArray();
        console.log('Collections: ');
        for (const collectionInfo of collectionsList) {
            const collectionName = collectionInfo.name;
            console.log(` - ${collectionName}`);
            //Drop some collections
            /* if (collectionName !== 'listingsAndReviews') {
                await dbo.collection(collectionName).drop(function (err, delOK) {
                    if (err) throw err;
                    if (delOK) console.log("Collection deleted");
                    db.close();
                });
            } */
        }
    } catch (error) {
        console.error('Error listing collections:', error);
    }
}

//Create Collection
async function createCollection(client, nameOfCollection) {
    const dbo = await client.db('transfers');
    try {
        const collection = await dbo.createCollection(nameOfCollection);
        console.log(`New collection named ${collection.collectionName} was created in ${collection.dbName}`);
    } catch (error) {
        throw error.message;
    } finally {
        await MongoClient.close();
    }
}

async function main() {
    try {
        // await listCollections(MongoClient);
        await createCollection(MongoClient, 'accounts');
    } catch (e) {
        console.error(e);
    } finally {
        await MongoClient.close();
        console.log('closed db connection.');
    }
}

main().catch(console.error);
