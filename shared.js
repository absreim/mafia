/* Shared constants and classes between client and server. 
This file is not intended to be used as is on the client side. 
Organizing the module this way is merely meant to make the 
structure of the app easier to understand. */

const Shared = {}

/* 
STARTED: just started game, displaying list of players 
and waiting for ready from each player
DAYTIME: daytime, waiting for player to suggest target
DAYTIMEVOTING: daytime, target selected and waiting for votes
ENDOFDAY: displaying results of daytime voting
DAYTIMEVOTEFAILED: displaying vote results of failed vote
and waiting for acknowledgement from players
NIGHTTIME: nighttime, waiting for player to suggest target
NIGHTTIMEVOTING: nighttime, target selected and waiting for votes
NIGHTTIMEVOTEFAILED: displaying vote results of failed vote
and waiting for acknowledgement from players
ENDOFNIGHT: displaying results of nighttime attacks
OVER: game over screen, waiting for players to ready up
before creating new game
*/
Shared.Phases = {
    STARTED: "started",
    DAYTIME: "daytime",
    DAYTIMEVOTING: "daytimeVoting",
    ENDOFDAY: "endOfDay",
    DAYTIMEVOTEFAILED: "daytimeVoteFailed",
    NIGHTTIME: "nighttime",
    NIGHTTIMEVOTING: "nighttimeVoting",
    NIGHTTIMEVOTEFAILED: "nighttimeVoteFailed",
    ENDOFNIGHT: "endOfNight",
    OVER: "over"
}

Shared.ClientMessageType = {
    GAMESTATEREQ: "gameStateReq",
    SUGGESTTARGET: "suggestTarget",
    VOTECAST: "voteCast",
    ACKNOWLEDGE: "acknowledge" // acknowledge results of end of day and end of night
}

Shared.ServerMessageType = {
    GAMESTATEINFO: "gameStateInfo",
    ACKNOWLEDGEMENT: "acknowledgement",
    VOTECAST: "voteCast"
}

Shared.PlayerDetails = class {
    constructor(isWerewolf){
        this.isWerewolf = isWerewolf
        this.isAlive = true
    }
}

// serialized version of object meant to represent game state
// internally it may make more sense for acks to be a Set
Shared.GameState = class {
    constructor(){
        this.phase = Shared.Phases.WAITING
        this.players = {} // player name -> PlayerDetails object
        this.votes = {} // player name -> value; true = yea, false = nay
        this.acks = null // array of acknowledgements for information displayed in certain phases
        this.chosenPlayer = null // player chosen for voting or player just killed
    }
}

// serialized version of object meant to represent lobby game state
// internally it may make more sense for acks to be a Set
// maxPlayers must be at least 4 and strictly more than twice numWerewolves
Shared.LobbyGameState = class {
    constructor(maxPlayers, numWerewolves){
        this.maxPlayers = maxPlayers
        this.numWerewolves = numWerewolves
        this.players = null // array
    }
}

/* Details of session state returned to the client. */
Shared.LoginStatus = {
    LOGGEDIN: "loggedIn",
    LOGGEDOUT: "loggedOut",
    ERROR: "error"
}

/* Responses to account creation (/signup) requests */
Shared.AccountCreateOutcome = {
    INTERNALERROR: "internalError",
    EXISTS: "exists", // account with specified name already exists
    SUCCESS: "success",
    MISSINGINFO: "missingInfo" // required fields not present in body
}

/* Responses to logout requests */
Shared.LogoutOutcome = {
    NOTLOGGEDIN: "notLoggedIn",
    INTERNALERROR: "internalError",
    SUCCESS: "success"
}

Shared.AccountDeleteOutcome = {
    NOTLOGGEDIN: "notLoggedIn",
    INTERNALERROR: "internalError",
    MISSINGINFO: "missingInfo",
    WRONGPASSWORD: "wrongPassword",
    SUCCESS: "success"
}

Shared.LoginOutcome = {
    LOGGEDIN: "loggedIn", // already logged in
    INTERNALERROR: "internalError",
    MISSINGINFO: "missingInfo",
    WRONGCREDENTIALS: "wrongCredentials", // could be wrong username, password, or both
    SUCCESS: "success"
}

