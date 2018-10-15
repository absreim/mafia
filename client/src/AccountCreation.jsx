/*
Account creation interface.
Required props:
- submitCrendentials(username, password, confirm) - function
for submitting the credentials
- loginUrl - url of login page
*/

import React, {Component} from "react"
import "./AccountCreation.css"
import {Link} from "react-router-dom"

class AccountCreation extends Component {
    constructor(props){
        super(props)
        this.state = {
            username: "",
            password: "",
            confirm: ""
        }
        this.handleUsernameChange = this.handleUsernameChange.bind(this)
        this.handlePasswordChange = this.handlePasswordChange.bind(this)
        this.handleConfirmChange = this.handleConfirmChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    handleUsernameChange(event){
        this.setState({username: event.target.value})
    }
    handlePasswordChange(event){
        this.setState({password: event.target.value})
    }
    handleConfirmChange(event){
        this.setState({confirm: event.target.value})
    }
    handleSubmit(event){
        // defer credential validation to component above
        this.props.submitCredentials(this.state.username, this.state.password, this.state.confirm)
        event.preventDefault()
    }
    render(){
        return(
            <form onSubmit={this.handleSubmit}>
                <h2>Create a new account</h2>
                <label htmlFor="username">Username:</label>
                <input className="login-form__text-input" type="text" id="username" 
                    value={this.state.username} onChange={this.handleUsernameChange} />
                <label htmlFor="password">Password:</label>
                <input className="login-form__text-input" type="password" id="password" 
                    value={this.state.password} onChange={this.handlePasswordChange} />
                <label htmlFor="confirm">Confirm Password:</label>
                <input className="login-form__text-input" type="password" id="confirm" 
                    value={this.state.confirm} onChange={this.handleConfirmChange} />
                <input type="submit" value="Submit" />
                <p>Already have an account? You may <Link to={this.props.loginUrl}>log in</Link> to 
                    it instead.</p>
            </form>
        )
    }
}

export default AccountCreation