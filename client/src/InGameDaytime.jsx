/*
Component for in game "daytime" phase.
Required props:
username - the name of the player
playerIsWerewolf - boolean value indicating whether the player is a werewolf
livingWerewolves - array of living werewolves. Only applicable if the player is a werewolf
livingVillagers - array of living villagers
deadWerewolves - array of dead werewolves. Only applicable if the player is a werewolf
deadVillagers - array of dead villagers
sendSuggestion(player) - function to send suggestion to server
*/

import React, {Component} from "react"
import "./InGameDaytime.css"

class InGameDaytime extends Component{
    constructor(props){
        super(props)
        this.state = {
            selectedPlayer: null
        }
        this.handleSuggest = this.handleSuggest.bind(this)
    }
    handleClickPlayer(player){
        this.setState({selectedPlayer: player})
    }
    handleSuggest(){
        this.props.sendSuggestion(this.state.selectedPlayer)
    }
    render(){
        if(this.props.playerIsWerewolf){
            const deadVillagersRows = Array.from(this.props.deadVillagers).map((player) => {
                return (
                    <tr key={player}
                        className="player-list__row">
                        <td>{player}</td>
                    </tr>
                )
            })
            const deadWerewolvesRows = Array.from(this.props.deadWerewolves).map((player) => {
                return (
                    <tr key={player}
                        className="player-list__row">
                        <td>{player}</td>
                    </tr>
                )
            })
            if(this.props.livingWerewolves.has(this.props.username)){
                const livingVillagersRows =  Array.from(this.props.livingVillagers).map((player) => {
                    return (
                        <tr key={player} onClick={() => this.handleClickPlayer(player)}
                            className={player === this.state.selectedPlayer ? "player-list__row--selected" : "player-list__row"}>
                            <td>{player}</td>
                        </tr>
                    )
                })
                const livingWerewolvesRows =  Array.from(this.props.livingWerewolves).map((player) => {
                    return (
                        <tr key={player} onClick={() => this.handleClickPlayer(player)}
                            className={player === this.state.selectedPlayer ? "player-list__row--selected" : "player-list__row"}>
                            <td>{player}</td>
                        </tr>
                    )
                })
                return (
                    <div>
                        <h2>It is the daytime.</h2>
                        <p>You are a werewolf and you are alive.</p>
                        <p>In this phase, someone must suggest a living player to execute. First come first serve.</p>
                        <table>
                            <thead>
                                <tr>
                                    <th>Living Villagers</th>
                                </tr>
                            </thead>
                            <tbody>{livingVillagersRows}</tbody>
                        </table>
                        <table>
                            <thead>
                                <tr>
                                    <th>Living Werewolves</th>
                                </tr>
                            </thead>
                            <tbody>{livingWerewolvesRows}</tbody>
                        </table>
                        <table>
                            <thead>
                                <tr>
                                    <th>Dead Villagers</th>
                                </tr>
                            </thead>
                            <tbody>{deadVillagersRows}</tbody>
                        </table>
                        <table>
                            <thead>
                                <tr>
                                    <th>Dead Werewolves</th>
                                </tr>
                            </thead>
                            <tbody>{deadWerewolvesRows}</tbody>
                        </table>
                        <p>Waiting for a player to suggest a target for execution.
                            You may suggest a target yourself by selecting a player and clicking "Suggest".</p>
                        <button onClick={this.handleSuggest} 
                            disabled={!this.state.selectedPlayer}>Suggest</button>
                    </div>
                )
            }
            else{
                const livingVillagersRows = Array.from(this.props.livingVillagers).map((player) => {
                    return (
                        <tr key={player} onClick={() => this.handleClickPlayer(player)}
                            className="player-list__row">
                            <td>{player}</td>
                        </tr>
                    )
                })
                const livingWerewolvesRows = Array.from(this.props.livingWerewolves).map((player) => {
                    return (
                        <tr key={player} onClick={() => this.handleClickPlayer(player)}
                            className="player-list__row">
                            <td>{player}</td>
                        </tr>
                    )
                })
                return (
                    <div>
                        <h2>It is the daytime.</h2>
                        <p>You are a werewolf and you are dead.</p>
                        <p>In this phase, someone must suggest a living player to execute. First come first serve.</p>
                        <table>
                            <thead>
                                <tr>
                                    <th>Living Villagers</th>
                                </tr>
                            </thead>
                            <tbody>{livingVillagersRows}</tbody>
                        </table>
                        <table>
                            <thead>
                                <tr>
                                    <th>Living Werewolves</th>
                                </tr>
                            </thead>
                            <tbody>{livingWerewolvesRows}</tbody>
                        </table>
                        <table>
                            <thead>
                                <tr>
                                    <th>Dead Villagers</th>
                                </tr>
                            </thead>
                            <tbody>{deadVillagersRows}</tbody>
                        </table>
                        <table>
                            <thead>
                                <tr>
                                    <th>Dead Werewolves</th>
                                </tr>
                            </thead>
                            <tbody>{deadWerewolvesRows}</tbody>
                        </table>
                        <p>Waiting for a player to suggest a target for execution. Since you are dead, you
                            cannot make a suggestion.</p>
                    </div>
                )
            }
        }
        else{
            const deadPlayersRows = Array.from(this.props.deadVillagers).map(
                (player) => {
                    return(
                        <tr key={player}
                            className="player-list__row">
                            <td>{player}</td>
                        </tr>
                    )
                    
                }
            )
            if(this.props.livingVillagers.has(this.props.username)){
                const livingPlayersRows = Array.from(this.props.livingVillagers).map(
                    (player) => {
                        return(
                            <tr key={player} onClick={() => this.handleClickPlayer(player)}
                                className={player === this.state.selectedPlayer ? "player-list__row--selected" : "player-list__row"}>
                                <td>{player}</td>
                            </tr>
                        )

                    }
                )
                return (
                    <div>
                        <h2>It is the daytime.</h2>
                        <p>You are a villager and you are alive.</p>
                        <p>In this phase, someone must suggest a living player to execute. First come first serve.</p>
                        <table>
                            <thead>
                                <tr>
                                    <th>Living Players</th>
                                </tr>
                            </thead>
                            <tbody>{livingPlayersRows}</tbody>
                        </table>
                        <table>
                            <thead>
                                <tr>
                                    <th>Dead Players</th>
                                </tr>
                            </thead>
                            <tbody>{deadPlayersRows}</tbody>
                        </table>
                        <p>Waiting for a player to suggest a target for execution.
                            You may suggest a target yourself by selecting a player and clicking "Suggest".</p>
                        <button onClick={this.handleSuggest} 
                            disabled={!this.state.selectedPlayer}>Suggest</button>
                    </div>
                )
            }
            else{
                const livingPlayersRows = Array.from(this.props.livingVillagers).map(
                    (player) => {
                        return(
                            <tr key={player} className="player-list__row">
                                <td>{player}</td>
                            </tr>
                        )
                    }
                )
                return (
                    <div>
                        <h2>It is the daytime.</h2>
                        <p>You are a villager and you are dead.</p>
                        <p>In this phase, someone must suggest a living player to execute. First come first serve.</p>
                        <table>
                            <thead>
                                <tr>
                                    <th>Living Players</th>
                                </tr>
                            </thead>
                            <tbody>{livingPlayersRows}</tbody>
                        </table>
                        <table>
                            <thead>
                                <tr>
                                    <th>Dead Players</th>
                                </tr>
                            </thead>
                            <tbody>{deadPlayersRows}</tbody>
                        </table>
                        <p>Waiting for a player to suggest a target for execution. Since you are dead, you
                            cannot make a suggestion.</p>
                    </div>
                )
            }
        }
    }
}

export default InGameDaytime