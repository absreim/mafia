/*
Waiting room after a user joins a game.
Required props:
gameName - name of the game to which the player is joined
gameState - Shared.LobbyGameState object containing the state
of the game
leaveGame() - function to leave the game
sendChatMessage(text) - function to send a chat message
chatMessages - array containing objects representing previously
received chat messages
*/

import React, {Component} from "react"
import Chat from "./Chat"
import "./LobbyGameWaiting.css"

class LobbyGameWaiting extends Component {
    constructor(props){
        super(props)
        this.handleLeave = this.handleLeave.bind(this)
    }
    handleLeave(){
        this.props.leaveGame()
    }
    render(){
        let playerRows = null
        if(this.props.gameState.players){
            playerRows = this.props.gameState.players.map((player) => 
                <tr key={player}>
                    <td>{player}</td>
                </tr>
            )
        }
        return(
            <div className="lobby-game__root-container">
                <div>
                    <h3>In Game: {this.props.gameName}</h3>
                    <p>Waiting for players. Game will start automatically when needed number of players is reached.</p>
                    <p>Needed number of players: {this.props.gameState.maxPlayers}</p>
                    <p>Number of werewolves: {this.props.gameState.numWerewolves}</p>
                    <p>Number of players currently joined: {this.props.gameState.players.length}</p>
                    <table>
                        <thead>
                            <tr>
                                <th>Players in Game</th>
                            </tr>
                        </thead>
                        <tbody>{playerRows}</tbody>
                    </table>
                    <button onClick={this.handleLeave}>Leave Game</button>
                </div>
                <div>
                    <h4 className="lobby-game__chat-title">Chat Room</h4>
                    <Chat chatMessages={this.props.chatMessages} 
                            sendMessage={this.props.sendChatMessage} />
                </div>
            </div>
        )
    }
}

export default LobbyGameWaiting