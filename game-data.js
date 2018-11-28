// contains functions to access game instance data shared
// between multiple nodes in Redis while respecting mutex
// locks

const LOWERRETRYTIMEOUT = 200
const UPPERRETRYTIMEOUT = 400

const GameData = class {
    constructor(redisClient){
        this.redisClient = redisClient
    }
    runOnLobbyGame(){

    }
    runOnStartedGame(){

    }
    deleteLobbyGame(){

    }
    deleteStartedGame(){
        
    }
}