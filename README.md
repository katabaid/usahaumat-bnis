## Progress
There are 2 features that was significantly worked on:

### Database
This consists of 2 parts:
- QueryBuilder defined in **src/private/index.js**.
- DBInterface defined in **src/db/va.test.js**.

The schema for the database is defined in **src/db/schema.sql** and **src/db/schema-test.sql**.

_Lee: I suggest to rely on schema-test.sql more. That was more recently changed._  

Two files were created to make sure that we don't waste unique virtual_account and trx_id values whenever a new virtual account is made or BNIS's create_billing API is called.

In the schema, a trigger was used to generate unique virtual_account based on BNIS's constant and birthdate. However, because a virtual account has to be 16 characters, there can only be 100 people per birthdate. This issue should be handled.

In DBInterface, async/await was heavily used. This makes it easier to access values returned by the database. Note, if we want to access the values, we have .then or await the function first. This is because async functions always return a promise. Refer to the following resources for more explanation on [promises](https://davidwalsh.name/promises) and [async/await](https://davidwalsh.name/async-await).

### Connection to BNIS
The code to connect to BNIS is written in **server.js** and **server.test.js**. You'll need to manually modify the content of the request to try out different BNIS services 

## Things that can be run
- node server.test.js
- node src/db/va.test.js

## Libraries used
- **axios** for http request.
- **mariadb** to connect to the database.
- **faker** to create fake data in the development process.
- **express** to handle incoming http requests. 