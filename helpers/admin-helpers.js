var db = require('../config/connection')
var collection = require('../config/collection')
var objectId = require('mongodb').ObjectId
const bcrypt = require('bcrypt')

module.exports = {

    DoSignup: (adminData) => {
        return new Promise(async (resolve, reject) => {
            adminData.password = await bcrypt.hash(adminData.password,10)
            db.get().collection(collection.ADMIN_COLLECTION).insertOne(adminData).then((data) => {
                resolve(data.ops[0])
            })

        })
    },

    DoLogin: (adminData) => {
        console.log(adminData);
        return new Promise(async (resolve, reject) => {
            let response = {}
            let admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ email: adminData.email })
            if (admin) {
                bcrypt.compare(adminData.password, admin.password).then((status) => {
                    if (status) {
                        console.log('login sucsess')
                        response.admin = admin
                        response.status = true
                        resolve(response)
                    } else {
                        console.log('login failed');
                        resolve({ status: false })
                    }
                })
            } else {
                console.log('failed');
                resolve({ status: false })
            }
        })
    },

    getAllOrders:(orderId)=>{
        return new Promise(async (resolve,reject)=>{
            let orders = await db.get().collection(collection.ORDER_COLLECTION).find({_id:objectId(orderId)}).toArray()
            resolve(orders)
        })
    }

}