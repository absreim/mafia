/*
Component for in game "nighttime" phase.
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
import "./InGameNighttime.css"

class InGameNighttime extends Component{
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
            const livingWerewolvesRows =  Array.from(this.props.livingWerewolves).map((player) => {
                return (
                    <tr key={player} className="player-list__row">
                        <td>{player}</td>
                    </tr>
                )
            })
            let livingVillagersRows = null
            let statusDescText = null
            let interactionArea = null
            if(this.props.livingWerewolves.has(this.props.username)){
                livingVillagersRows =  Array.from(this.props.livingVillagers).map((player) => {
                    return (
                        <tr key={player} onClick={() => this.handleClickPlayer(player)}
                            className={player === this.state.selectedPlayer ? "player-list__row--selected" : "player-list__row"}>
                            <td>{player}</td>
                        </tr>
                    )
                })
                statusDescText = "As a living werewolf, you may suggest a living villager to kill."
                interactionArea = (
                    <React.Fragment>
                        <p>Waiting for a werewolf to suggest a target for killing.
                        You may suggest a target yourself by selecting a player and clicking "Suggest".</p>
                        <button onClick={this.handleSuggest} 
                        disabled={!this.state.selectedPlayer}>Suggest</button>
                    </React.Fragment>
                )
            }
            else{
                livingVillagersRows =  Array.from(this.props.livingVillagers).map((player) => {
                    return (
                        <tr key={player} className="player-list__row">
                            <td>{player}</td>
                        </tr>
                    )
                })
                statusDescText = "As a dead werewolf, you cannot suggest a target."
                interactionArea = (
                    <p>Waiting for a werewolf to suggest a target for killing.</p>
                )
            }
            return(
                <div>
                    <h2>It is the nighttime.</h2>
                    <p>In this phase, werewolves choose a villager to kill and vote on the killing.</p>
                    <p>{statusDescText}</p>
                    <table>
                        <caption>List of living villagers.</caption>
                        <thead>
                            <tr>
                                <th>Living Villagers</th>
                            </tr>
                        </thead>
                        <tbody>{livingVillagersRows}</tbody>
                    </table>
                    <table>
                        <caption>List of living werewolves.</caption>
                        <thead>
                            <tr>
                                <th>Living Werewolves</th>
                            </tr>
                        </thead>
                        <tbody>{livingWerewolvesRows}</tbody>
                    </table>
                    <table>
                        <caption>List of dead villagers.</caption>
                        <thead>
                            <tr>
                                <th>Dead Villagers</th>
                            </tr>
                        </thead>
                        <tbody>{deadVillagersRows}</tbody>
                    </table>
                    <table>
                        <caption>List of dead werewolves.</caption>
                        <thead>
                            <tr>
                                <th>Dead Werewolves</th>
                            </tr>
                        </thead>
                        <tbody>{deadWerewolvesRows}</tbody>
                    </table>
                    {interactionArea}
                </div>
            )
        }
        else{
            const livingPlayersRows = Array.from(this.props.livingVillagers).map(
                (player) => {
                    return(
                        <tr key={player}>
                            <td>{player}</td>
                        </tr>
                    )
                }
            )
            const deadPlayersRows = Array.from(this.props.deadVillagers).map(
                (player) => {
                    return(
                        <tr key={player}>
                            <td>{player}</td>
                        </tr>
                    )
                }
            )
            let statusDescText = null
            if(this.props.livingVillagers.has(this.props.username)){
                statusDescText = "As a villager you are currently sleeping and must wait until the daytime."
            }
            else{
                statusDescText = "You are a dead villager."
            }
            return (
                <div>
                    <h2>It is the nighttime.</h2>
                    <p>In this phase, werewolves choose a villager to kill.</p>
                    <p>{statusDescText}</p>
                    <table>
                        <caption>List of living players.</caption>
                        <thead>
                            <tr>
                                <th>Living Players</th>
                            </tr>
                        </thead>
                        <tbody>{livingPlayersRows}</tbody>
                    </table>
                    <table>
                        <caption>List of dead players.</caption>
                        <thead>
                            <tr>
                                <th>Dead Players</th>
                            </tr>
                        </thead>
                        <tbody>{deadPlayersRows}</tbody>
                    </table>
                    <p>Waiting for a werewolf to suggest a target for killing.</p>
                </div>
            )
        }
    }
}

export default InGameNighttime