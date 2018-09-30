/*
User login interface.
Required props:
- submitCredentials(username, password) - function for
submitting log in crendentials
- createRedirect - function to redirect user to account
creation interface
*/

import React, {Component} from "react"

class AccountLogin extends Component{
    constructor(props){
        super(props)
        this.state = {username: "", password: ""}
        this.handleUsernameChange = this.handleUsernameChange.bind(this)
        this.handlePasswordChange = this.handlePasswordChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleCreateLink = this.handleCreateLink.bind(this)
    }
    handleUsernameChange(event){
        this.setState({username: event.target.value})
    }
    handlePasswordChange(event){
        this.setState({password: event.target.value})
    }
    handleSubmit(event){
        this.props.submitCredentials(this.state.username, this.state.password)
        event.preventDefault()
    }
    handleCreateLink(event){
        this.props.createRedirect()
        event.preventDefault()
    }
    render(){
        return(
            <form onSubmit={this.handleSubmit}>
                <h2>Enter your credentials to log in</h2>
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" value={this.state.username} onChange={this.handleUsernameChange} />
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" value={this.state.password} onChange={this.handlePasswordChange} />
                <input type="submit" value="Submit" />
                <h3>Don't have an account? <a onClick={this.handleCreateLink}>Create one.</a></h3>
            </form>
        )
    }
}

export default AccountLogin