/*
Component for in game "daytime" phase.
Required props:
username - the name of the player
livingWerewolves - array of living werewolves. Only applicable if the player is a werewolf
livingVillagers - array of living villagers
deadWerewolves - array of dead werewolves. Only applicable if the player is a werewolf
deadVillagers - array of dead villagers
acks - set of players for which the server has received acknowlegements
sendAck - function for sending acknowledgment that player is ready.
*/

import React, {Component} from "react"
import "./InGameOver.css"

class InGameOver extends Component {
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
                <tr key={player}
                    className="player-list__row">
                    <td>{player}</td>
                    <td>{this.props.acks.has(player) ? "Yes" : "No"}</td>
                </tr>
            )
        })
        const deadVillagersRows = Array.from(this.props.deadVillagers).map((player) => {
            return (
                <tr key={player}
                    className="player-list__row">
                    <td>{player}</td>
                    <td>{this.props.acks.has(player) ? "Yes" : "No"}</td>
                </tr>
            )
        })
        const deadWerewolvesRows = Array.from(this.props.deadWerewolves).map((player) => {
            return (
                <tr key={player}
                    className="player-list__row">
                    <td>{player}</td>
                    <td>{this.props.acks.has(player) ? "Yes" : "No"}</td>
                </tr>
            )
        })
        let outcomeDesc = null
        let livingVictorsTable = null
        if(this.props.livingVillagers.size <= this.props.livingWerewolves.size){
            outcomeDesc = (
                <p>Werewolves win.</p>
            )
            const livingWerewolvesRows = Array.from(this.props.livingWerewolves).map((player) => {
                return (
                    <tr key={player}
                        className="player-list__row">
                        <td>{player}</td>
                        <td>{this.props.acks.has(player) ? "Yes" : "No"}</td>
                    </tr>
                )
            })
            livingVictorsTable = (
                <React.Fragment>
                    <table>
                        <caption>List of living werewolves.</caption>
                        <thead>
                            <tr>
                                <th colSpan="2">Living Werewolves</th>
                            </tr>
                            <tr>
                                <th>Name</th>
                                <th>Acknowledged</th>
                            </tr>
                        </thead>
                        <tbody>{livingWerewolvesRows}</tbody>
                    </table>
                    <table>
                        <caption>List of living villagers.</caption>
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
                </React.Fragment>
            )
        }
        else{
            outcomeDesc = (
                <p>Villagers win.</p>
            )
            livingVictorsTable = (
                <table>
                    <caption>List of living villagers.</caption>
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
        }
        return(
            <div>
                <h2>The game is over.</h2>
                {outcomeDesc}
                <p>Acknowledge the results to exit the game and return to the lobby.</p>
                {livingVictorsTable}
                <table>
                    <caption>List of dead villagers.</caption>
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
                <table>
                    <caption>List of dead werewolves.</caption>
                    <thead>
                        <tr>
                            <th colSpan="2">Dead Werewolves</th>
                        </tr>
                        <tr>
                            <th>Name</th>
                            <th>Acknowledged</th>
                        </tr>
                    </thead>
                    <tbody>{deadWerewolvesRows}</tbody>
                </table>
                <button onClick={this.handleAck}
                        disabled={this.props.acks.has(this.props.username)}>Acknowledge</button>
            </div>
        )
    }
}

export default InGameOver