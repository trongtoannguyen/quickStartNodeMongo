const { exit } = require('node:process');
const client = require('./connection');

/* To begin a transaction in MongoDB, you’ll need to obtain a session 
and then start the transaction using the startTransaction() method/ withTransaction method in NodeJs.
After performing the necessary operations, you may commit the transaction 
to apply the changes to the database, or abort to discard the changes. */

async function createReservation(client, account_id_sender, account_id_receiver, transaction_amount) {
    //Start the client session
    const session = await client.startSession();

    try {
        // Use withTransaction to start a transaction, execute the callback, and commit (or abort on error)
        // Note: The callback for withTransaction MUST be async and/or return a Promise.
        await session.withTransaction(async () => {

            //Specify readConcern, writeConcern, and readPreference transaction options(Optional)
            //Db & Collections information:
            const dbo = await client.db('bank');
            const accounts = await dbo.collection('accounts');
            const transfers = await dbo.collection('transfers');

            // Check needed values
            const checkSender = await accounts.findOne(
                {
                    accountId: account_id_sender,
                    balance: { $gte: transaction_amount }
                }
            )
            if (checkSender === null)
                throw new Error("Problem with sender account");

            const checkReceiver = await accounts.findOne(
                {
                    accountId: account_id_receiver
                }
            )
            if (checkReceiver === null)
                throw new Error("Problem with receiver account");

            // Define the sequence of operations to perform inside the transactions
            //Step1: update sender balance
            const updateSenderResults = await accounts.updateOne(
                { accountId: account_id_sender },
                { $inc: { balance: -transaction_amount } },
                { session }
            )
            if (updateSenderResults)
                console.log(`Sender balance: [-${transaction_amount}$]
                ${updateSenderResults.matchedCount} document(s) matched.`);

            //Step2: update receiver balance
            const updateReceiverResults = await accounts.updateOne(
                { accountId: account_id_receiver },
                { $inc: { balance: transaction_amount } },
                { session }
            )
            if (updateReceiverResults)
                console.log(`Receiver balance: [+${transaction_amount}$]
                ${updateSenderResults.matchedCount} document(s) matched.`);

            //Step3: Insert transfer document into transfers Collection
            const transferInfomation = {
                transfer_id: "TR" + Math.floor(Math.random() * 100000),
                transaction_amount: transaction_amount,
                from_account: account_id_sender,
                to_account: account_id_receiver
            };
            const insertTransferResults = await transfers.insertOne(
                transferInfomation,
                { session }
            )
            if (insertTransferResults) {
                // console.log(insertTransferResults);
                console.log(`Inserted into transfers collection ${insertTransferResults.insertedId}:
                >> Transaction [${transferInfomation.transfer_id}]`);
            }

            //Step4: push completed transfers into collection accounts's completed_transfers field
            //For SENDER
            const updateSenderCompletedTransfersResult = await accounts.updateOne(
                { accountId: account_id_sender },
                { $push: { completed_transfers: transferInfomation.transfer_id } },
                { session }
            );
            if (updateSenderCompletedTransfersResult)
                console.log(`SENDER [${account_id_sender}]:
                >> ${updateSenderCompletedTransfersResult.modifiedCount} Transaction [${transferInfomation.transfer_id}]`);
            //For RECEIVER
            const updateReceiverCompletedTransfersResult = await accounts.updateOne(
                { accountId: account_id_receiver },
                { $push: { completed_transfers: transferInfomation.transfer_id } },
                { session }
            );
            if (updateReceiverCompletedTransfersResult)
                console.log(`RECEIVER [${account_id_receiver}]:
                >> ${updateReceiverCompletedTransfersResult.modifiedCount} Transaction [${transferInfomation.transfer_id}]`);
        });
        console.log('Commit preparing...');
        // If sequence of operations inside the transactions OK
        console.log('The transaction status: successfully');
    } catch (error) {
        // If any operation fails:
        // Handle the error appropriately, e.g., log it or send a response to the client.
        console.error(error);
        // Abort the transaction
        console.log('Transaction was [ABORTED].');
        exit(1);
    } finally {
        // Release resources used by transaction
        await session.endSession();
        await client.close();
        console.log('Closed connection.');
    }
}

async function main() {
    //Account information
    let account_id_sender = 'MTC311';
    let account_id_receiver = 'MTC266';
    let transaction_amount = 234;
    try {
        //Connect to db
        client.connect();
        console.log('Connecting to db...');
        createReservation(client, account_id_sender, account_id_receiver, transaction_amount);
    } catch (error) {
        console.error;
    }
}

main();
// Note: Multi-document transactions have a 60-sec time limit
