const {mysql} = require('../qcloud')
module.exports = async id => {
    const formValuesArray = await mysql('paymentInfo').select('*').where('id', '=', id)
    const formValues = formValuesArray[0]
    delete formValues.id
    return formValues
}
