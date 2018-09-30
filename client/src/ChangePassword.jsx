/*
Password change interface for existing accounts.
Required props:
submitPasswords(old, new) - submits old and
new passwords to attempt a change
username - the name of the account for which a password change
is being made
*/

import React, {Component} from "react"
import "./ChangePassword.css"

class ChangePassword extends Component{
    constructor(props){
        super(props)
        this.state = {
            old: "",
            new: ""
        }
        this.handleOldChange = this.handleOldChange.bind(this)
        this.handleNewChange = this.handleNewChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    handleOldChange(event){
        this.setState({old: event.target.value})
    }
    handleNewChange(event){
        this.setState({new: event.target.value})
    }
    handleSubmit(event){
        this.props.submitPasswords(this.state.old, this.state.new)
        event.preventDefault()
    }
    render(){
        return(
            <form onSubmit={this.handleSubmit}>
                <h2>Change your password</h2>
                <p>Enter your existing password to change the password for the account 
                    <span className="external-info">{this.props.username}</span></p>
                <label htmlFor="old">Current password:</label>
                <input id="old" type="password" value={this.state.old} onChange={this.handleOldChange} />
                <label htmlFor="new">New password:</label>
                <input id="new" type="password" value={this.state.new} onChange={this.handleNewChange} />
                <input type="submit" value="Submit" />
            </form>
        )
    }
}

export default ChangePassword