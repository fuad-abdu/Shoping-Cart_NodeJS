var MongoClient = require('mongodb').MongoClient;
const state = {
    db: null
}

module.exports.connect = function (done) {
    const dbname = 'shoping'
    const url = process.env.DB_URL

    MongoClient.connect(url,(err,data)=>{
        if (err) return done(err)
        state.db = data.db(dbname)
        done()
    })

}

module.exports.get = function () {
    return state.db
}