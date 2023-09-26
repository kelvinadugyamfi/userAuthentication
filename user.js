const dbConnect = require('./dbConnect')
const {DataTypes, Sequelize} = require('sequelize')

const user = dbConnect.define ('users', {
    id : {
        primaryKey : true,
        autoIncrement : true,
        type : DataTypes.INTEGER
    },
    user_name : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    password : {
        type : DataTypes.STRING,
        allowNull : false,
    }, 
})

user.sync({alter :true})
module.exports = user