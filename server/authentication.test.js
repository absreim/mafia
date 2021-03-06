const Authentication = require("./authentication.js")
const pgp = require("pg-promise")()

const settings = require("./settings.json")

const connection = settings.db_connection_params

const db = pgp(connection)
const auth = new Authentication(db)

beforeAll(done => {
    function callback(err){
        done()
    }
    auth.createUser("Alice","firstUser", callback)
})

test("User Alice should exist.", done => {
    function callback(err, result){
        expect(result).toEqual(true)
        done()
    }
    auth.userExists("Alice", callback)
})

test("User Alice should authenticate.", done => {
    function callback(err, result){
        expect(result).toEqual(true)
        done()
    }
    auth.authenticate("Alice","firstUser", callback)
})

test("Wrong password should be rejected.", done => {
    function callback(err, result){
        expect(result).toEqual(false)
        done()
    }
    auth.authenticate("Alice","guessedPassword", callback)
})

describe("After user Alice created and confirmed to authenticate.", () => {
    beforeAll(done => {
        function callback(err){
            done()
        }
        auth.changePassword("Alice","newPassword",callback)
    })
    test("User Alice should authenticate with new password.", done => {
        function callback(err, result){
            expect(result).toEqual(true)
            done()
        }
        auth.authenticate("Alice","newPassword", callback)
    })
})

afterAll(done => {
    function callback(err){
        expect(err).toEqual(null)
        pgp.end()
        done()
    }
    auth.deleteUser("Alice", callback)
})