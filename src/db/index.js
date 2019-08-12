const mariadb = require('mariadb')
const moment = require('moment')
const config = require('../config.json')

const billingType = 'c'
const billingTypeDesc = config['billing-type']['c']

const cid = config['credentials']['client-id']
const sck = config['credentials']['secret-key']

const buildCreateBillingQuery = (trx_amount, virtual_account, customer_name, customer_email) => {
  // Check if the timezone is correct
  const nowRaw = moment()
  const now = nowRaw.format('YYYY-MM-DD HH:mm:ss')
  const datetimeExpired = nowRaw.add(48, 'hours').format('YYYY-MM-DD HH:mm:ss')

  const query =
`INSERT INTO bnis_trx(
  trx_amount,
  billing_type_db,
  billing_type,
  customer_name,
  customer_email,
  virtual_account,
  datetime_expired,
  is_active
) VALUES (${'?'}${', ?'.repeat(7)})`

  const values = [
    trx_amount * 100,
    billingType,
    billingTypeDesc,
    customer_name,
    customer_email,
    virtual_account,
    datetimeExpired,
    1
  ]

  return ({ query, values })
}

const buildUpdateBillingQuery = async params => {
  const { trx_id, trx_amount } = params
  const q = `UPDATE bnis_trx SET trx_amount=${trx_amount * 100} WHERE trx_id=${trx_id}`
}

const buildInquiryBillingQuery = async params => {
  const { trx_id } = params

  const q =
`SELECT
  trx_id,
  trx_amount,
  billing_type_db,
  billing_type,
  customer_name,
  virtual_account,
  datetime_expired,
  created_date,
  last_active_date,
  is_active
FROM bnis_trx`
}

const buildCreateVirtualAccountQuery = (user_name, user_birthdate) => {
  // Check if the timezone is correct
  const nowRaw = moment()
  const now = nowRaw.toDate()

  const query = `INSERT INTO bnis_va_cust(
    user_name, user_birthdate, last_active_date, is_active
    ) VALUES (${'?'}${', ?'.repeat(3)})` // 4 values

  const values = [
    user_name,
    moment(user_birthdate).format('YYYY-MM-DD'),
    now,
    1
  ]

  return ({ query, values })
}

const buildGetVirtualAccountQuery = virtual_account => {
  const query = `SELECT user_name, user_email FROM bnis_va_cust 
  WHERE virtual_account LIKE ${String(virtual_account)}`

  return ({ query })
}

module.exports = {
  buildCreateVirtualAccountQuery,
  buildGetVirtualAccountQuery,
  buildCreateBillingQuery
}
