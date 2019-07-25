const BniEnc = require('./BniEncryption')

let cid = 'XXX' //from BNI
let sck = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' //from BNI
let two_hours = new Date(+new Date() + 2 * 3600 * 1000)
let data = {
  type: 'createbilling',
  trx_amount: 100000,
  customer_name: 'David',
  customer_email: 'david@example.com',
  customer_phone: '08123456781011',
  description: 'Test Create Billing',
  trx_id: 'invoice-0001', // this should be unique
  virtual_account: null,
  billing_type: 'c',
  client_id: cid,
  datetime_expired: two_hours.toISOString()
}

let encrypted_string = BniEnc.encrypt(data, cid, sck)
let parsed_string = BniEnc.decrypt(encrypted_string, cid, sck)

console.log(encrypted_string)
console.log(parsed_string)
