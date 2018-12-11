/*
Component for in game "daytime" phase.
Required props:
username - the name of the player
playerIsWerewolf - boolean value indicating whether the player is a werewolf
livingWerewolves - Set of living werewolves. Only applicable if the player is a werewolf
livingVillagers - Set of living villagers
deadWerewolves - Set of dead werewolves. Only applicable if the player is a werewolf
deadVillagers - Set of dead villagers
sendSuggestion(player) - function to send suggestion to server
*/

import React, {Component} from "react"
import "./InGameDaytime.css"
import sunWithClouds from "./sun-with-clouds.svg"
import "./images.css"

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
        let playerTypeText = null
        let playerAliveText = null
        let livingVillagersRows = null
        let deadVillagersTable = null
        let livingWerewolvesTable = null
        let deadWerewolvesTable = null
        let villagersLabel = null // heading of villagers table, if the player is a villager,
        // use the word "player" to not imply that all the players in the table are villagers
        // instead of werewolves
        let instructionText = null
        let suggestButtonArea = null
        const suggestButton = <button onClick={this.handleSuggest} 
            disabled={!this.state.selectedPlayer}>Suggest</button>
        if(this.props.playerIsWerewolf){
            villagersLabel = "Villagers"
            playerTypeText = "werewolf"
            if(this.props.deadWerewolves.size > 0){
                const deadWerewolvesRows = Array.from(this.props.deadWerewolves).map((player) => {
                    return (
                        <tr key={player}
                            className="player-list__row">
                            <td>{player}</td>
                        </tr>
                    )
                })
                deadWerewolvesTable = (
                    <table>
                        <thead>
                            <tr>
                                <th>Dead Werewolves</th>
                            </tr>
                        </thead>
                        <tbody>{deadWerewolvesRows}</tbody>
                    </table>
                )
            }
            let livingWerewolvesRows = null
            if(this.props.livingWerewolves.has(this.props.username)){
                playerAliveText = "alive"
                instructionText = 'Waiting for a player to suggest a target for execution. ' + 
                    'You may suggest a target yourself by selecting a player and clicking "Suggest".'
                suggestButtonArea = suggestButton
                if(this.props.livingWerewolves.size > 0){
                    livingWerewolvesRows =  Array.from(this.props.livingWerewolves).map((player) => {
                        return (
                            <tr key={player} onClick={() => this.handleClickPlayer(player)}
                                className={player === this.state.selectedPlayer ? 
                                    "player-list__row--selected" : "player-list__row"}>
                                <td>{player}</td>
                            </tr>
                        )
                    })
                }
                if(this.props.livingVillagers.size > 0){
                    livingVillagersRows =  Array.from(this.props.livingVillagers).map((player) => {
                        return (
                            <tr key={player} onClick={() => this.handleClickPlayer(player)}
                                className={player === this.state.selectedPlayer ? 
                                    "player-list__row--selected" : "player-list__row"}>
                                <td>{player}</td>
                            </tr>
                        )
                    })
                }
            }
            else{
                playerAliveText = "dead"
                instructionText = "Waiting for a player to suggest a target for execution. " + 
                    "Since you are dead, you cannot make a suggestion."
                if(this.props.livingWerewolves.size > 0){
                    livingWerewolvesRows = Array.from(this.props.livingWerewolves).map((player) => {
                        return (
                            <tr key={player} className="player-list__row">
                                <td>{player}</td>
                            </tr>
                        )
                    })
                }
                if(this.props.livingVillagers.size > 0){
                    livingVillagersRows = Array.from(this.props.livingVillagers).map((player) => {
                        return (
                            <tr key={player} onClick={() => this.handleClickPlayer(player)}
                                className="player-list__row">
                                <td>{player}</td>
                            </tr>
                        )
                    })
                }
            }
            if(livingWerewolvesRows){
                livingWerewolvesTable = (
                    <table>
                        <thead>
                            <tr>
                                <th>Living Werewolves</th>
                            </tr>
                        </thead>
                        <tbody>{livingWerewolvesRows}</tbody>
                    </table>
                )
            }
        }
        else{
            playerTypeText = "villager"
            villagersLabel = "Players"
            if(this.props.livingVillagers.has(this.props.username)){
                instructionText = 'Waiting for a player to suggest a target for execution. ' + 
                    'You may suggest a target yourself by selecting a player and clicking "Suggest".'
                playerAliveText = "alive"
                suggestButtonArea = suggestButton
                if(this.props.livingVillagers.size > 0){
                    livingVillagersRows =  Array.from(this.props.livingVillagers).map((player) => {
                        return (
                            <tr key={player} onClick={() => this.handleClickPlayer(player)}
                                className={player === this.state.selectedPlayer ? 
                                    "player-list__row--selected" : "player-list__row"}>
                                <td>{player}</td>
                            </tr>
                        )
                    })
                }
            }
            else{
                instructionText = "Waiting for a player to suggest a target for execution. " + 
                    "Since you are dead, you cannot make a suggestion."
                playerAliveText = "dead"
                if(this.props.livingVillagers.size > 0){
                    livingVillagersRows = Array.from(this.props.livingVillagers).map((player) => {
                        return (
                            <tr key={player} onClick={() => this.handleClickPlayer(player)}
                                className="player-list__row">
                                <td>{player}</td>
                            </tr>
                        )
                    })
                }
            }
        }
        if(this.props.deadVillagers.size > 0){
            const deadVillagersRows = Array.from(this.props.deadVillagers).map((player) => {
                return (
                    <tr key={player}
                        className="player-list__row">
                        <td>{player}</td>
                    </tr>
                )
            })
            deadVillagersTable = (
                <table>
                    <thead>
                        <tr>
                            <th>Dead {villagersLabel}</th>
                        </tr>
                    </thead>
                    <tbody>{deadVillagersRows}</tbody>
                </table>
            )
        }
        let livingVillagersTable = null
        if(livingVillagersRows){
            livingVillagersTable = (
                <table>
                    <thead>
                        <tr>
                            <th>Living {villagersLabel}</th>
                        </tr>
                    </thead>
                    <tbody>{livingVillagersRows}</tbody>
                </table>
            )
        }
        return (
            <div>
                <img className="sun-with-clouds" src={sunWithClouds}
                    alt="Sun, a blue sky, and clouds indicating daytime." />
                <h3>It is the daytime.</h3>
                <p>You are a {playerTypeText} and you are {playerAliveText}.</p>
                <p>In this phase, someone must suggest a living player to execute. 
                    First come first serve.</p>
                {livingVillagersTable}
                {livingWerewolvesTable}
                {deadVillagersTable}
                {deadWerewolvesTable}
                <p>{instructionText}</p>
                {suggestButtonArea}
            </div>
        )
    }
}

export default InGameDaytime