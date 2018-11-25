/*
Component of daytime voting outcomes: the
"end of day" and "daytime vote failed" phases.
Required props:
username - the current player's name
playerIsWerewolf - whether the current player
is a werewolf
voteSuccessful - whether the vote succeeded,
i.e. whether a majority of Yea votes were reached
chosenPlayer - the player subject to the vote
livingPlayers - object of all living players,
player name => whether player is a werewolf,
Values are ignored if playerIsWerewolf is false.
deadPlayers - object of all dead players,
player name => whether player is a werewolf.
Values are ignored if playerIsWerewolf is false.
votes - object of player name => vote cast.
true is Yea.
false is Nay.
acks - set of players for which the server 
has received acknowledgements
sendAck - function to send ack to server
*/

import React, {Component} from "react"
import "./InGameDaytimeSummary.css"

class InGameDaytimeSummary extends Component{
    constructor(props){
        super(props)
        this.handleAck = this.handleAck.bind(this)
    }
    handleAck(){
        this.props.sendAck()
    }
    render(){
        const outcomeDesc = this.props.voteSuccessful ? (
            <p>The vote has passed due to a simple majority.
                Player <span className="chosen-player-desc__player-name">{this.props.chosenPlayer}</span> has 
                been executed.</p>
        ) : (
            <p>The vote failed because Yea votes did not reach a majority. 
                Player <span className="chosen-player-desc__player-name">{this.props.chosenPlayer}</span> has 
                been spared. A new victim will be chosen and another round of daytime voting will begin.
                The daytime voting process will repeat until a vote is successful.</p>
        )
        let votesTable = null
        let deadTable = null
        if(this.props.playerIsWerewolf){
            const votesRows = Object.keys(this.props.votes).map((player) => {
                let voteDesc = "?"
                const faction = this.props.livingPlayers[player] ? "Werewolf" : "Villager"
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
                        <td>{faction}</td>
                        <td>{acknowledged}</td>
                    </tr>
                )
            })
            votesTable = (
                <table>
                    <thead>
                        <tr>
                            <th colSpan="4">Votes Cast by Each Player and their Faction</th>
                        </tr>
                        <tr>
                            <th>Name</th>
                            <th>Vote</th>
                            <th>Faction</th>
                            <th>Acknwoledged</th>
                        </tr>
                        <tbody>{votesRows}</tbody>
                    </thead>
                </table>
            )
            if(this.props.deadPlayers.size > 0){
                const deadRows = Object.keys(this.props.deadPlayers).map((player) => {
                    const faction = this.props.livingPlayers[player] ? "Werewolf" : "Villager"
                    const acknowledged = this.props.acks.has(player) ? "Yes" : "No"
                    return(
                        <tr key={player}>
                            <td>{player}</td>
                            <td>{faction}</td>
                            <td>{acknowledged}</td>
                        </tr>
                    )
                })
                deadTable = (
                    <table>
                        <thead>
                            <tr>
                                <th colSpan="3">Dead Players and their Faction</th>
                            </tr>
                            <tr>
                                <th>Name</th>
                                <th>Faction</th>
                                <th>Acknwoledged</th>
                            </tr>
                        </thead>
                        <tbody>{deadRows}</tbody>
                    </table>
                )
            }
        }
        else{
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
            votesTable = (
                <table>
                    <thead>
                        <tr>
                            <th colSpan="3">Votes Cast by Each Player</th>
                        </tr>
                        <tr>
                            <th>Name</th>
                            <th>Vote</th>
                            <th>Acknwoledged</th>
                        </tr>
                        <tbody>{votesRows}</tbody>
                    </thead>
                </table>
            )
            if(this.props.deadPlayers.size > 0){
                const deadRows = Object.keys(this.props.deadPlayers).map((player) => {
                    const acknowledged = this.props.acks.has(player) ? "Yes" : "No"
                    return(
                        <tr key={player}>
                            <td>{player}</td>
                            <td>{acknowledged}</td>
                        </tr>
                    )
                })
                deadTable = (
                    <table>
                        <thead>
                            <tr>
                                <th colSpan="2">Dead Players</th>
                            </tr>
                            <tr>
                                <th>Name</th>
                                <th>Acknwoledged</th>
                            </tr>
                        </thead>
                        <tbody>{deadRows}</tbody>
                    </table>
                )
            }
        }
        return(
            <div>
                <h3>Daytime voting has ended.</h3>
                {outcomeDesc}
                {votesTable}
                {deadTable}
                <button onClick={this.handleAck} 
                    disabled={this.props.acks.has(this.props.username)}>Acknowledge</button>
            </div>
        )
    }
}

export default InGameDaytimeSummary