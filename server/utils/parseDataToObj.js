module.exports = data => {
    return JSON.parse((JSON.parse(data.text)).Msg)
}