Shared.ChangePasswordOutcome = {
    NOTLOGGEDIN: "notLoggedIn",
    INTERNALERROR: "internalError",
    MISSINGINFO: "missingInfo",
    WRONGPASSWORD: "wrongPassword",
    SUCCESS: "success"
}

Shared.ServerSocketEvent = {
    SYSTEMNOTICE: "systemNotice", // notices from server unrelated to the happenings inside the game
    INITIALSTATUSREPLY: "initialStatusReply", // excludes state details
    STATUSREPLY: "statusReply", // reply to STATUSREQUEST by client containing game information
    GAMEACTION: "gameAction", // action related to the context of the game itself
    LOBBYUPDATE: "lobbyUpdate", // update to the status of the game lobby (e.g. a player joins/leaves a game)
    LOBBYSTATEREPLY: "lobbyState", // message containing complete state of lobby
    LOBBYGAMESTATEREPLY: "lobbyGameState", // message containing complete state of a lobby game
    LOBBYUPDATESSUBSCRIBED: "lobbyUpdatesSubscribed", // confirmation that lobby updates room has been joined
    LOBBYUPDATESUNSUBSCRIBED: "lobbyUpdatesUnsubscribed",
    CREATEGAMEOUTCOME: "createGameOutcome", // outcome of a create game request, enumerated in CreateGameOutcome
    LEAVEGAMEOUTCOME: "leaveGameOutcome",
    JOINGAMEOUTCOME: "joinGameOutcome",
    GAMESTARTED: "gameStarted", // sent when the last player joins a lobby game and the game controller is created
    // clients must request initial status update via GAMEACTION message
    GAMEENDED: "gameEnded", // clients are notified of the start to a game via GAMEACTION messages
    REMOVEDFROMGAME: "removedFromGame" // removed from game due to exceptional circumstances
}

Shared.ClientSocketEvent = {
    GAMEACTION: "gameAction", // action related to the context of the game itself
    INITIALSTATUSREQUEST: "initialStatusRequest", // request for reply that excludes state details
    STATUSREQUEST: "statusRequest", // request from client asking for the client's status (e.g. whether it is in a game)
    LOBBYSTATEREQUEST: "lobbyStateRequest", // client message asking for complete state of lobby
    LOBBYGAMESTATEREQUEST: "lobbyGameStateRequest",
    SUBSCRIBELOBBYUPDATES: "subscribeLobbyUpdates", // request to join lobby updates room
    UNSUBSCRIBELOBBYUPDATES: "unsubscribeLobbyUpdates",
    JOINGAME: "joinGame",
    CREATEGAME: "createGame",
    LEAVEGAME: "leaveGame" // leave game in lobby, before it has started. Currenlty no way to leave started games.
}

Shared.StatusType = {
    INGAME: "inGame",
    INLOBBYGAME: "inLobbyGame",
    INLOBBY: "inLobby"
}

Shared.LobbyGameStateRequestOutcome = {
    SUCCESS: "success",
    NOTINLOBBYGAME: "notInLobbyGame"
}

Shared.CreateGameOutcome = {
    ALREADYINGAME: "alreadyInGame",
    MISSINGINFO: "missingInfo",
    NAMEEXISTS: "nameExists",
    NOTENOUGHPLAYERS: "notEnoughPlayers",
    TOOMANYWEREWOLVES: "tooManyWerewolves",
    NOTENOUGHWEREWOLVES: "notEnoughWerewolves",
    INTERNALERROR: "internalError",
    SUCCESS: "success"
}

Shared.LeaveGameOutcome = {
    NOTINGAME: "notInGame",
    GAMESTARTED: "gameStarted",
    INTERNALERROR: "internalError",
    SUCCESS: "success"
}

Shared.JoinGameOutcome = {
    MISSINGINFO: "missingInfo",
    ALREADYINGAME: "alreadyInGame",
    GAMESTARTED: "gameStarted", // game started as a result of player joining
    DOESNOTEXIST: "doesNotExist",
    SUCCESS: "success",
    INTERNALERROR: "internalError"
}

Shared.LobbyUpdate = {
    GAMECREATED: "gameCreated",
    PLAYERLEFT: "playerLeft",
    PLAYERJOINED: "playerJoined",
    GAMEDELETED: "gameDeleted",
    GAMESTARTED: "gameStarted"
}

module.exports = Shared