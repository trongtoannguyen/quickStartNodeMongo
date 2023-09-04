const MongoClient = require('./connection');


async function main() {

    try {
        await findOneListingByName(MongoClient, 'The Blue Bird');
    } finally {
        await MongoClient.close();
        console.log('closed db connection.');
    }
}

main().catch(console.error());

async function findOneListingByName(MongoClient, nameOfListing) {
    const result = await MongoClient.db('sample_mflix').collection('movies').findOne({ title: nameOfListing });

    if (result) {
        console.log(`Found a listing in the collection with the title '${nameOfListing}':`);
        console.log(result);
    } else {
        console.log(`No listings found with the title '${nameOfListing}'`);
    }
}