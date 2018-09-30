/*
Drop down menu that provides links to account management functions
with icon indicating login status.
Required props:
- username - name of logged in user, or null if not logged in
- loginStatus - Shared.LoginState.LOGGEDIN if logged in, otherwise
not logged in
- handleLogin - handler function for when user clicks the Log In link
- handleLogout - handler function for when the user clicks the Log Out link
- handleManage - handler function for when the user clicks the Manage
Account link
*/

import React, {Component} from "react"
import "./AccountMenu.css"
import Shared from "./Shared.js"

class AccountMenu extends Component{
    constructor(props){
        super(props)
        this.state = {menuVisible: false}
        this.handleLogin = this.handleLogin.bind(this)
        this.handleLogout = this.handleLogout.bind(this)
        this.handleManage = this.handleManage.bind(this)
        this.toggleMenu = this.toggleMenu.bind(this)
    }
    handleLogin(){
        this.props.handleLogin()
    }
    handleLogout(){
        this.props.handleLogout()
    }
    handleManage(){
        this.props.handleManage()
    }
    toggleMenu(){
        this.setState((prevState) => ({
            menuVisible: !prevState.menuVisible
        }))
    }
    render(){
        if(this.props.loginStatus === Shared.LoginStatus.LOGGEDIN && this.props.username){
            let dropdownClass = "dropdown-content"
            if(this.state.menuVisible){
                dropdownClass += " show"
            }
            return (
                <React.Fragment>
                    <button type="button" onClick={this.toggleMenu}>{this.props.username}</button>
                    <div className={dropdownClass}>
                        <button onClick={this.handleLogout} className="menu__button">Log Out</button>
                        <button onClick={this.handleManage} className="menu__button">Manage Account</button>
                    </div>
                </React.Fragment>
            )
        }
        else{
            return(
                <button type="button" onClick={this.handleLogin}>Log In</button>
            )
        }
    }
}

export default AccountMenu