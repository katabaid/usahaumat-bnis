const { encrypt } = require('./BniEncryption')

const cid = '00332'
const sck = 'e420dca835be24bf592a47ebbc064475'

const buildObjectCreateBilling = async params => {
  const { trx_id, trx_amount, virtual_account } = params
  const { virtualAccountNumber, customerName, customerEmail } = await readVirtualAccount(virtual_account)
  return {
    type: 'createbilling',
    client_id: cid,
    trx_amount,
    customer_name: customerName,
    customer_email: customerEmail || null,
    customer_phone: null,
    virtual_account: virtualAccountNumber,
    datetime_expired: null,
    description: null
  }
}

const buildObjectUpdateBilling = async params => {
  const { trx_id, trx_amount } = params
  const { customerName, customerEmail } = await readDB(trx_id)
  return {
    type: 'updatebilling',
    client_id: cid,
    trx_id,
    trx_amount,
    customer_name: customerName,
    customer_email: customerEmail,
    customer_phone: null,
    datetime_expired: null,
    description: null
  }
}

const buildObjectInquiryBilling = async params => {
  const { trx_id } = params
  return {
    type: 'inquirybilling',
    client_id: cid,
    trx_id
  }
}

const buildObject = async (params, bniapi) => {
  if (bniapi === 'createbilling') return buildObjectCreateBilling(params)
  else if (bniapi === 'updatebilling') return buildObjectUpdateBilling(params)
  else if (bniapi === 'inquirybilling') return buildObjectInquiryBilling(params)
}

const buildJSONCreateBilling = async (trx_id, trx_amount, virtual_account) => {
  const bniObject = await buildObject({
    trx_id,
    trx_amount,
    virtual_account
  }, 'createbilling')
  const request = {
    client_id: cid,
    data: encrypt(bniObject, cid, sck)
  }
  return JSON.stringify(request)
}

const buildJSONUpdateBilling = async (trx_id, trx_amount) => {
  const bniObject = await buildObject({
    trx_id,
    trx_amount
  }, 'updatebilling')
  const request = {
    client_id: cid,
    data: encrypt(bniObject, cid, sck)
  }
  return JSON.stringify(request)
}

const buildJSONInquiryBilling = async trx_id => {
  const bniObject = await buildObject({
    trx_id
  }, 'inquirybilling')
  const request = {
    client_id: cid,
    data: encrypt(bniObject, cid, sck)
  }
  return JSON.stringify(request)
}

const runner = async () => {
  const req = await buildJSONInquiryBilling('123')
  console.log(req)
}
const runner2 = async () => {
  const req = await buildJSONUpdateBilling('123', '1000')
  console.log(req)
}

runner()
runner2()

module.exports = {
  buildJSONCreateBilling,
  buildJSONInquiryBilling,
  buildJSONUpdateBilling
}
