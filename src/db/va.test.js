const faker = require('faker')
const mariadb = require('mariadb')
const request = require('./index')

const pool = mariadb.createPool({
  socketPath: '/var/run/mysqld/mysqld.sock',
  user: 'aulia',
  database: 'test_va'
})

const createDBInterface = () => ({
  async createVirtualAccount (userName, userBirthdate) {
    return query(
      request.buildCreateVirtualAccountQuery(userName, userBirthdate),
      handleCreateVirtualAccount
    )
  },
  async getVirtualAccount (virtualAccount) {
    return query(
      request.buildGetVirtualAccountQuery(virtualAccount),
      handleGetVirtualAccount
    )
  },
  // Lee:
  // - Implements 7.1. I don't think trx_id is needed. The db should generate it automatically
  // - Consider using a foreign key to reference fields related to user
  // - Is there a difference between customer_name and user_name? Here I assume that it's the same
  async createBillingRecord (trxAmount, virtualAccount) {
    const { user_name, user_email } = await this.getVirtualAccount(virtualAccount)
    console.log(user_name)
    console.log(user_email)
    // query(
    //   request.buildCreateBillingQuery(trxAmount, virtualAccount, user_name, user_email),
    //   handleCreateBilling
    // )
  }
})

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

const handleGetVirtualAccount = async res => {
  const user = await res[0]
  return user
}

const query = async (q, responseHandler) => {
  try {
    const conn = await pool.getConnection()
    try {
      const response = await conn.query(q.query, q.values)
      const handled = await responseHandler(response)
      conn.release()
      // console.log(handled)
      return handled
    } catch (err) {
      handleQueryError(err)
    }
  } catch (err) {
    handleConnError(err)
  }
  // pool.getConnection()
  //   .then(conn => {
  //     // Handle querying
  //     conn.query(q.query, q.values)
  //       .then(res => responseHandler(res))
  //       .catch(err => handleQueryError(err))
  //       // Make sure that we release db resource
  //     conn.release()
  //   })
  //   .catch(err => handleConnError(err))
}

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

const handleQueryError = async err => {
  console.log(err.fatal)
  console.log(err.errno)
  console.log(err.sqlState)
  console.log(err.code)
}

const handleConnError = async err => {
  console.log(err)
}

const db = createDBInterface()
for (let i = 0; i < 1; i++) {
  const fakeUserName = faker.internet.userName()
  const fakeBirthDate = faker.date.past(50)

  // db.createVirtualAccount(fakeUserName, '1970-01-03')
  // db.getVirtualAccount('9880033270010312')
  db.createBillingRecord(1000, '9880033270010312')
}
