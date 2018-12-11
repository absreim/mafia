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
acks - set of players for which the server 
has received acknowledgements
sendAck - function to send ack to server
*/

import React, {Component} from "react"
import "./InGameNighttimeSummary.css"
import crescentWithStars from "./crescent-with-stars.svg"
import "./images.css"

class InGameNighttimeSummary extends Component{
    constructor(props){
        super(props)
        this.handleAck = this.handleAck.bind(this)
    }
    handleAck(){
        this.props.sendAck()
    }
    render(){
        let livingVillagersRows = null
        let deadVillagersRows = null
        if(this.props.voteSuccessful){
            livingVillagersRows = Array.from(this.props.livingVillagers).map((player) => {
                const acknowledged = this.props.acks.has(player) ? "Yes" : "No"
                return (
                    <tr key={player}>
                        <td>{player}</td>
                        <td>{acknowledged}</td>
                    </tr>
                )
            })
            if(this.props.deadVillagers.size > 0){
                deadVillagersRows = Array.from(this.props.deadVillagers).map((player) => {
                    const acknowledged = this.props.acks.has(player) ? "Yes" : "No"
                    return (
                        <tr key={player}>
                            <td>{player}</td>
                            <td>{acknowledged}</td>
                        </tr>
                    )
                })
            }
        }
        else{
            livingVillagersRows = Array.from(this.props.livingVillagers).map((player) => {
                return (
                    <tr key={player}>
                        <td>{player}</td>
                    </tr>
                )
            })
            if(this.props.deadVillagers.size > 0){
                deadVillagersRows = Array.from(this.props.deadVillagers).map((player) => {
                    return (
                        <tr key={player}>
                            <td>{player}</td>
                        </tr>
                    )
                })
            }
        }
        let outcomeDesc = (
            <React.Fragment>
                <p>The player&nbsp;
                <span className="chosen-player-desc__player-name">{this.props.chosenPlayer}</span> was killed.</p>
                <p>Please acknowledge the results.</p>
            </React.Fragment>
        )
        let tablesArea = null
        let interactionArea = null
        let deadVillagersTable = null
        if(this.props.playerIsWerewolf){
            interactionArea = <button onClick={this.handleAck} 
                disabled={this.props.acks.has(this.props.username)}>Acknowledge</button>
            let livingVillagersTable = null
            if(this.props.voteSuccessful){
                livingVillagersTable = (
                    <table>
                        <thead>
                            <tr>
                                <th colSpan="2">Living Villagers</th>
                            </tr>
                            <tr>
                                <th>Name</th>
                                <th>Acknowledged</th>
                            </tr>
                        </thead>
                        <tbody>{livingVillagersRows}</tbody>
                    </table>
                )
                if(deadVillagersRows){
                    deadVillagersTable = (
                        <table>
                            <thead>
                                <tr>
                                    <th colSpan="2">Dead Villagers</th>
                                </tr>
                                <tr>
                                    <th>Name</th>
                                    <th>Acknowledged</th>
                                </tr>
                            </thead>
                            <tbody>{deadVillagersRows}</tbody>
                        </table>
                    )
                }
            }
            else{
                outcomeDesc = (
                    <React.Fragment>
                        <p>The vote failed and the chosen villager&nbsp;
                        <span className="chosen-player-desc__player-name">{this.props.chosenPlayer}</span>&nbsp;
                        was not killed. Werewolves will choose a new villager to vote on.</p>
                        <p>Please acknowledge the results.</p>
                    </React.Fragment>
                )
                livingVillagersTable = (
                    <table>
                        <thead>
                            <tr>
                                <th>Living Villagers</th>
                            </tr>
                            <tr>
                                <th>Name</th>
                            </tr>
                        </thead>
                        <tbody>{livingVillagersRows}</tbody>
                    </table>
                )
                if(deadVillagersRows){
                    deadVillagersTable = (
                        <table>
                            <thead>
                                <tr>
                                    <th>Dead Villagers</th>
                                </tr>
                                <tr>
                                    <th>Name</th>
                                </tr>
                            </thead>
                            <tbody>{deadVillagersRows}</tbody>
                        </table>
                    )
                }
            }
            let deadWerewolvesTable = null
            if(this.props.deadWerewolves.size > 0){
                const deadWerewolvesRows = Array.from(this.props.deadWerewolves).map((player) => {
                    const acknowledged = this.props.acks.has(player) ? "Yes" : "No"
                    return (
                        <tr key={player}>
                            <td>{player}</td>
                            <td>{acknowledged}</td>
                        </tr>
                    )
                })
                deadWerewolvesTable = (
                    <table>
                        <thead>
                            <tr>
                                <th colSpan="2">Dead Werewolves</th>
                            </tr>
                        </thead>
                        <tbody>{deadWerewolvesRows}</tbody>
                    </table>
                )
            }
            const votesRows = Object.keys(this.props.votes).map((player) => {
                let voteDesc = "?"
                const acknowledged = this.props.acks.has(player) ? "Yes" : "No"
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
                        <td>{acknowledged}</td>
                    </tr>
                )
            })
            tablesArea = (
                <React.Fragment>
                    <table>
                        <thead>
                            <tr>
                                <th colSpan="3">Votes Cast by Living Werewolves</th>
                            </tr>
                            <tr>
                                <th>Name</th>
                                <th>Vote</th>
                                <th>Acknowledged</th>
                            </tr>
                        </thead>
                        <tbody>{votesRows}</tbody>
                    </table>
                    {deadWerewolvesTable}
                    {livingVillagersTable}
                    {deadVillagersTable}
                </React.Fragment>
            )
        }
        else{
            let livingPlayersTable = null
            let deadPlayersTable = null
            if(this.props.voteSuccessful){
                interactionArea = <button onClick={this.handleAck} 
                    disabled={this.props.acks.has(this.props.username)}>Acknowledge</button>
                livingPlayersTable = (
                    <table>
                        <thead>
                            <tr>
                                <th colSpan="2">Living Players</th>
                            </tr>
                            <tr>
                                <th>Name</th>
                                <th>Acknowledged</th>
                            </tr>
                        </thead>
                        <tbody>{livingVillagersRows}</tbody>
                    </table>
                )
                if(deadVillagersRows){
                    deadPlayersTable = (
                        <table>
                            <thead>
                                <tr>
                                    <th colSpan="2">Dead Players</th>
                                </tr>
                                <tr>
                                    <th>Name</th>
                                    <th>Acknowledged</th>
                                </tr>
                            </thead>
                            <tbody>{deadVillagersRows}</tbody>
                        </table>
                    )
                }
            }
            else{
                outcomeDesc = (
                    <p>The vote failed and no villager was killed. 
                        Werewolves will choose a new villager to vote on.</p>
                )
                livingPlayersTable = (
                    <table>
                        <thead>
                            <tr>
                                <th>Living Players</th>
                            </tr>
                            <tr>
                                <th>Name</th>
                            </tr>
                        </thead>
                        <tbody>{livingVillagersRows}</tbody>
                    </table>
                )
                if(deadVillagersRows){
                    deadPlayersTable = (
                        <table>
                            <thead>
                                <tr>
                                    <th>Dead Players</th>
                                </tr>
                                <tr>
                                    <th>Name</th>
                                </tr>
                            </thead>
                            <tbody>{deadVillagersRows}</tbody>
                        </table>
                    )
                }
            }
            tablesArea = (
                <React.Fragment>
                    {livingPlayersTable}
                    {deadPlayersTable}
                </React.Fragment>
            )
        }
        return (
            <div>
                <img className="crescent-with-stars" src={crescentWithStars}
                    alt="Crescent moon and stars indicating it is night time." />
                <h3>Werewolves have finished voting on whether to kill a chosen villager.</h3>
                {outcomeDesc}
                {tablesArea}
                {interactionArea}
            </div>
        )
    }
}

export default InGameNighttimeSummary