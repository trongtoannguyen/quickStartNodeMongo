const MongoClient = require('./connection');

async function main() {
    try {



        /* await updateAllListingsToHavePropertyType(MongoClient); */

        /* await upsertListingByName(MongoClient, 'Crazee Castle',
            { name: 'Crazy Castle', bedroms: 19, bathrooms: 23 }); */

        /* await updateListingByName(MongoClient
            , "Apartamento"
            , { name: 'Apartamento zona sul do RJ', bedrooms: 8, beds: 5 }); */
    } catch (error) {
        console.error(error);
    } finally {
        await MongoClient.close();
        console.log('Closed connection.');
    }
}

main();

// ✅✅✅
async function updateAllListingsToHavePropertyType(MongoClient) {
    const results = await MongoClient.db('sample_airbnb').collection('listingsAndReviews').updateMany(
        { television: { $exists: false } },
        { $set: { television: "AppleTV" } }
    );

    console.log(`Matched document(s) the query criteria: ${results.matchedCount}`);
    console.log(`Updated document(s): ${results.modifiedCount}`);
    console.log(results);
}

/**
 * Upsert an Airbnb listing with the given name. 
 * If a listing with the given name exists, it will be updated.
 * If a listing with the given name does not exist, it will be inserted.
 * @param {MongoClient} MongoClient client A MongoClient that is connected to a cluster with the sample_airbnb database
 * @param {string} nameOfListing The name of the listing you want to upsert
 * @param {object} updatedListing An object containing all of the properties to be upserted for the given listing
 */
// ✅✅✅
async function upsertListingByName(MongoClient, nameOfListing, updatedListing) {
    const result = await MongoClient.db('sample_airbnb').collection('listingsAndReviews').updateOne(
        { name: nameOfListing },
        { $set: updatedListing },
        { upsert: true }
    );

    console.log(`Matched document(s) the query criteria: ${result.matchedCount}`);
    if (result.upsertedCount > 0) {
        console.log(`One document was inserted with the id ${result.upsertedId}`);
    } else {
        console.log(`${result.modifiedCount} document(s) was/were updated.`);
    }
}

// ✅✅✅
async function updateListingByName(MongoClient, nameOfListing, updatedListing) {
    const result = await MongoClient.db('sample_airbnb').collection('listingsAndReviews').updateOne(
        { name: nameOfListing },
        { $set: updatedListing }
    )

    console.log(`Matched document(s) the query criteria: ${result.matchedCount}`);
    console.log(`Updated document(s): ${result.modifiedCount}`);
}