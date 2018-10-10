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
- handleCreate - handler function for when the user clicks the Create Account link
*/

import React, {Component} from "react"
import "./AccountMenu.css"
import Shared from "./Shared.js"
import filledPersonSvg from "./person_filled.svg"
import hollowPersonSvg from "./person_hollow.svg"
import trayArrowRight from "./tray_arrow_right.svg"
import trayArrowDown from "./tray_arrow_down.svg"

class AccountMenu extends Component{
    constructor(props){
        super(props)
        this.state = {menuVisible: false}
        this.handleLogin = this.handleLogin.bind(this)
        this.handleLogout = this.handleLogout.bind(this)
        this.handleManage = this.handleManage.bind(this)
        this.handleCreate = this.handleCreate.bind(this)
        this.toggleMenu = this.toggleMenu.bind(this)
    }
    handleLogin(){
        this.setState({menuVisible: false})
        this.props.handleLogin()
    }
    handleLogout(){
        this.setState({menuVisible: false})
        this.props.handleLogout()
    }
    handleManage(){
        this.setState({menuVisible: false})
        this.props.handleManage()
    }
    handleCreate(){
        this.setState({menuVisible: false})
        this.props.handleCreate()
    }
    toggleMenu(){
        this.setState((prevState) => ({
            menuVisible: !prevState.menuVisible
        }))
    }
    render(){
        let dropdownClass = "dropdown"
        let arrowImg = null
        if(this.state.menuVisible){
            dropdownClass += " dropdown__expanded"
            arrowImg = <img src={trayArrowDown} alt="Down arrow indicating an expanded dropdown menu." />
        }
        else{
            dropdownClass += " dropdown__collapsed"
            arrowImg = <img src={trayArrowRight} alt="Right arrow indicating a collapsed dropdown menu." />
        }
        if(this.props.loginStatus === Shared.LoginStatus.LOGGEDIN && this.props.username){
            return (
                <React.Fragment>
                    <div onClick={this.toggleMenu} className="icon-username-box">
                        <img src={filledPersonSvg} alt="Filled wireframe person icon." />
                        <a>{this.props.username}</a>
                        {arrowImg}
                    </div>
                    <div className={dropdownClass}>
                        <a onClick={this.handleLogout} className="dropdown__link">Log Out</a>
                        <a onClick={this.handleManage} className="dropdown__link">Manage Account</a>
                        <a onClick={this.handleCreate} className="dropdown__link">Create Account</a>
                    </div>
                </React.Fragment>
            )
        }
        else{
            return(
                <React.Fragment>
                    <div onClick={this.toggleMenu} className="icon-username-box">
                        <img src={hollowPersonSvg} alt="Hollow wireframe person icon." />
                        <a>Not Logged In</a>
                        {arrowImg}
                    </div>
                    <div className={dropdownClass}>
                        <a onClick={this.handleLogin} className="dropdown__link">Log In</a>
                        <a onClick={this.handleCreate} className="dropdown__link">Create Account</a>
                    </div>
                </React.Fragment>
            )
        }
    }
}

export default AccountMenu