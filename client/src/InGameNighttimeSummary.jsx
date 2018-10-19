/*
Component of nighttime voting outcomes: the
"end of night" and "nighttime vote failed" phases.
Required props:
username - the current player's name
playerIsWerewolf - whether the current player
is a werewolf
voteSuccessful - whether the vote succeeded,
i.e. whether a majority of Yea votes were reached
chosenPlayer - the player subject to the vote
livingVillagers - array of living villagers. If player is a villager, contains all living players
deadWerewolves - array of dead werewolves. Only applicable if the current player is a werewolf
deadVillagers - array of dead villagers. If player is a villager, contains all dead players
votes - object of player name => vote cast.
true is Yea.
false is Nay.
sendAck - function to send ack to server
*/

import React, {Component} from "react"
import "./InGameNighttimeSummary.css"

class InGameNighttimeSummary extends Component{
    constructor(props){
        super(props)
        this.handleAck = this.handleAck.bind(this)
    }
    handleAck(){
        this.props.sendAck()
    }
    render(){
        const livingVillagersRows = Array.from(this.props.livingVillagers).map((player) => {
            return (
                <tr key={player}>
                    <td>{player}</td>
                </tr>
            )
        })
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
        let outcomeDesc = <p>The player&nbsp;
            <span className="chosen-player-desc__player-name">{this.props.chosenPlayer}</span> was killed.</p>
        let tablesArea = null
        if(this.props.playerIsWerewolf){
            if(!this.props.voteSuccessful){
                outcomeDesc = (
                    <p>The vote failed and the chosen villager&nbsp;
                        <span className="chosen-player-desc__player-name">{this.props.chosenPlayer}</span>&nbsp;
                        was not killed. Werewolves will choose a new villager to vote on.</p>
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
                deadVillagersTable = (
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
            const votesRows = Object.keys(this.props.votes).map((player) => {
                let voteDesc = "?"
                if(this.props.votes[player] === true){
                    voteDesc = "Yea"
                }
                else if(this.props.votes[player] === false){
                    voteDesc = "Nay"
                }
                return(
                    <tr key={player}>
                        <td>{player}</td>
                        <td>{voteDesc}</td>
                    </tr>
                )
            })
            tablesArea = (
                <React.Fragment>
                    <table>
                        <thead>
                            <tr>
                                <th colSpan="2">Votes Cast by Living Werewolves</th>
                            </tr>
                            <tr>
                                <th>Name</th>
                                <th>Vote</th>
                            </tr>
                        </thead>
                        <tbody>{votesRows}</tbody>
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
                </React.Fragment>
            )
        }
        else{
            if(!this.props.voteSuccessful){
                outcomeDesc = (
                    <p>The vote failed and no villager was killed. 
                        Werewolves will choose a new villager to vote on.</p>
                )
            }
            let deadVillagersTable = null
            if(deadVillagersRows){
                deadVillagersTable = (
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
            tablesArea = (
                <React.Fragment>
                    <table>
                        <thead>
                            <tr>
                                <th>Living Players</th>
                            </tr>
                        </thead>
                        <tbody>{livingVillagersRows}</tbody>
                    </table>
                    {deadVillagersTable}
                </React.Fragment>
            )
        }
        return (
            <div>
                <h3>Werewolves have finished voting on whether to kill a chosen villager.</h3>
                <p>Please acknowledge the results.</p>
                {outcomeDesc}
                {tablesArea}
                <button onClick={this.handleAck} 
                        disabled={this.props.acks.has(this.props.username)}>Acknowledge</button>
            </div>
        )
    }
}

export default InGameNighttimeSummary