require('dotenv').config()

const inquiryBilling = (trx_id) => ({
  type: 'inquirybilling',
  client_id: process.env.CUSTOMER_ID,
  trx_id
})

module.exports = {
  inquiryBilling
}
