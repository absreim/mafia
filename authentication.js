const bcrypt = require("bcrypt")
const saltRounds = 10;
const pgPromise = require("pg-promise")

const Authentication = class {
    constructor(db){
        this.db = db
    }
    createUser(username, password, callback){
        const database = this.db
        bcrypt.hash(password, saltRounds, function(err, hash){
            if(err){
                callback(err)
            }
            else{
                database.none("INSERT INTO accounts (username, hash) VALUES ($1, $2)",
                    [username, hash]).then(function(data){
                        callback(null)
                    }).catch(function(err){
                        callback(err)
                    })
                }
        })
    }
    userExists(username, callback){
        this.db.oneOrNone("SELECT FROM accounts WHERE username = $1",
            [username]).then(function(data){
                const result = data != null
                callback(null, result)
            }).catch(function(err){
                callback(err, null)
        })
    }
    changePassword(username, password, callback){
        const database = this.db
        bcrypt.hash(password, saltRounds, function(err, hash){
            if(err){
                callback(err)
            }
            else{
                database.none("UPDATE accounts SET hash = $1 WHERE username = $2",
                    [hash,username]).then(function(data){
                        callback(null)
                    }).catch(
                        function(err){
                            callback(err)
                        }
                )
            }
        })
    }
    deleteUser(username, callback){
        this.db.none("DELETE FROM accounts WHERE username = $1",[username]).then(
            function(){
                callback(null)
            }
        ).catch(
            function(err){
                callback(err)
            }
        )
    }
    authenticate(username, password, callback){
        this.db.one("SELECT hash FROM accounts WHERE username = $1",[username]).then(
            function(data){
                bcrypt.compare(password, data.hash, function(err, result){
                    if(err){
                        callback(err, null)
                    }
                    callback(null, result)
                })
            }
        ).catch(
            function(err){
                if(err.code === pgPromise.errors.queryResultErrorCode.noData){
                    callback(null, false)
                }
                else{
                    callback(err, null)
                }
            }
        )
    }
}

module.exports = Authentication