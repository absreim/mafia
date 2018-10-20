/*
Component for in game "nighttime voting" phase.
Required props:
username - name of the player
chosenPlayer - name of the player put on trial. Only applicable if the current player is a werewolf.
playerIsWerewolf - boolean value indicating whether player is a werewolf
livingWerewolves - array of living werewolves. Only applicable if the current player is a werewolf
livingVillagers - array of living villagers. If player is a villager, contains all living players
deadWerewolves - array of dead werewolves. Only applicable if the current player is a werewolf
deadVillagers - array of dead villagers. If player is a villager, contains all dead players
votes - player name -> vote object of votes already cast, for votes false is nay and true is yea
sendVote(vote) - function to send vote to server
*/

import React, {Component} from "react"
import "./InGameNighttimeVoting.css"

class InGameNighttimeVoting extends Component{
    constructor(props){
        super(props)
        this.handleYeaVote = this.handleYeaVote.bind(this)
        this.handleNayVote = this.handleNayVote.bind(this)
    }
    handleYeaVote(){
        this.props.sendVote(true)
    }
    handleNayVote(){
        this.props.sendVote(false)
    }
    render(){
        let deadVillagersRows = null
        if(this.props.deadVillagers.size > 0){
            deadVillagersRows = Array.from(this.props.deadVillagers).map((player) => {
                return (
                    <tr key={player}>
                        <td>{player}</td>
                    </tr>
                )
            })
        }
        const livingVillagersRows = Array.from(this.props.livingVillagers).map((player) => {
            return (
                <tr key={player}>
                    <td>{player}</td>
                </tr>
            )
        })
        if(this.props.playerIsWerewolf){
            let interactionArea = null
            if(this.props.livingWerewolves.has(this.props.username)){
                interactionArea = (
                    <React.Fragment>
                        <button disabled={this.props.username in this.props.votes}
                            onClick={this.handleYeaVote}>Vote Yea</button>
                        <button disabled={this.props.username in this.props.votes}
                            onClick={this.handleNayVote}>Vote Nay</button>
                    </React.Fragment>
                )
            }
            else{
                interactionArea = (
                    <p>As a dead werewolf, you cannot vote but can observe the results.</p>
                )
            }
            let deadVillagersTable = null
            if(deadVillagersRows){
                deadVillagersTable = (
                    <table>
                        <thead>
                            <tr>
                                <th>Dead Villagers</th>
                            </tr>
                        </thead>
                        <tbody>{deadVillagersRows}</tbody>
                    </table>
                )
            }
            let deadWerewolvesTable = null
            if(this.props.deadWerewolves.size > 0){
                const deadWerewolvesRows = Array.from(this.props.deadWerewolves).map((player) => {
                    return (
                        <tr key={player}>
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
            
            const livingWerewolvesRows = Array.from(this.props.livingWerewolves).map((player) => {
                let vote = "?"
                if(player in this.props.votes){
                    if(this.props.votes[player] === true){
                        vote = "Yea"
                    }
                    else if(this.props.votes[player] === false){
                        vote = "Nay"
                    }
                }
                return (
                    <tr key={player}>
                        <td>{player}</td>
                        <td>{vote}</td>
                    </tr>
                )
            })
            return (
                <div>
                    <h2>It is time to vote on whether to kill the chosen villager.</h2>
                    <p>The chosen villager is&nbsp;
                        <span className=".chosen-player-desc__player-name">{this.props.chosenPlayer}</span>.</p>
                    <p>A simple majority is need to kill the chosen villager.</p>
                    <table>
                        <thead>
                            <tr>
                                <th colSpan="2">Living Werewolves</th>
                            </tr>
                            <tr>
                                <th>Name</th>
                                <th>Vote</th>
                            </tr>
                        </thead>
                        <tbody>{livingWerewolvesRows}</tbody>
                    </table>
                    <table>
                        <thead>
                            <tr>
                                <th>Living Villagers</th>
                            </tr>
                        </thead>
                        <tbody>{livingVillagersRows}</tbody>
                    </table>
                    {deadVillagersTable}
                    {deadWerewolvesTable}
                    {interactionArea}
                </div>
            )
        }
        else{
            let statusDescText = null
            if(this.props.livingVillagers.has(this.props.username)){
                statusDescText = "As a villager, you are currently sleeping and must wait until the daytime."
            }
            else{
                statusDescText = "You are a dead villager."
            }
            let deadPlayersTable = null
            if(deadVillagersRows){
                deadPlayersTable = (
                    <table>
                        <thead>
                            <tr>
                                <th>Dead Players</th>
                            </tr>
                        </thead>
                        <tbody>{deadVillagersRows}</tbody>
                    </table>
                )
            }
            return(
                <div>
                    <h3>Werewolves are currently voting on whether to kill a selected villager.</h3>
                    <p>{statusDescText}</p>
                    <table>
                        <thead>
                            <tr>
                                <th>Living Players</th>
                            </tr>
                        </thead>
                        <tbody>{livingVillagersRows}</tbody>
                    </table>
                    {deadPlayersTable}
                </div>
            )
        }
    }
}

export default InGameNighttimeVoting