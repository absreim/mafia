/*
Account creation interface.
Required props:
- submitCrendentials(username, password, confirm) - function
for submitting the credentials
- loginRedirect - function to redirect user to log in
interface instead
*/

import React, {Component} from "react"

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
        this.handleLoginLink = this.handleLoginLink.bind(this)
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
    handleLoginLink(event){
        this.props.loginRedirect()
    }
    render(){
        return(
            <form onSubmit={this.handleSubmit}>
                <h2>Create a new account</h2>
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" value={this.state.username} onChange={this.handleUsernameChange} />
                <label htmlFor="password">Password</label>
                <input type="password" id="password" value={this.state.password} onChange={this.handlePasswordChange} />
                <label htmlFor="confirm">Confirm Password</label>
                <input type="password" id="confirm" value={this.state.confirm} onChange={this.handleConfirmChange} />
                <input type="submit" value="Submit" />
                <p>Already have an account? You may <a onClick={this.handleLoginLink}>log in</a> to it instead.</p>
            </form>
        )
    }
}

export default AccountCreation