/*
Main menu content page for logged in users.
Required props:
-handleEnterGame() - function to navigate to game content
-handleManage() - function to navigate to account management
-handleLogout() - function to logout
-handleInstructions() - function to go to instructions page
-handleAbout() - function to go to About page
*/

import React, {Component} from "react"
import "./MainMenu.css"

class MainMenu extends Component{
    constructor(props){
        super(props)
        this.handleEnterGame = this.handleEnterGame.bind(this)
        this.handleManage = this.handleManage.bind(this)
        this.handleLogout = this.handleLogout.bind(this)
        this.handleInstructions = this.handleInstructions.bind(this)
        this.handleAbout = this.handleAbout.bind(this)
    }
    handleEnterGame(){
        this.props.handleEnterGame()
    }
    handleManage(){
        this.props.handleManage()
    }
    handleLogout(){
        this.props.handleLogout()
    }
    handleInstructions(){
        this.props.handleInstructions()
    }
    handleAbout(){
        this.props.handleAbout()
    }
    render(){
        return(
            <React.Fragment>
                <h3>Main Menu</h3>
                <button onClick={this.handleEnterGame}>Enter Game</button>
                <button onClick={this.handleManage}>Manage Account</button>
                <button onClick={this.handleLogout}>Log Out</button>
                <button onClick={this.handleInstructions}>Instructions</button>
                <button onClick={this.handleAbout}>About</button>
            </React.Fragment>
        )
    }
}

export default MainMenu