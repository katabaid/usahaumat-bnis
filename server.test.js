const axios = require('axios')
const conn = require('./server')
const BniEnc = require('./BniEncryption')

const cid = '00332' // from BNI
const sck = 'e420dca835be24bf592a47ebbc064475' // from BNI
const two_hours = new Date(+new Date() + 2 * 3600 * 1000)
const data = {
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

const encrypted_string = BniEnc.encrypt(data, cid, sck)
const parsed_string = BniEnc.decrypt(encrypted_string, cid, sck)

console.log(encrypted_string)
console.log(parsed_string)
console.log('')

const msg = {
  client_id: cid,
  data: encrypted_string
}

const msgJSON = JSON.stringify(msg)

const bniurl = 'https://apibeta.bni-ecollection.com/'
axios.defaults.baseURL = bniurl
axios.defaults.headers.post['Content-Type'] = 'application/json'

axios.post('/', msgJSON)
  .then(res => console.log(res))
  .catch(e => console.log(e))

// it('should connect to BNI server', () => {
//   expect.assertions(1)
//   return conn.createBilling
// })
