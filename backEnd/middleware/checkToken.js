const jwt = require('jsonwebtoken')
const { PRIVATE_KEY } = require('../config.json')
//apply this checkToken to all studen module to check users must be login
module.exports.checkToken = async (req, res, next) => {
    try {
        const tokenHeader = req.get('authorization') //Bear sdfhkcnfhcnweucwur
        if (!tokenHeader) throw new Error('No JWT found')
        const token = tokenHeader.split(' ')[1]
        const decoded = jwt.verify(token, PRIVATE_KEY)
        if (!decoded) throw new Error('Wrong token!')
        req.token = decoded
        next() //this next() use to jump to the next step studentsRouter in command app.use('/api/students', checkToken, studentsRouter)
    } catch (e) {
        next(e)
    }
}