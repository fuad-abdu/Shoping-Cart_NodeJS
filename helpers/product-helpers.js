var db = require('../config/connection')
var collection = require('../config/collection')
var objectId = require('mongodb').ObjectId
module.exports = {

    addProducts: (products, callback) => {
        products = {
            _id: products._id,
            name: products.name,
            category: products.category,
            price: parseInt(products.price),
            description: products.description
        }
        console.log(products + 'poli');

        db.get().collection('product').insertOne(products).then((data) => {
            callback(data.ops[0]._id)
        }
        )
    },

    addAllProducts: () => {
        return new Promise(async (resolve, reject) => {
            let products = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            console.log( products);
            resolve(products)
        })
    },

    addMobileProducts: () => {
        return new Promise(async (resolve, reject) => {
            let phones = await db.get().collection(collection.PRODUCT_COLLECTION).find({'category':'Mobile'}).toArray()
            console.log('phones ',phones);
            resolve(phones)
        })
    },
    
    addMenProducts: () => {
        return new Promise(async (resolve, reject) => {
            let Menfashions = await db.get().collection(collection.PRODUCT_COLLECTION).find({'category':'Men'}).toArray()
            console.log('fash ',Menfashions);
            resolve(Menfashions)
        })
    },

    addWomenProducts: () => {
        return new Promise(async (resolve, reject) => {
            let Womenfashions = await db.get().collection(collection.PRODUCT_COLLECTION).find({'category':'Women'}).toArray()
            console.log('fash ',Womenfashions);
            resolve(Womenfashions)
        })
    },

    addKidsProducts: () => {
        return new Promise(async (resolve, reject) => {
            let Kidsfashions = await db.get().collection(collection.PRODUCT_COLLECTION).find({'category':'Kids'}).toArray()
            console.log('fash ',Kidsfashions);
            resolve(Kidsfashions)
        })
    },

    addFootProducts: () => {
        return new Promise(async (resolve, reject) => {
            let foot = await db.get().collection(collection.PRODUCT_COLLECTION).find({'category':'Footwear'}).toArray()
            console.log('fash ',foot);
            resolve(foot)
        })
    },

    addBlockProducts:()=>{
        return new Promise(async(resolve,reject)=>{
            let block = await db.get().collection(collection.PRODUCT_COLLECTION).find({'category':'block'}).toArray()
            console.log(block);
            resolve(block)
        })
    },

    addLaptopProducts: () => {
        return new Promise(async (resolve, reject) => {
            let Laptops = await db.get().collection(collection.PRODUCT_COLLECTION).find({'category':'Laptop'}).toArray()
            console.log(Laptops);
            resolve(Laptops)
        })
    },

    addCameraProducts: () => {
        return new Promise(async (resolve, reject) => {
            let Cameras = await db.get().collection(collection.PRODUCT_COLLECTION).find({'category':'Camera'}).toArray()
            console.log(Cameras);
            resolve(Cameras)
        })
    },

    addWatchProducts: () => {
        return new Promise(async (resolve, reject) => {
            let Watchs = await db.get().collection(collection.PRODUCT_COLLECTION).find({'category':'Watch'}).toArray()
            console.log(Watchs);
            resolve(Watchs)
        })
    },

    addTVProducts: () => {
        return new Promise(async (resolve, reject) => {
            let TV = await db.get().collection(collection.PRODUCT_COLLECTION).find({'category':'TV'}).toArray()
            console.log(TV);
            resolve(TV)
        })
    },

    addACProducts: () => {
        return new Promise(async (resolve, reject) => {
            let AC = await db.get().collection(collection.PRODUCT_COLLECTION).find({'category':'Air Conditioner'}).toArray()
            console.log(AC);
            resolve(AC)
        })
    },

    addWashingMachineProducts: () => {
        return new Promise(async (resolve, reject) => {
            let WashingMachine = await db.get().collection(collection.PRODUCT_COLLECTION).find({'category':'Washing Machine'}).toArray()
            console.log(WashingMachine);
            resolve(WashingMachine)
        })
    },   
    
    addMixerProducts: () => {
        return new Promise(async (resolve, reject) => {
            let Mixer = await db.get().collection(collection.PRODUCT_COLLECTION).find({'category':'Mixer'}).toArray()
            console.log(Mixer);
            resolve(Mixer)
        })
    },

    addFurnitureProducts: () => {
        return new Promise(async (resolve, reject) => {
            let Furniture = await db.get().collection(collection.PRODUCT_COLLECTION).find({'category':'Furniture'}).toArray()
            console.log(Furniture);
            resolve(Furniture)
        })
    },

    addBeautyProducts: () => {
        return new Promise(async (resolve, reject) => {
            let Beauty = await db.get().collection(collection.PRODUCT_COLLECTION).find({'category':'Beauty'}).toArray()
            console.log(Beauty);
            resolve(Beauty)
        })
    },

    addToyProducts: () => {
        return new Promise(async (resolve, reject) => {
            let Toy = await db.get().collection(collection.PRODUCT_COLLECTION).find({'category':'Toys'}).toArray()
            console.log(Toy);
            resolve(Toy)
        })
    },

    addHomeProducts: () => {
        return new Promise(async (resolve, reject) => {
            let home = await db.get().collection(collection.PRODUCT_COLLECTION).find({'category':'cookware'}).toArray()
            console.log(home);
            resolve(home)
        })
    },

    addFitnessProducts: () => {
        return new Promise(async (resolve, reject) => {
            let fitness = await db.get().collection(collection.PRODUCT_COLLECTION).find({'category':'fitness'}).toArray()
            console.log(fitness);
            resolve(fitness)
        })
    },

    addToolsProducts: () => {
        return new Promise(async (resolve, reject) => {
            let tools = await db.get().collection(collection.PRODUCT_COLLECTION).find({'category':'tools'}).toArray()
            console.log(tools);
            resolve(tools)
        })
    },

    addCleanProducts: () => {
        return new Promise(async (resolve, reject) => {
            let clean = await db.get().collection(collection.PRODUCT_COLLECTION).find({'category':'clean'}).toArray()
            console.log(clean);
            resolve(clean)
        })
    },


    deleteProduct: (proId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).removeOne({ _id: objectId(proId) }).then((response) => {
                resolve(response)
            })
        })
    },

    getProductDetails: (proId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({ _id: objectId(proId) }).then((product) => {
                resolve(product)
            })
        })
    },

    getDeliveryDetails: (orderId) => {
        
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({ _id: objectId(orderId) }).then((details)=>{
                resolve(details)
            })  
        })
    },

    updateProduct: (proId, proDetails) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).updateOne({ _id: objectId(proId) }, {
                $set: {

                    name: proDetails.name,
                    category: proDetails.category,
                    description: proDetails.description,
                    price: parseInt(proDetails.price)
                }
            }).then((response) => {
                resolve()
            })
        })
    }
}