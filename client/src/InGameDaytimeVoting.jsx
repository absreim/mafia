/*
Component for in game "daytime voting" phase.
Required props:
username - name of the player
chosenPlayer - name of the player put on trial
playerIsWerewolf - boolean value indicating whether player is a werewolf
livingWerewolves - array of living werewolves. Only applicable if the player is a werewolf
livingVillagers - array of living villagers. If player is a villager, contains all living players
deadWerewolves - array of dead werewolves. Only applicable if the player is a werewolf
deadVillagers - array of dead villagers. If player is a villager, contains all dead players
votes - player name -> vote object of votes already cast, for votes false is nay and true is yea
sendVote(vote) - function to send vote to server
*/

import React, {Component} from "react"
import "./InGameDaytimeVoting.css"

class InGameDaytimeVoting extends Component{
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
        const deadVillagersRows = Array.from(this.props.deadVillagers).map((player) => {
            return (
                <tr key={player}>
                    <td>{player}</td>
                </tr>
            )
        })
        const livingVillagersRows = Array.from(this.props.livingVillagers).map((player) => {
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
        const livingInteractionArea = 
            <React.Fragment>
                <button disabled={this.props.username in this.props.votes}
                    onClick={this.handleYeaVote}>Vote Yea</button>
                <button disabled={this.props.username in this.props.votes}
                    onClick={this.handleNayVote}>Vote Nay</button>
            </React.Fragment>
        const deadInteractionArea = <p>Waiting for players to vote. Since you are dead, you cannot vote.</p>
        if(this.props.playerIsWerewolf){
            const deadWerewolvesRows = Array.from(this.props.deadWerewolves).map((player) => {
                return (
                    <tr key={player}>
                        <td>{player}</td>
                    </tr>
                )
            })
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
            const playerIsAlive = this.props.livingWerewolves.has(this.props.username)
            const deathStatusString = playerIsAlive ? "alive" : "dead"
            const interactionArea = playerIsAlive ? livingInteractionArea : deadInteractionArea
            return(
                <div>
                    <h3>It is time to vote in the daytime to execute a suspected werewolf.</h3>
                    <p>The chosen player is&nbsp;
                        <span className=".chosen-player-desc__player-name">{this.props.chosenPlayer}</span>.</p>
                    <p>You are a werewolf and you are {deathStatusString}.</p>
                    <p>A simple majority is needed to execute the accused. Cast your vote below.</p>
                    <table>
                        <thead>
                            <tr>
                                <th colSpan="2">Living Villagers</th>
                            </tr>
                            <tr>
                                <th>Name</th>
                                <th>Vote</th>
                            </tr>
                        </thead>
                        <tbody>{livingVillagersRows}</tbody>
                    </table>
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
                    {interactionArea}
                </div>
            )
        }
        else{
            const playerIsAlive = this.props.livingVillagers.has(this.props.username)
            const deathStatusString = playerIsAlive ? "alive" : "dead"
            const interactionArea = playerIsAlive ? livingInteractionArea : deadInteractionArea
            return(
                <div>
                    <h3>It is time to vote in the daytime to execute a suspected werewolf.</h3>
                    <p>The chosen player is&nbsp;
                        <span className=".chosen-player-desc__player-name">{this.props.chosenPlayer}</span>.</p>
                    <p>You are a villager and you are {deathStatusString}.</p>
                    <p>A simple majority is needed to execute the accused. Cast your vote below.</p>
                    <table>
                        <thead>
                            <tr>
                                <th colSpan="2">Living Players</th>
                            </tr>
                            <tr>
                                <th>Name</th>
                                <th>Vote</th>
                            </tr>
                        </thead>
                        <tbody>{livingVillagersRows}</tbody>
                    </table>
                    <table>
                        <thead>
                            <tr>
                                <th>Dead Players</th>
                            </tr>
                        </thead>
                        <tbody>{deadVillagersRows}</tbody>
                    </table>
                    {interactionArea}
                </div>
            )
        }
    }
}

export default InGameDaytimeVoting