const MongoClient = require("mongodb").MongoClient;
const settings = require("./settings");
const mongoConfig = settings.mongoConfig;

let _connection = undefined;
let _db = undefined;

module.exports = async () => {
    try{
        if(!_connection) {
            _connection = await MongoClient.connect(mongoConfig.serverUrl, { useNewUrlParser: true });
            _db = await _connection.db(mongoConfig.database);
        }
    }
    catch(error){
        throw "Failed to connect to database"; 
    }
    return _db;
}

