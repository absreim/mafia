/*
Password change interface for existing accounts.
Required props:
submitPasswords(old, new) - submits old and
new passwords to attempt a change
username - the name of the account for which a password change
is being made
*/

import React, {Component} from "react"

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
                <h3>Change your password</h3>
                <p>Enter your existing password to change the password for the account&nbsp;
                    <strong>{this.props.username}</strong>.</p>
                <label htmlFor="old">Current password:</label>
                <input id="old" type="password" value={this.state.old} onChange={this.handleOldChange} />
                <label htmlFor="new">New password:</label>
                <input id="new" type="password" value={this.state.new} onChange={this.handleNewChange} />
                <input type="submit" value="Submit" disabled={this.state.old.length === 0 || this.state.new.length === 0} />
            </form>
        )
    }
}

export default ChangePassword