const SheetFlow = require('..')

const options = {
    credentials: require('./creds.json'),
    sheet: {
        id: '1SmVEJqgPVDu6_0TyusWpAX7xWV7c6GGrTyv72aY38ac',
        name: 'Sheet1',
        range: 'A:C'
    }
}

const db = new SheetFlow(options)

async function main() {
    await db.connect()
    let response;

    // Read data
    response = await db.read()
    /*
    Response:
    [
        { id: '1', name: 'Richard', age: '20' },
        { id: '2', name: 'Eddie ', age: '21' },
        { id: '3', name: 'Ruth', age: '32' },
        { id: '4', name: 'Gerard ', age: '19' },
        { id: '5', name: 'Paul', age: '25' }
    ]
    */

    // Write data 
    response = await db.write(['6', 'James', '43'])

    // Update data
    const data = {
        name: "Eddie",
        age: "22"
    }
    response = await db.update(data) // sets Eddie's age to 22

    // Delete data
    response = await db.delete(3) // deletes "Ruth" from database

    // Search data
    response = await db.search('Gerard')
    /*
    Response:
    [
        {
            id: '4',
            name: 'Gerard',
            age: '19'
        }
    ]
    */
}

main()