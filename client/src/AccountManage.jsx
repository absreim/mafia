/*
Top level user account management interface.
Required props:
- username - username string of currently
logged in user
- changePasswordRedirect - function to redirect user
to change password interface
- deleteRedirect - function to redirect user to
delete account interface
*/

import React, {Component} from "react"
import "./AccountManage.css"

class AccountManage extends Component{
    constructor(props){
        super(props)
        this.handleChangePassword = this.handleChangePassword.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
    }
    handleChangePassword(event){
        this.props.changePasswordRedirect()
    }
    handleDelete(event){
        this.props.deleteRedirect()
    }
    render(){
        return(
            <div>
                <h2>Manage your account</h2>
                <p>You are logged in as <span className="external-info">{this.props.username}</span></p>
                <button type="button" onClick={this.handleChangePassword}>Change Password</button>
                <button type="button" onClick={this.handleDelete}>Delete Account</button>
            </div>
        )
    }
}

export default AccountManage