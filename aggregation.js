const client = require('./connection');
/* 
The aggregation pipeline is a framework in MongoDB
that enables the developers to execute a series 
of data transformations on the documents in a collection.
 */


async function printAccountMatch(client, balanceGreater) {
    const pipeline = [
        // Stage 1: All account match balance > given amount.
        {
            $match: {
                balance: { $gt: balanceGreater }
            },
        },
        {
            // Stage 2: Group results with _id: accountId, accountHolder,balance.
            $group: {
                _id: '$accountId',
                name: { $first: '$accountHolder' },
                balance: { $first: '$balance' },
                total_balance: { $sum: '$balance' },
            },
        },
        // Stage 3: Calculate avg balance & total balance
        {
            $group: {
                _id: null,
                accounts: {
                    $push: {
                        name: '$name',
                        balance: '$balance'
                    }
                },
                total_balance: { $sum: '$balance' },
                avg_balance: { $avg: '$balance' },
            },
        },
        // Stage 4: Sort accounts in balance descending order.
        {
            $unwind: '$accounts'
        },
        {
            $sort: {
                'accounts.balance': - 1
            }
        }
    ];

    const dbo = client.db('bank').collection('accounts');
    const aggCursor = await dbo.aggregate(pipeline);


    let totalBalance = null;
    await aggCursor.forEach(result => {
        if (totalBalance === null) {// Some tricks
            console.log('Total Balance:', result.total_balance);
            console.log('Average Balance:', result.avg_balance);
            console.log('Individual Accounts:');
            totalBalance = result.total_balance;
        }
        console.log(`Name: ${result.accounts.name}, Balance: ${result.accounts.balance}`);
    });

}

async function main() {
    try {
        // Establish connection to database.
        await client.connect();
        console.log('Connection status: [Established]');

        await printAccountMatch(client, 9000);
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
        console.log('Connection status: [Closed]');
    }
}

main();