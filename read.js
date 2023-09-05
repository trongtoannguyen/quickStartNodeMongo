const MongoClient = require('./connection');


async function main() {

    try {
        // await findOneListingByName(MongoClient, 'The Blue Bird');
        await findListingsWithMinimumBedroomsBathroomsAndMostRecentReviews(MongoClient
            , {
                minimumNumberOfBedrooms: 4,
                minimumNumberOfBathrooms: 5,
                maximunNumberOfResults: 8
            });
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

async function findListingsWithMinimumBedroomsBathroomsAndMostRecentReviews(
    MongoClient
    , { minimumNumberOfBedrooms = 0,
        minimumNumberOfBathrooms = 0,
        maximunNumberOfResults = Number.MAX_SAFE_INTEGER
    }) {
    const cursor = await MongoClient.db('sample_airbnb').collection('listingsAndReviews').find({
        bedrooms: { $gte: minimumNumberOfBedrooms },
        bathrooms: { $gte: minimumNumberOfBathrooms },
    })
        .sort({ last_review: -1 })
        .limit(maximunNumberOfResults);

    // Store the results in an array
    const results = await cursor.toArray();

    //print results
    if (results.length > 0) {
        console.log(`Found listing(s) with at least ${minimumNumberOfBedrooms} bedrooms and ${minimumNumberOfBathrooms} bathrooms:`);
        results.forEach((result, i) => {
            const date = new Date(result.last_review).toDateString();
            //    most recent review date: Mon Dec 21 2015 12:00:00 GMT +0700(Indochina Time)
            //    most recent review date: Sun Nov 04 2018

            console.log();
            console.log(`${i + 1}.name: ${result.name}`);
            console.log(`   _id: ${result._id}`);
            console.log(`   bedrooms: ${result.bedrooms}`);
            console.log(`   bathrooms: ${result.bathrooms}`);
            console.log(`   most recent review date: ${date}`);
            console.log(`   Type of Date: ${typeof (date)}`);
        });
    } else {
        console.log(`No listings found with at least ${minimumNumberOfBedrooms} bedrooms and ${minimumNumberOfBathrooms} bathrooms`);
    }
}