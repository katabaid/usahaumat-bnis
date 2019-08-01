// TODO: replace client_id with a variable
const createBilling = (trx_id, trx_amount, virtual_account) => {
  const { virtualAccountNumber, customerName, customerEmail } = readVirtualAccount(virtual_account)
  return {
    type: 'createbilling',
    client_id: '00332',
    trx_amount,
    customer_name: customerName,
    customer_email: customerEmail || null,
    customer_phone: null,
    virtual_account: virtualAccountNumber,
    datetime_expired: null,
    description: null
  }
}

const inquiryBilling = trx_id => ({
  type: 'inquirybilling',
  client_id: '00332',
  trx_id
})

const updateBilling = (trx_id, trx_amount) => {
  const { customerName, customerEmail } = readDB(trx_id)
  return {
    type: 'updatebilling',
    client_id: '00332',
    trx_id,
    trx_amount,
    customer_name: customerName,
    customer_email: customerEmail,
    customer_phone: null,
    datetime_expired: null,
    description: null
  }
}

module.exports = {
  createBilling,
  inquiryBilling,
  updateBilling
}
