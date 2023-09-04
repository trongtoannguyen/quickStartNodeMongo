require('dotenv').config();
const { MongoClient } = require('mongodb');
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

async function main() {
    try {
        await client.connect();
        console.log('connecting to db...');
    } catch (e) {
        console.error(e);
    }
}

main().catch(console.error);

module.exports = client;