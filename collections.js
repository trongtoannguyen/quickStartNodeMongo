const client = require('./connection');

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
    const dbo = await client.db('bank');
    try {
        const collection = await dbo.createCollection(nameOfCollection);
        console.log(`New collection named ${collection.collectionName} was created in ${collection.dbName}`);
    } catch (error) {
        throw error.message;
    } finally {
        await client.close();
    }
}

async function main() {
    try {
        // Connect to database
        client.connect();
        console.log('Connecting to db...');
        // await listCollections(client);
        //Create Collection named transfers.
        await createCollection(client, 'transfers');
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
        console.log('closed db connection.');
    }
}

main().catch(console.error);
