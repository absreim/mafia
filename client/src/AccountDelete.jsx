/*
Interface for deleting an account.
Required props:
- submitPassword(password) - function for submitting the entered password
- username - username of the currently logged in user
*/

import React, {Component} from "react"
import "./AccountDelete.css"

class AccountDelete extends Component{
    constructor(props){
        super(props)
        this.state = {password: ""}
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handlePasswordChange = this.handlePasswordChange.bind(this)
    }
    handleSubmit(event){
        this.props.submitPassword(this.state.password)
        event.preventDefault()
    }
    handlePasswordChange(event){
        this.setState({password: event.target.value})
    }
    render(){
        return(
            <form onSubmit={this.handleSubmit}>
                <h2>Confirm account deletion</h2>
                <p>Enter your password one last to time to delete your account 
                    <span className="external-info">{this.props.username}</span></p>
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" value={this.state.password}
                    onChange={this.handlePasswordChange} />
                <input type="submit" value="Submit" />
            </form>
        )
    }
}

export default AccountDelete