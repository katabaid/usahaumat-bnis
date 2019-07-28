const axios = require('axios')
const R = require('ramda')
const winston = require('winston')
const moment = require('moment')
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
    if (res.data.status === '000') console.log(decrypt(res.data.data))
  } catch (e) {
    console.log(e)
  }
}

const buildVirtualAccount = (user_id, user_name, user_birthdate) => ({
  user_id,
  user_name,
  user_birthdate,
  virtual_account: generateVirtualAccount(user_birthdate),
  created_date: moment(),
  last_active_date: moment(),
  is_active: 1
})

const commitVirtualAccout = async va => {

}

const virtualAccountList = [
  '9880033223037601',
  '9880033226029901',
  '9880033223037602',
  '9880033212121201',
  '9880033223037603'
]

const extractBirthdate = va => R.slice(8, 14, va)
const extractRunningID = va => R.slice(14, -1, va)

const byBirthdate = R.groupBy(extractBirthdate)

console.log(byBirthdate(virtualAccountList))

// const extract = R.forEach(R.append(extractBirthdate, extractRunningID), virtualAccountList)
// const extract = R.forEach(extractBirthdate(value), virtualAccountList)
// console.log(extract)

const getVirtualAccountList = () => Promise.resolve(virtualAccountList)
const generateVirtualAccount = birthdate => String(988 + process.env.CUSTOMER_ID + moment(birthdate).format('YYMMDD'))

getVirtualAccountList()
  .then(console.log)

console.log(generateVirtualAccount(new Date(12, 12, 12)))

module.exports = {
  post
}
