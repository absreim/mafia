/*
Main menu content page for logged in users.
Required props:
-handleEnterGame() - function to navigate to game content
-handleManage() - function to navigate to account management
-handleLogout() - function logout
*/

import React, {Component} from "react"
import "./MainMenu.css"

class MainMenu extends Component{
    constructor(props){
        super(props)
        this.handleEnterGame = this.handleEnterGame.bind(this)
        this.handleManage = this.handleManage.bind(this)
        this.handleLogout = this.handleLogout.bind(this)
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
    render(){
        return(
            <table>
                <tbody>
                    <tr>
                        <td><h2>Welcome <span className="external-info">{this.props.username}</span>!</h2></td>
                    </tr>
                    <tr>
                        <td><button onClick={this.handleEnterGame}>Enter Game</button></td>
                    </tr>
                    <tr>
                        <td><button onClick={this.handleManage}>Manage Account</button></td>
                    </tr>
                    <tr>
                        <td><button onClick={this.handleLogout}>Log Out</button></td>
                    </tr>
                </tbody>
            </table>
        )
    }
}

export default MainMenu