/* High level component for contents of the game. */

import React, {Component} from "react"
import io from "socket.io-client"
import Shared from "./Shared"
import Lobby from "./Lobby"
import CreateGame from "./CreateGame"
import LobbyGameWaiting from "./LobbyGameWaiting"
import InGame from "./InGame"

const GameContentPhase = {
    INITIAL: "initial",
    AWAITINGINITIALSTATUS: "awaitingInitialStatus",
    PREVIOUSSTATUSPAGE: "previousStatusPage",
    INLOBBY: "inLobby",
    CREATEGAME: "createGame",
    INLOBBYGAME: "inLobbyGame",
    INGAME: "inGame",
    DISCONNECTED: "disconnected"
}

class GameContent extends Component{
    constructor(props){
        super(props)
        this.state = {
            phase: GameContentPhase.INITIAL,
            socket: null,
            socketConnectError: null,
            socketConnectTimeout: null,
            socketGeneralError: null,
            gameState: null,
            lobbyState: null,
            lobbyGameState: null,
            lobbyUpdatesSubscribed: false, // protects against an unlikely race condition
            gameName: null,
            isLobbyGame: false,
            message: null
        }
        this.handleMainMenu = this.handleMainMenu.bind(this)
        this.connectSocket = this.connectSocket.bind(this)
        this.handleContinue = this.handleContinue.bind(this)
        this.navigateCreate = this.navigateCreate.bind(this)
        this.joinGame = this.joinGame.bind(this)
        this.leaveGame = this.leaveGame.bind(this)
        this.createGame = this.createGame.bind(this)
        this.sendGameMessage = this.sendGameMessage.bind(this)
        this.navigateLobbyFromCreate = this.navigateLobbyFromCreate.bind(this)
    }
    componentDidMount(){
        const socket = io({
            autoConnect: false,
            reconnection: false
        })
        socket.on("connect", (function(){
            this.setState({
                socketConnectError: null,
                socketConnectTimeout: null,
                socketGeneralError: null,
                gameState: null,
                lobbyState: null,
                lobbyGameState: null,
                lobbyUpdatesSubscribed: false,
                gameName: null,
                phase: GameContentPhase.AWAITINGINITIALSTATUS
            })
            socket.emit(Shared.ClientSocketEvent.INITIALSTATUSREQUEST)
        }).bind(this))
        socket.on("disconnect", (function(){
            this.setState({
                socketConnectError: null,
                socketConnectTimeout: null,
                socketGeneralError: null,
                gameState: null,
                lobbyState: null,
                lobbyGameState: null,
                lobbyUpdatesSubscribed: false,
                gameName: null,
                phase: GameContentPhase.DISCONNECTED
            })
        }).bind(this))
        socket.on("connect_error", (function(error){
            this.setState({
                socketConnectError: error,
                socketConnectTimeout: null,
                socketGeneralError: null,
            })
            console.log("Error encountered while trying to establish socket.io connection: " + error)
        }).bind(this))
        socket.on("connect_timeout", (function(timeout){
            this.setState({
                socketConnectError: null,
                socketConnectTimeout: timeout,
                socketGeneralError: null
            })
            console.log("Timeout reached while trying to establish socket.io connection: " + timeout)
        }).bind(this))
        socket.on("error", (function(error){
            this.setState({
                socketConnectError: null,
                socketConnectTimeout: null,
                socketGeneralError: error
            })
            console.log("Error encountered by the socket.io client: " + error)
        }).bind(this))
        socket.on(Shared.ServerSocketEvent.INITIALSTATUSREPLY, (function(data){
            switch(data.type){
                case Shared.StatusType.INGAME:
                    this.setState({
                        isLobbyGame: false,
                        gameName: data.gameName,
                        gameState: null,
                        phase: GameContentPhase.PREVIOUSSTATUSPAGE
                    })
                    break
                case Shared.StatusType.INLOBBYGAME:
                    this.setState({
                        isLobbyGame: true,
                        gameName: data.gameName,
                        lobbyGameState: null,
                        phase: GameContentPhase.PREVIOUSSTATUSPAGE
                    })
                    break
                case Shared.StatusType.INLOBBY:
                    this.setState({
                        lobbyState: null,
                        lobbyGameState: null,
                        gameName: null,
                        gameState: null,
                        phase: GameContentPhase.PREVIOUSSTATUSPAGE
                    })
                    break
                default:
                    this.setState({message: "Unrecognized type in status message received."})
            }
        }).bind(this))
        socket.on(Shared.ServerSocketEvent.STATUSREPLY, (function(data){
            switch(data.type){
                case Shared.StatusType.INGAME:
                    this.setState({
                        phase: GameContentPhase.INGAME,
                        isLobbyGame: false,
                        gameName: data.gameName,
                        gameState: data.gameState
                    })
                    break
                case Shared.StatusType.INLOBBYGAME:
                    this.setState({
                        isLobbyGame: true,
                        gameName: data.gameName,
                        lobbyGameState: data.gameState,
                        phase: GameContentPhase.INLOBBYGAME
                    })
                    break
                case Shared.StatusType.INLOBBY:
                    if(this.state.lobbyUpdatesSubscribed){
                        this.setState({
                            phase: GameContentPhase.INLOBBY,
                            lobbyState: data.lobbyState,
                            lobbyGameState: null,
                            gameName: null,
                            gameState: null
                        })
                    }
                    else{
                        this.setState({
                            phase: GameContentPhase.INLOBBY,
                            lobbyState: null,
                            lobbyGameState: null,
                            gameName: null,
                            gameState: null
                        })
                        this.state.socket.emit(Shared.ClientSocketEvent.SUBSCRIBELOBBYUPDATES)
                    }
                    break
                default:
                    this.setState({message: "Unrecognized type in status message received."})
            }
        }).bind(this))
        socket.on(Shared.ServerSocketEvent.LOBBYSTATEREPLY, (function(data){
            if(data){
                this.setState({lobbyState: data})
            }
            else{
                console.log("Warning: received no data in message about lobby state.")
            }
        }).bind(this))
        socket.on(Shared.ServerSocketEvent.LOBBYUPDATESSUBSCRIBED, (function(){
            if(!this.state.lobbyUpdatesSubscribed){
                this.setState({lobbyUpdatesSubscribed: true})
                if(!this.state.lobbyState){
                    this.state.socket.emit(Shared.ClientSocketEvent.LOBBYSTATEREQUEST)
                }
            }
            else{
                console.log("Info: possible race condition encountered. LOBBYUPDATESSUBSCRIBED message received from server at unexpected time.")
            }
        }).bind(this))
        socket.on(Shared.ServerSocketEvent.LOBBYUPDATESUNSUBSCRIBED, (function(){
            if(this.state.lobbyUpdatesSubscribed){
                this.setState({lobbyUpdatesSubscribed: false})
            }
            else{
                console.log("Info: possible race condition encountered. LOBBYUPDATESUNSUBSCRIBED message received from server at unexpected time.")
            }
        }).bind(this))
        socket.on(Shared.ServerSocketEvent.LOBBYUPDATE, (function(data){
            if(this.state.lobbyUpdatesSubscribed && this.state.lobbyState){
                if(data.type === Shared.LobbyUpdate.GAMECREATED){
                    if(data.game && data.numPlayers && data.numWerewolves && data.player){
                        const newLobbyState = {}
                        for(let gameName in Object.keys(this.state.lobbyState)){
                            newLobbyState[gameName] = this.cloneLobbyGameState(this.state.lobbyState[gameName])
                        }
                        newLobbyState[data.game] = new Shared.LobbyGameState(data.numPlayers, data.numWerewolves)
                        newLobbyState[data.game].players = [data.player]
                        this.setState({lobbyState: newLobbyState})
                    }
                    else{
                        console.log("Warning: \"game created\" lobby state update received without all expected fields.")
                    }
                }
                else if(data.type === Shared.LobbyUpdate.GAMEDELETED || data.type === Shared.LobbyUpdate.GAMESTARTED){
                    if(data.game){
                        const newLobbyState = {}
                        for(let gameName of Object.keys(this.state.lobbyState)){
                            if(gameName !== data.game){
                                newLobbyState[gameName] = this.cloneLobbyGameState(this.state.lobbyState[gameName])
                            }
                        }
                        this.setState({lobbyState: newLobbyState})
                    }
                    else{
                        console.log("Warning: \"game deleted\" lobby state update received without game name.")
                    }
                }
                else if(data.type === Shared.LobbyUpdate.PLAYERJOINED){
                    if(data.game && data.player){
                        const newLobbyState = {}
                        for(let gameName of Object.keys(this.state.lobbyState)){
                            newLobbyState[gameName] = this.cloneLobbyGameState(this.state.lobbyState[gameName])
                        }
                        if(newLobbyState[data.game]){
                            newLobbyState[data.game].players.push(data.player)
                        }
                        else{
                            console.log("Warning: game specified in \"player joined\" lobby update does not exist.")
                        }
                        this.setState({lobbyState: newLobbyState})
                    }
                    else{
                        console.log("Warning: \"player joined\" lobby state update received without all required fields.")
                    }
                }
                else if(data.type === Shared.LobbyUpdate.PLAYERLEFT){
                    if(data.game && data.player){
                        const newLobbyState = {}
                        for(let gameName of Object.keys(this.state.lobbyState)){
                            newLobbyState[gameName] = this.cloneLobbyGameState(this.state.lobbyState[gameName])
                        }
                        if(newLobbyState[data.game]){
                            newLobbyState[data.game].players = newLobbyState[data.game].players.filter(
                                (player) => (player !== data.player))
                        }
                        else{
                            console.log("Warning: game specified in \"player left\" lobby update does not exist.")
                        }
                        this.setState({lobbyState: newLobbyState})
                    }
                    else{
                        console.log("Warning: \"player left\" lobby state update received without all required fields.")
                    }
                }
                else{
                    console.log("Warning: unrecognized lobby state update message type received.")
                }
            }
        }).bind(this))
        socket.on(Shared.ServerSocketEvent.CREATEGAMEOUTCOME, (function(data){
            // no effort made to preserve order when it comes to requests and outcomes, since
            // the client is forced to accept whatever ultimate outcome is given the client last
            switch(data.type){
                case Shared.CreateGameOutcome.SUCCESS:
                    this.setState({
                        phase: GameContentPhase.INLOBBYGAME,
                        isLobbyGame: true,
                        lobbyGameState: data.gameState,
                        gameName: data.gameName
                    })
                    this.state.socket.emit(Shared.ClientSocketEvent.UNSUBSCRIBELOBBYUPDATES)
                    break
                case Shared.CreateGameOutcome.ALREADYINGAME:
                    this.setState({message: "Server reports that you are already in a game and must leave it before creating a new one. Please report this issue and try again later."})
                    this.requestStateDetails()
                    break
                case Shared.CreateGameOutcome.TOOMANYWEREWOLVES:
                    this.setState({message: "Server reports that the game creation request specified too many werewolves. This outcome implies a inconsistency between the client and server. Please report this issue and try a smaller number of werewolves."})
                    break
                case Shared.CreateGameOutcome.NOTENOUGHWEREWOLVES:
                    this.setState({message: "Server reports that the game creation request specified too few werewolves. This outcome implies a inconsistency between the client and server. Please report this issue and try a larger number of werewolves."})
                    break
                case Shared.CreateGameOutcome.NOTENOUGHPLAYERS:
                    this.setState({message: "Server reports that the game creation request specified too few players. This outcome implies a inconsistency between the client and server. Please report this issue and try a larger number of players."})
                    break
                case Shared.CreateGameOutcome.NAMEEXISTS:
                    this.setState({message: "There already exists a game with the name you tried to create. Please use a different name."})
                    break
                case Shared.CreateGameOutcome.MISSINGINFO:
                    this.setState({message: "Protocol mismatch between the client and server. Please report this issue and try again later."})
                    break
                case Shared.CreateGameOutcome.INTERNALERROR:
                    this.setState({message: "Internal error encountered by server when processing request to create game. Please try again later."})
                    break
                default:
                    this.setState({message: "Unrecognized message received from server in response to request to create game. Please report this issue and try again later."})
            }
        }).bind(this))
        socket.on(Shared.ServerSocketEvent.JOINGAMEOUTCOME, (function(data){
            switch(data.type){
                case Shared.JoinGameOutcome.SUCCESS:
                    this.setState({
                        phase: GameContentPhase.INLOBBYGAME,
                        isLobbyGame: true,
                        lobbyGameState: data.gameState,
                        gameName: data.gameName
                    })
                    break
                case Shared.JoinGameOutcome.ALREADYINGAME:
                    this.setState({message: "Server reports that you are already in a game and must leave it before joining a new one. Please report this issue and try again later."})
                    this.requestStateDetails()
                    break
                case Shared.JoinGameOutcome.DOESNOTEXIST:
                    this.setState({message: "Server reports that the game you are trying to join does not exist. It may have been deleted. Please choose a different game."})
                    break
                case Shared.JoinGameOutcome.GAMESTARTED:
                    this.setState({message: "Server reports that the game you are trying to join has already started. Please choose a different game."})
                    break
                case Shared.JoinGameOutcome.INTERNALERROR:
                    this.setState({message: "Internal error encountered by server when processing request to join game. Please try again later."})
                    break
                case Shared.JoinGameOutcome.MISSINGINFO:
                    this.setState({message: "Protocol mismatch between the client and server. Please report this issue and try again later."})
                    break
                default:
                    this.setState({message: "Unrecognized message received from server in response to request to join game. Please report this issue and try again later."})
            }
        }).bind(this))
        socket.on(Shared.ServerSocketEvent.LEAVEGAMEOUTCOME, (function(data){
            switch(data){
                case Shared.LeaveGameOutcome.SUCCESS:
                    this.requestStateDetails()
                    break
                case Shared.LeaveGameOutcome.NOTINGAME:
                    this.setState({message: "Server reports that you tried to leave a game but was not in a game to begin with."})
                    this.requestStateDetails()
                    break
                case Shared.LeaveGameOutcome.GAMESTARTED:
                    this.setState({message: "Attempted to leave game, but the game started by the time the request was processed."})
                    this.requestStateDetails()
                    break
                case Shared.LeaveGameOutcome.INTERNALERROR:
                    this.setState({message: "Intenal server error trying to leave game. Please try again later."})
                    break
                default:
                    this.setState({message: "Unrecognized message received from server in response to request to leave game. Please report this issue and try again later."})
            }
        }).bind(this))
        socket.on(Shared.ServerSocketEvent.LOBBYGAMESTATEREPLY, (function(data){
            if(data){
                if(data.type){
                    if(data.type === Shared.LobbyGameStateRequestOutcome.SUCCESS){
                        this.setState({
                            phase: GameContentPhase.INLOBBYGAME,
                            gameName: data.gameName,
                            lobbyGameState: data.gameState
                        })
                    }
                    else if(data.type === Shared.LobbyGameStateRequestOutcome.NOTINLOBBYGAME){
                        this.setState({message: "Lobby game state update message received, " + 
                            "but server indicates that you are not in a lobby game."})
                    }
                    else{
                        this.setState({message: "Lobby game state update message received with unrecognized type code."})
                    }
                }
                else{
                    this.setState({message: "Malformed lobby game state update message received."})
                }
            }
            else{
                this.setState({message: "Lobby game state update message received, but no data was present."})
            }
        }).bind(this))
        socket.on(Shared.ServerSocketEvent.GAMESTARTED, (function(){
            if(this.state.phase !== GameContentPhase.AWAITINGINITIALSTATUS && this.state.phase !== GameContentPhase.PREVIOUSSTATUSPAGE){
                this.state.socket.emit(Shared.ClientSocketEvent.GAMEACTION, {type: Shared.ClientMessageType.GAMESTATEREQ})
            }
        }).bind(this))
        socket.on(Shared.ServerSocketEvent.GAMEACTION, (function(data){
            if(this.state.phase !== GameContentPhase.AWAITINGINITIALSTATUS && this.state.phase !== GameContentPhase.PREVIOUSSTATUSPAGE){
                if(data && data.type){
                    switch(data.type){
                        case Shared.ServerMessageType.VOTECAST:
                            if(this.state.gameState){
                                if(data.playerName && data.choice !== undefined){
                                    let newGameState = this.cloneGameState(this.state.gameState)
                                    newGameState.votes[data.playerName] = data.choice
                                    this.setState({
                                        phase: GameContentPhase.INGAME,
                                        gameState: newGameState
                                    })
                                }
                                else{
                                    console.log("Warning: received VOTECAST message missing details of the vote.")
                                }
                            }
                            else{
                                console.log("Warning: received VOTECAST message when game state is not known. Requesting game state update.")
                                this.state.socket.emit(Shared.ClientSocketEvent.GAMEACTION, Shared.ClientMessageType.GAMESTATEREQ)
                            }
                            break
                        case Shared.ServerMessageType.ACKNOWLEDGEMENT:
                            if(this.state.gameState){
                                if(data.playerName){
                                    let newGameState = this.cloneGameState(this.state.gameState)
                                    newGameState.acks.push(data.playerName)
                                    this.setState({
                                        phase: GameContentPhase.INGAME,
                                        gameState: newGameState
                                    })
                                }
                                else{
                                    console.log("Warning: received ACKNOWLEDGEMENT message missing the acknowledging player.")
                                }
                            }
                            else{
                                console.log("Warning: received VOTECAST message when game state is not known. Requesting game state update.")
                                this.state.socket.emit(Shared.ClientSocketEvent.GAMEACTION, Shared.ClientMessageType.GAMESTATEREQ)
                            }
                            break
                        case Shared.ServerMessageType.GAMESTATEINFO:
                            if(data.info){
                                this.setState({
                                    phase: GameContentPhase.INGAME,
                                    gameState: data.info
                                })
                            }
                            break
                        default:
                            console.log("Warning: GAMEACTION message received with unrecognized type.")
                    }
                }
                else{
                    console.log("Warning: received malformed GAMEACTION message.")
                }
            }
        }).bind(this))
        socket.on(Shared.ServerSocketEvent.GAMEENDED, (function(data){
            this.state.socket.emit(Shared.ClientSocketEvent.STATUSREQUEST)
        }).bind(this))
        this.setState({socket: socket})
    }
    componentWillUnmount(){
        if(this.state.socketConnected){
            this.state.socket.close()
        }
    }
    requestStateDetails(){
        this.state.socket.emit(Shared.ClientSocketEvent.STATUSREQUEST)
    }
    connectSocket(){
        this.state.socket.open()
    }
    handleMainMenu(){
        this.setState({message: null})
        this.props.handleMainMenu()
    }
    handleContinue(){
        this.setState({message: null})
        this.requestStateDetails()
    }
    navigateCreate(){
        this.setState({message: null})
        if(this.state.phase === GameContentPhase.INLOBBY){
            this.state.socket.emit(Shared.ClientSocketEvent.UNSUBSCRIBELOBBYUPDATES)
            this.setState({lobbyState: null})
            this.setState({phase: GameContentPhase.CREATEGAME})
        }
        else{
            console.log("Warning: attempt to enter create game interface from component when not in the lobby.")
        }
    }
    navigateLobbyFromCreate(){
        this.setState({message: null})
        if(this.state.phase === GameContentPhase.CREATEGAME){
            this.requestStateDetails()
        }
        else{
            console.log("Warning: function to return to lobby from create game screen called when client was not in create game screen.")
        }
    }
    createGame(name, numPlayers, numWerewolves){
        this.setState({message: null})
        if(this.state.phase === GameContentPhase.CREATEGAME){
            this.state.socket.emit(Shared.ClientSocketEvent.CREATEGAME, {
                name: name,
                numPlayers: numPlayers,
                numWerewolves: numWerewolves
            })
        }
        else{
            console.log("Warning: request to create game received when not in CREATEGAME phase.")
        }
    }
    joinGame(gameName){
        this.setState({message: null})
        this.state.socket.emit(Shared.ClientSocketEvent.JOINGAME, {name: gameName})
    }
    leaveGame(){
        this.setState({message: null})
        this.state.socket.emit(Shared.ClientSocketEvent.LEAVEGAME, {name: this.state.gameName})
    }
    sendGameMessage(message){
        this.state.socket.emit(Shared.ClientSocketEvent.GAMEACTION, message)
    }
    cloneGameState(gameState){
        if(gameState){
            if(gameState.players && gameState.votes && gameState.acks){
                let newGameState = new Shared.GameState()
                for(let player of Object.keys(gameState.players)){
                    newGameState.players[player] = new Shared.PlayerDetails(gameState.players[player].isWerewolf)
                    newGameState.players[player].isAlive = gameState.players[player].isAlive
                }
                for(let player of Object.keys(gameState.votes)){
                    newGameState.votes[player] = gameState.votes[player]
                }
                newGameState.acks = gameState.acks.slice()
                newGameState.chosenPlayer = gameState.chosenPlayer
                newGameState.phase = gameState.phase
                return newGameState
            }
        }
        else{
            return null
        }
    }
    cloneLobbyGameState(gameState){
        if(gameState){
            if(gameState.maxPlayers && gameState.numWerewolves && gameState.players){
                const newGameState = new Shared.LobbyGameState(gameState.maxPlayers, gameState.numWerewolves)
                newGameState.players = gameState.players.slice()
                return newGameState
            }
            else{
                console.log("Warning: asked to clone lobby game state object that was malformed.")
                return null
            }
        }
        else{
            return null
        }
    }
    render(){
        let content = null
        switch(this.state.phase){
            case GameContentPhase.INITIAL:
                if(this.state.socketConnectError){
                    content =
                        <div>
                            <h3>Connect to the Game</h3>
                            <p>Error connecting to server. You may try connecting again. 
                                If problem persists, please try again later.</p>
                            <button type="button" onClick={this.connectSocket}>Retry Connection</button>
                            <button type="button" onClick={this.handleMainMenu}>Return to Main Menu</button>
                        </div>
                }
                else if(this.state.socketConnectTimeout){
                    content =
                        <div>
                            <h3>Connect to the Game</h3>
                            <p>Attempt to connect to the server has timed out. 
                                You may try connecting again. If problem persists, please try again later.</p>
                            <button type="button" onClick={this.connectSocket}>Retry Connection</button>
                            <button type="button" onClick={this.handleMainMenu}>Return to Main Menu</button>
                        </div>
                }
                else{
                    content =
                        <div>
                            <h3>Connect to the Game</h3>
                            <button type="button" onClick={this.connectSocket}>Connect</button>
                            <button type="button" onClick={this.handleMainMenu}>Return to Main Menu</button>
                        </div>
                }
                break
            case GameContentPhase.AWAITINGINITIALSTATUS:
                content =
                    <div>
                        <h3>Connection Established</h3>
                        <p>Requested player status from server. Awaiting response...</p>
                        <button type="button" onClick={this.handleMainMenu}>Return to Main Menu</button>
                    </div>
                break
            case GameContentPhase.PREVIOUSSTATUSPAGE:
                if(this.state.gameName){ // splash screen to inform user that they were previously in a game and will be returned to that game
                    content =
                        <div>
                            <h3>Welcome back!</h3>
                            <p>Our records show that you were previously in the game {this.state.gameName}</p>
                            <button type="button" onClick={this.handleContinue}>Continue</button>
                        </div>
                }
                else{
                    content =
                        <div>
                            <h3>Entering Lobby</h3>
                            <p>It looks like you are not part of an existing game. Click the button below to enter the lobby where you can create a new game or join an existing game.</p>
                            <button type="button" onClick={this.handleContinue}>Continue</button>
                        </div>
                }
                break
            case GameContentPhase.INLOBBY:
                content = <Lobby lobbyGames={this.state.lobbyState} navigateCreate={this.navigateCreate} joinGame={this.joinGame} />
                break
            case GameContentPhase.CREATEGAME:
                content = <CreateGame navigateLobby={this.navigateLobbyFromCreate} createGame={this.createGame} />
                break
            case GameContentPhase.INLOBBYGAME:
                content = <LobbyGameWaiting gameName={this.state.gameName} gameState={this.state.lobbyGameState} leaveGame={this.leaveGame} />
                break
            case GameContentPhase.DISCONNECTED:
                content =
                    <div>
                        <h3>Disconnected</h3>
                        <p>You have been disconnected. You may attempt to reconnect. 
                            If you are unable to do so, please try again later.</p>
                        <button type="button" onClick={this.connectSocket}>Connect</button>
                        <button type="button" onClick={this.handleMainMenu}>Return to Main Menu</button>
                    </div>
                break
            case GameContentPhase.INGAME:
                content = <InGame gameState={this.state.gameState} sendMessage={this.sendGameMessage} username={this.props.username} />
                break
            default:
                content =
                    <div>
                        <h3>Error</h3>
                        <p>Internal error with the client application. Please try again later.</p>
                    </div>
        }
        return(
            <div>
                <p>{this.state.message}</p>
                {content}
            </div>
        )
    }
}

export default GameContent