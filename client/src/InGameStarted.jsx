/*
Component for in game "started" phase.
Required props:
username - the name of the player
playerIsWerewolf - boolean value indicating whether the player is a werewolf
werewolves - array of werewolves. Only applicable if player is a werewolf.
villagers - array of villagers. If the player is not a werewolf, everyone is
considered a villager.
acks - set of players for which the server has received acknowlegements
sendAck - function for sending acknowledgment that player is ready.
*/

import React, {Component} from "react"
class InGameStarted extends Component{
    constructor(props){
        super(props)
        this.handleReady = this.handleReady.bind(this)
    }
    handleReady(){
        this.props.sendAck()
    }
    render(){
        let villagerRows = Array.from(this.props.villagers).map((villager) => {
            return (
                <tr key={villager}>
                    <td>{villager}</td>
                    <td>{this.props.acks.has(villager) ? "Yes" : "No"}</td>
                </tr>
            )
        })
        if(this.props.playerIsWerewolf){
            let werewolfRows = Array.from(this.props.werewolves).map((werewolf) => {
                return (
                    <tr key={werewolf}>
                        <td>{werewolf}</td>
                        <td>{this.props.acks.has(werewolf) ? "Yes" : "No"}</td>
                    </tr>
                )
            })
            return (
                <div>
                    <h3>The game has started!</h3>
                    <p>You are a werewolf.</p>
                    <p>Take note of the lists of werewolves and villagers and 
                        click the "Ready" button to continue.</p>
                    <table>
                        <thead>
                            <tr>
                                <th colSpan="2">Werewolves</th>
                            </tr>
                            <tr>
                                <th>Name</th>
                                <th>Ready</th>
                            </tr>
                        </thead>
                        <tbody>{werewolfRows}</tbody>
                    </table>
                    <table>
                        <thead>
                            <tr>
                                <th colSpan="2">Villagers</th>
                            </tr>
                            <tr>
                                <th>Name</th>
                                <th>Ready</th>
                            </tr>
                        </thead>
                        <tbody>{villagerRows}</tbody>
                    </table>
                    <button onClick={this.handleReady}
                        disabled={this.props.acks.has(this.props.username)}>Ready</button>
                </div>
            )
        }
        else{
            return (
                <div>
                    <h3>The game has started!</h3>
                    <p>You are a villager.</p>
                    <p>Take note of the list of players and click the "Ready" button to continue.</p>
                    <table>
                        <thead>
                            <tr>
                                <th colSpan="2">Players</th>
                            </tr>
                            <tr>
                                <th>Name</th>
                                <th>Ready</th>
                            </tr>
                        </thead>
                        <tbody>{villagerRows}</tbody>
                    </table>
                    <button onClick={this.handleReady} 
                        disabled={this.props.acks.has(this.props.username)}>Ready</button>
                </div>
            )
        }
    }   
}

export default InGameStarted