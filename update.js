const MongoClient = require('./connection');

async function main() {
    try {
        await updateListingByName(MongoClient
            , "Apartamento"
            , { name: 'Apartamento zona sul do RJ', bedrooms: 8, beds: 5 });
    } catch (error) {
        console.error(error);
    } finally {
        await MongoClient.close();
        console.log('Closed connection.');
    }
}

main();

async function updateListingByName(MongoClient, nameOfListing, updatedListing) {
    const result = await MongoClient.db('sample_airbnb').collection('listingsAndReviews').updateOne(
        { name: nameOfListing },
        { $set: updatedListing }
    )

    console.log(`Matched document(s) the query criteria: ${result.matchedCount}`);
    console.log(`Updated document(s): ${result.modifiedCount}`);
}