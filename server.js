const axios = require('axios')
const R = require('ramda')
const BniEnc = require('./BniEncryption')
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
    if (res['status'] === '000') console.log(decrypt(res['message']))
  } catch (e) {
    console.log(e)
  }
}

module.exports = {
  post
}
