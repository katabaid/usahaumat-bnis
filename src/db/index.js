const mariadb = require('mariadb')
const moment = require('moment')
const R = require('ramda')
const config = require('../config.json')

const billingType = 'c'
const billingTypeDesc = config['billing-type']['c']

const cid = config['credentials']['client-id']
const sck = config['credentials']['secret-key']

const buildCreateBillingQuery = async params => {
  const { trx_id, trx_amount, virtual_account } = params
  const { customer_name, customer_email } = getVirtualAccount(virtual_account)

  // Check if the timezone is correct
  const nowRaw = moment()
  const now = nowRaw.toISOString()
  const datetimeExpired = nowRaw.add(48, 'hours').toISOString()

  const values = [
    trx_amount * 100,
    billingType,
    billingTypeDesc,
    customer_name,
    customer_email,
    virtual_account,
    datetimeExpired,
    now,
    now,
    1
  ]

  const q =
`INSERT INTO bnis_trx(
  trx_amount,
  billing_type_db,
  billing_type,
  customer_name,
  customer_email,
  virtual_account,
  datetime_expired,
  created_date,
  last_active_date,
  is_active
) VALUES (${'?'}${' ?'.repeat(9)})`

  console.log(q)
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

const buildCreateVirtualAccountQuery = async params => {
  const { user_id, user_name, user_birthdate } = params

  const q =
`INSERT INTO bnis_va_cust(
  user_name,
  virtual_account,
  created_date,
  last_active_date,
  is_active
) VALUES (${'?'}${' ?'.repeat(4)})`
}

const buildGetVirtualAccountQuery = async params => {
  const { virtual_account } = params

  const q = `SELECT customer_name, customer_email FROM bnis_va_cust WHERE virtual_account=${virtual_account}`
}

// createInvoiceRecord()

// const createRecord = (params, type) => {
//   if (type === 'createinvoice')
// }
