/*
Game creation interface.
Required props:
navigateLobby() - function to return to the lobby
createGame(name, numPlayers, numWerewolves) - function to create game
with numPlayers total players and numWerewolves werewolves
*/

import React, {Component} from "react"
import "./CreateGame.css"

class CreateGame extends Component{
    constructor(props){
        super(props)
        this.state = {
            name: "",
            numPlayers: 4,
            numWerewolves: 1,
            errorMessageText: null
        }
        this.handleNameChange = this.handleNameChange.bind(this)
        this.handleNumPlayersChange = this.handleNumPlayersChange.bind(this)
        this.handleNumWerewolvesChange = this.handleNumWerewolvesChange.bind(this)
        this.handleLobby = this.handleLobby.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.getWerewolfHelpText = this.getWerewolfHelpText.bind(this)
        this.areFormsFilled = this.areFormsFilled.bind(this)
    }
    handleNameChange(event){
        this.setState({name: event.target.value})
    }
    handleNumPlayersChange(event){
        this.setState({numPlayers: event.target.value})
    }
    handleNumWerewolvesChange(event){
        this.setState({numWerewolves: event.target.value})
    }
    handleLobby(){
        this.props.navigateLobby()
    }
    getWerewolfHelpText(){
        if(this.state.numPlayers){
            let maxWerewolves = Math.floor(this.state.numPlayers / 3)
            if(maxWerewolves * 2 === this.state.numPlayers){
                maxWerewolves--
            }
            let recommended = Math.round(Math.sqrt(this.state.numPlayers))
            if(recommended > maxWerewolves){
                recommended = maxWerewolves
            }
            return ` (maximum: ${maxWerewolves} recommended: ${recommended})`
        }
        else{
            return ""
        }
    }
    handleSubmit(event){
        event.preventDefault()
        if(this.state.numPlayers < 4){
            this.setState({errorMessageText: "A game must have at least 4 players."})
        }
        else if(this.state.numWerewolves < 1){
            this.setState({errorMessageText: "A game must have at least 1 werewolf."})
        }
        else if(this.state.numPlayers <= this.state.numWerewolves * 2){
            this.setState({errorMessageText: "There are two many werewolves in the game."})
        }
        else{
            this.setState({errorMessageText: null})
            this.props.createGame(this.state.name, this.state.numPlayers, this.state.numWerewolves)
        }
    }
    areFormsFilled(){
        return this.state.name.length >= 1 && this.state.numPlayers !== undefined && 
            this.state.numWerewolves !== undefined
    }
    render(){
        let errorMessage = null
        if(this.state.errorMessageText){
            errorMessage = <p>{this.state.errorMessageText}</p>
        }
        return(
            <form onSubmit={this.handleSubmit}>
                <h3>Create a New Game</h3>
                <p>All fields must be filled.</p>
                <label htmlFor="name">Name</label>
                <input className="create-game__input" id="name" type="text" 
                    value={this.state.name} onChange={this.handleNameChange} />
                <label htmlFor="numPlayers">Number of Players (minimum 4)</label>
                <input className="create-game__input" id="numPlayers" 
                    type="number" value={this.state.numPlayers} 
                    onChange={this.handleNumPlayersChange} />
                <label htmlFor="numWerewolves">Number of Werewolves{this.getWerewolfHelpText()}</label>
                <input className="create-game__input" id="numWerewolves" 
                    type="number" value={this.state.numWerewolves} 
                    onChange={this.handleNumWerewolvesChange} />
                <div className="create-game__button-container">
                    <button type="button" onClick={this.handleLobby}>Return to Lobby</button>
                    <button type="submit" disabled={!this.areFormsFilled()}>Create</button>
                </div>
                {errorMessage}
            </form>
        )
    }
}

export default CreateGame