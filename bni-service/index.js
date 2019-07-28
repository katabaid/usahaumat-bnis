const axios = require('axios')
const R = require('ramda')
const winston = require('winston')
const moment = require('moment')
const BniEnc = require('./BniEncryption')
const { inquiryBilling } = require('./billling')

require('dotenv').config()
const bniurl = 'https://apibeta.bni-ecollection.com/'
axios.defaults.baseURL = bniurl
axios.defaults.headers.post['Content-Type'] = 'application/json'

const encrypt = data => BniEnc.encrypt(data, process.env.CUSTOMER_ID, process.env.SECRET_KEY)

const decrypt = data => BniEnc.decrypt(data, process.env.CUSTOMER_ID, process.env.SECRET_KEY)

const prepareRequest = data => JSON.stringify({ client_id: process.env.CUSTOMER_ID, data: encrypt(data) })

const post = async req => {
  try {
    const res = await axios.post('/', prepareRequest(req))
    console.log(res)
    if (res.data.status === '000') console.log(decrypt(res.data.data))
  } catch (e) {
    console.log(e)
  }
}

post(inquiryBilling())

module.exports = {
  post
}
