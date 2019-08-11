const faker = require('faker')
const mariadb = require('mariadb')
const request = require('./index')

const displayResults = res => {
  console.log(res)
}

const handleDBSuccess = res => {
  const response = {
    status: '000',
    message: 'Operasi database berhasil'
  }
  return response
}

const pool = mariadb.createPool({
  socketPath: '/var/run/mysqld/mysqld.sock',
  user: 'aulia',
  database: 'test_va'
})

const handleQueryError = async err => {
  console.log(err.fatal)
  console.log(err.errno)
  console.log(err.sqlState)
  console.log(err.code)
}

const handleConnError = async err => {
  console.log(err)
}

const handleCreateVirtualAccount = async res => {
  const id = await res.insertId

  try {
    const conn = await pool.getConnection()
    try {
      const queryResponse = await conn.query(`SELECT virtual_account FROM bnis_va_cust WHERE user_id = ${id}`)
      const virtualAccount = queryResponse[0] // This is an object NOT a string
      const output = {
        status: '000',
        message: 'Operasi database berhasil',
        data: virtualAccount
      }

      return output
    } catch (err) {
      handleQueryError(err)
    }
  } catch (err) {
    handleConnError(err)
  }
}

const query = (q, responseHandler) => {
  pool.getConnection()
    .then(conn => {
      // Handle querying
      conn.query(q.query, q.values)
        .then(res => responseHandler(res))
        .then(out => console.log(out))
        .catch(err => handleQueryError(err))
        // Make sure that we release resource
      conn.release()
    })
    .catch(err => handleConnError(err))
}

const createDBInterface = () => ({
  createVirtualAccount (userName, userBirthdate) {
    query(
      request.buildCreateVirtualAccountQuery(userName, userBirthdate),
      handleCreateVirtualAccount)
  }
})

const db = createDBInterface()
for (let i = 0; i < 1; i++) {
  const fakeUserName = faker.internet.userName()
  const fakeBirthDate = faker.date.past(50)

  db.createVirtualAccount(fakeUserName, '1970-01-03')
}
