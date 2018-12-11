/*
Drop down menu that provides links to account management functions
with icon indicating login status.
Required props:
- username - name of logged in user, or null if not logged in
- menuVisible - boolean variable that stores whether the menu is visible
- loginStatus - Shared.LoginState.LOGGEDIN if logged in, otherwise
not logged in
- handleLogin - handler function for when user clicks the Log In link
- handleLogout - handler function for when the user clicks the Log Out link
- handleManage - handler function for when the user clicks the Manage
- handleCreate - handler function for when the user clicks the Create Account link
- toggleMenu - function to toggle the state the visibility of the menu
*/

import React, {Component} from "react"
import "./AccountMenu.css"
import Shared from "./Common/Shared.js"

class AccountMenu extends Component{
    constructor(props){
        super(props)
        this.handleLogin = this.handleLogin.bind(this)
        this.handleLogout = this.handleLogout.bind(this)
        this.handleManage = this.handleManage.bind(this)
        this.handleCreate = this.handleCreate.bind(this)
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
    handleCreate(){
        this.props.handleCreate()
    }
    toggleMenu(event){
        event.stopPropagation()
        this.props.toggleMenu()
    }
    render(){
        let dropdownClass = "dropdown"
        let arrowImgTransform = null
        if(this.props.menuVisible){
            dropdownClass += " dropdown__expanded"
            arrowImgTransform = "matrix(0,1,-1.6744885,0,494.64091,288.3161)"
        }
        else{
            dropdownClass += " dropdown__collapsed"
            arrowImgTransform = "matrix(1,0,0,1.6744885,-0.25056518,-197.67065)"
        }
        const arrowImg = <svg
                width="32"
                height="32"
                viewBox="0 0 8.4666665 8.4666669"
                className="dropdown-arrow">
                    <g id="layer1" transform="translate(0,-288.53333)">
                        <path
                            id="path3727"
                            d={"m 5.8342247,292.92383 -1.3683933,0.79004 -1.3683933," + 
                                "0.79004 0,-1.58008 0,-1.58009 1.3683933,0.79005 z"}
                            transform={arrowImgTransform}
                            className="dropdown-arrow__path" />
                    </g>
                </svg>
        if(this.props.loginStatus === Shared.LoginStatus.LOGGEDIN && this.props.username){
            const filledPerson = <svg
                width="32"
                height="32"
                viewBox="0 0 33.866666 33.866666"
                className="person-icon">
                <g transform="translate(0,-263.13334)">
                    <circle
                        cx="16.933332"
                        cy="299.11667"
                        r="16.933332"
                        className="person-icon__circle person-icon__circle--filled"
                        stroke="currentColor" />
                    <circle
                        cx="16.933332"
                        cy="274.51044"
                        r="10.583333"
                        className="person-icon__circle person-icon__circle--filled" />
                </g>
            </svg>
            return (
                <React.Fragment>
                    <div onClick={this.toggleMenu} className="icon-username-box">
                        {filledPerson}
                        <p className="account-menu__user-description">{this.props.username}</p>
                        {arrowImg}
                    </div>
                    <div className={dropdownClass}>
                        <button onClick={this.handleLogout} className="dropdown__button">Log Out</button>
                        <button onClick={this.handleManage} className="dropdown__button">Manage Account</button>
                        <button onClick={this.handleCreate} className="dropdown__button">Create Account</button>
                    </div>
                </React.Fragment>
            )
        }
        else{
            const hollowPerson = <svg
                width="32"
                height="32"
                viewBox="0 0 33.866666 33.866666"
                className="person-icon">
                <g transform="translate(0,-263.13334)">
                    <circle
                        cx="16.933332"
                        cy="299.11667"
                        r="16.933332"
                        className="person-icon__circle person-icon__circle--hollow" />
                    <circle
                        cx="16.933332"
                        cy="274.51044"
                        r="10.583333"
                        className="person-icon__circle person-icon__circle--hollow" />
                </g>
            </svg>
            return(
                <React.Fragment>
                    <div onClick={this.toggleMenu} className="icon-username-box">
                        {hollowPerson}
                        <p className="account-menu__user-description">Not Logged In</p>
                        {arrowImg}
                    </div>
                    <div className={dropdownClass}>
                        <button onClick={this.handleLogin} className="dropdown__button">Log In</button>
                        <button onClick={this.handleCreate} className="dropdown__button">Create Account</button>
                    </div>
                </React.Fragment>
            )
        }
    }
}

export default AccountMenu