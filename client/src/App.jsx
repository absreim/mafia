/*
Root component for Mafia app.
*/

import React, { Component } from 'react'
import axios from "axios"
import './App.css'
import AccountCreation from "./AccountCreation"
import AccountDelete from "./AccountDelete"
import AccountLogin from "./AccountLogin"
import AccountManage from "./AccountManage"
import ChangePassword from "./ChangePassword"
import MainMenu from "./MainMenu"
import Welcome from "./Welcome"
import AccountMenu from "./AccountMenu"
import GameContent from "./GameContent"
import Shared from "./Shared"
import {Switch, Route, Redirect} from "react-router-dom"

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      username: null,
      loginStatus: null,
      userMessage: "" // important message visible to user
    }
    axios.defaults.withCredentials = true
    this.createAccountWithConfirm = this.createAccountWithConfirm.bind(this)
    this.navigateLogin = this.navigateLogin.bind(this)
    this.navigateManage = this.navigateManage.bind(this)
    this.navigateDelete = this.navigateDelete.bind(this)
    this.navigateCreate = this.navigateCreate.bind(this)
    this.navigateChangePassword = this.navigateChangePassword.bind(this)
    this.navigateMainMenu = this.navigateMainMenu.bind(this)
    this.navigateGameContent = this.navigateGameContent.bind(this)
    this.logout = this.logout.bind(this)
    this.deleteAccount = this.deleteAccount.bind(this)
    this.login = this.login.bind(this)
    this.changePassword = this.changePassword.bind(this)
  }
  componentDidMount(){
    this.updateLoginStatus()
  }
  // clear the user visible messages
  // generally called when submits a form or navigates to new page
  clearMessage(){
    this.setState({userMessage: ""})
  }
  displayMessage(message){
    this.setState({userMessage: message})
  }
  updateLoginStatus(){
    axios({
      method: "get",
      url: "/api/loginstatus"
    }).then((function(response){
      if(response.data.loginStatus){
        switch(response.data.loginStatus){
          case Shared.LoginStatus.LOGGEDIN:
            if(response.data.username){
              this.setState({
                username: response.data.username,
                loginStatus: Shared.LoginStatus.LOGGEDIN
              })
            }
            else{
              console.log("Warning: server responds that user is logged in, but did not specify a user name")
            }
            break
          case Shared.LoginStatus.LOGGEDOUT:
            this.setState({
              username: null,
              loginStatus: Shared.LoginStatus.LOGGEDOUT
            })
            break
          case Shared.LoginStatus.ERROR:
            this.setState({
              username: null,
              loginStatus: Shared.LoginStatus.ERROR
            })
            console.log("User session is corrupt, logging out and back in may fix the problem.")
            break
          default:
            console.log("Unrecognized loginStatus value returned from server.")
        }
      }
      else{
        console.log("Warning: after requesting logged in status from server, response from server was malformed")
      }
    }).bind(this)).catch((function(error){
      this.displayMessage("Error occurred communicating with server. You may want to try refreshing the page. If problem persists, please try again later.")
      console.log("Error getting login status: " + error)
    }).bind(this))
  }
  createAccount(username, password){
    axios({
      method: "post",
      url: "/api/signup",
      data: {
        username: username,
        password: password
      }
    }).then((function(response){
      if(response.data){
        switch(response.data.outcome){
          case Shared.AccountCreateOutcome.INTERNALERROR:
            this.displayMessage("Internal server error creating account. Please try again later.")
            break
          case Shared.AccountCreateOutcome.EXISTS:
            this.displayMessage("An account by that name already exists.")
            break
          case Shared.AccountCreateOutcome.MISSINGINFO:
            this.displayMessage("Error creating account due to API mismatch between client and server. Please report this error and try again later.")
            console.log("Error: server reports that in the request to create an account, username and/or password information is missing from the body.")
            break
          case Shared.AccountCreateOutcome.SUCCESS:
            if(this.state.loginStatus === Shared.LoginStatus.LOGGEDIN){
              this.displayMessage("Account successfully created! To log in with your new account, log out first.")
            }
            else if(this.state.loginStatus === Shared.LoginStatus.LOGGEDOUT){
              this.setState({
                userMessage: "Account successfully created!"
              })
            }
            else{
              this.displayMessage("Account successfully created, but your user session appears to be corrupt. Please log out or refresh the page before attempting to log in with your new account.")
            }
            break
          default:
            this.displayMessage("Unrecognized response from server. Please report this error and try again later.")
            console.log("Unrecognized create account outcome: " + response.data.outcome)
        }
      }
      else{
        this.displayMessage("Unexpected response received from server when requesting the creation of the account. Please report this issue and/or try again later.")
        console.log("Error: when requesting server to create an account, response object does not contain outcome field.")
      }
    }).bind(this)).catch((function(error){
      this.displayMessage("Error communicating with server when trying to create account. You may try to create the account again. If problem persists, please try again later.")
      console.log("Error in HTTP request to create an account: " + error)
    }).bind(this))
  }
  createAccountWithConfirm(username, password, confirm){
    this.clearMessage()
    if(password === confirm){
      this.createAccount(username, password)
    }
    else{
      this.displayMessage("Passwords do not match.")
    }
  }
  deleteAccount(password){
    this.clearMessage()
    if(this.state.loginStatus === Shared.LoginStatus.LOGGEDIN && this.state.username){
      axios({
        method: "post",
        url: "/api/deleteAccount",
        data: {
          password: password
        }
      }).then((function(response){
        if(response.data){
          switch(response.data.outcome){
            case Shared.AccountDeleteOutcome.NOTLOGGEDIN:
              this.displayMessage("The server thinks you are not logged in. Try logging out, logging back in, and deleting your account again.")
              break
            case Shared.AccountDeleteOutcome.INTERNALERROR:
              this.displayMessage("Internal server error trying to delete account. Please try again later.")
              break
            case Shared.AccountDeleteOutcome.MISSINGINFO:
              this.displayMessage("Protocol mismatch between client and server. Please report this problem and try again later.")
              break
            case Shared.AccountDeleteOutcome.WRONGPASSWORD:
              this.displayMessage("This password you entered was incorrect.")
              break
            case Shared.AccountDeleteOutcome.SUCCESS:
              this.setState({
                username: null,
                loginStatus: Shared.LoginStatus.LOGGEDOUT,
                userMessage: ""
              })
              break
            default:
              this.displayMessage("Incomplete response from server. Please report this problem and try again later.")
          }
        }
        else{
          this.displayMessage("Incomplete response from server when trying to delete account. Please report this issue and try again later.")
        }
      }).bind(this)).catch((function(error){
        this.displayMessage("Error communicating with server when trying to delete account. Please try again later.")
        console.log("Error communicating with server when trying to delete account: " + error)
      }).bind(this))
    }
    else{
      console.log("Warning: attempt to delete account when client application is not logged in.")
    }
  }
  login(username, password){
    this.clearMessage()
    axios({
      method: "post",
      url: "/api/login",
      data: {
        username: username,
        password: password
      }
    }).then((function(response){
      if(response.data){
        switch(response.data.outcome){
          case Shared.LoginOutcome.LOGGEDIN:
            this.displayMessage("The server thinks you are already logged in. Try refreshing the page to see if your login status is corrected.")
            break
          case Shared.LoginOutcome.INTERNALERROR:
            this.displayMessage("Internal server error when trying to log in. Please try again later.")
            break
          case Shared.LoginOutcome.MISSINGINFO:
            this.displayMessage("Protocol mismatch between client and server. If problem persists, please report the problem and try again later.")
            break
          case Shared.LoginOutcome.WRONGCREDENTIALS:
            this.displayMessage("Invalid username and/or password.")
            break
          case Shared.LoginOutcome.SUCCESS:
            this.setState({
              username: username,
              loginStatus: Shared.LoginStatus.LOGGEDIN
            })
            break
          default:
            this.displayMessage("Incomplete response from server. Please report this problem and try again later.")
        }
      }
    }).bind(this)).catch((function(error){
      this.displayMessage("Error communicating with server when trying to log in. Please try again later.")
      console.log("Error communicating with server when trying to log in: " + error)
    }).bind(this))
  }
  logout(){
    this.clearMessage()
    // If internal login state is in ERROR state, try to logout from the server
    // to try to clear up corrupted session.
    if(this.state.loginStatus === Shared.LoginStatus.LOGGEDIN || this.state.loginStatus === this.LoginStatus.ERROR){
      axios({
        method: "get",
        url: "/api/logout"
      }).then((function(response){
        if(response.data){
          switch(response.data.outcome){
            case Shared.LogoutOutcome.SUCCESS:
              this.setState({
                username: null,
                loginStatus: Shared.LoginStatus.LOGGEDOUT,
                userMessage: "Successfully logged out."
              })
              break
            case Shared.LogoutOutcome.INTERNALERROR:
              this.displayMessage("Internal server error when trying to log out. Please try again later.")
              break
            case Shared.LogoutOutcome.NOTLOGGEDIN:
              this.setState({
                username: null,
                loginStatus: Shared.LoginStatus.LOGGEDOUT,
                userMessage: "Server indicates that you were already logged out."
              })
              console.log("Warning: client made attempt to log out, but server reports account is already logged out.")
              break
            default:
              this.displayMessage("Unrecognized response from server when attempting to log out. Please report this problem and try again later.")
              console.log("Unrecognized log out outcome received: " + response.data.outcome)
          }
        }
        else{
          this.displayMessage("Incomplete response from server when trying to log out. Please report this issue and try again later.")
        }
      }).bind(this)).catch((function(error){
      this.displayMessage("Error communicating with server when trying to log out. Please try again later.")
      console.log("Error communicating with server when trying to log out: " + error)
      }).bind(this))
    }
    else if(this.state.loginStatus === Shared.LoginStatus.LOGGEDOUT){
      this.displayMessage("You are already logged out.")
      console.log("Warning: attempt to log out on client end when state already indicates the account is logged out.")
    }
    else{
      this.displayMessage("Local login information is corrupt. Refreshing the page may solve the problem.")
    }
  }
  changePassword(oldPassword, newPassword){
    this.clearMessage()
    if(this.state.loginStatus === Shared.LoginStatus.LOGGEDIN && this.state.username){
      axios({
        method: "post",
        url: "/api/changePassword",
        data: {
          oldPassword: oldPassword,
          newPassword: newPassword
        }
      }).then((function(response){
        if(response.data){
          switch(response.data.outcome){
            case Shared.ChangePasswordOutcome.NOTLOGGEDIN:
              this.displayMessage("The server thinks you are not logged in. Try logging out and logging back in.")
              break
            case Shared.ChangePasswordOutcome.INTERNALERROR:
              this.displayMessage("Internal server error trying to change password. Please try again later.")
              break
            case Shared.ChangePasswordOutcome.MISSINGINFO:
              this.displayMessage("Protocol mismatch between client and server. Please report this problem and try again later.")
              break
            case Shared.ChangePasswordOutcome.WRONGPASSWORD:
              this.displayMessage("This password you entered was incorrect.")
              break
            case Shared.ChangePasswordOutcome.SUCCESS:
              this.displayMessage("Password changed successfully.")
              break
            default:
              this.displayMessage("Incomplete response from server. Please report this problem and try again later.")
          }
        }
        else{
          this.displayMessage("Incomplete response from server when trying to change password. Please report this issue and try again later.")
        }
      }).bind(this)).catch((function(error){
        this.displayMessage("Error communicating with server when trying to change password. Please try again later.")
        console.log("Error communicating with server when trying to change password: " + error)
      }).bind(this))
    }
    else{
      console.log("Warning: attempt to change password when client application is not logged in.")
    }
  }

  // navigation functions passed to children

  navigateLogin(){
    this.clearMessage()
    window.location.assign("/login")
  }
  navigateManage(){
    this.clearMessage()
    window.location.assign("/account-manage")
  }
  navigateCreate(){
    this.clearMessage()
    window.location.assign("/account-create")
  }
  navigateChangePassword(){
    this.clearMessage()
    window.location.assign("/change-password")
  }
  navigateDelete(){
    this.clearMessage()
    window.location.assign("/account-delete")
  }
  navigateMainMenu(){
    this.clearMessage()
    window.location.assign("/main-menu")
  }
  navigateGameContent(){
    this.clearMessage()
    window.location.assign("/game")
  }

  getMainContent(){
    if(this.state.loginStatus === null){
      return (
        <React.Fragment>
          <h2>Loading data from server...</h2>
        </React.Fragment>
      )
    }
    else if(this.state.loginStatus === Shared.LoginStatus.LOGGEDIN){
      return(
        <Switch>
          <Route path="/game" render={() =>
            <GameContent handleMainMenu={this.navigateMainMenu} username={this.state.username} />
          } />
          <Route path="/main-menu" render={() => 
            <MainMenu handleEnterGame={this.navigateGameContent} handleManage={this.navigateManage} 
              handleLogout={this.logout} username={this.state.username} />
          } />
          <Route path="/account-create" render={() => 
            <AccountCreation submitCredentials={this.createAccountWithConfirm} 
              loginRedirect={this.navigateLogin} />
            } />
          <Route path="/account-delete" render={() =>
            <AccountDelete submitPassword={this.deleteAccount} username={this.state.username} />
          } />
          <Route path="/account-manage" render={() =>
            <AccountManage changePasswordRedirect={this.navigateChangePassword} 
              deleteRedirect={this.navigateDelete} username={this.state.username} />
          } />
          <Route path="/change-password" render={() => 
            <ChangePassword submitPasswords={this.changePassword} username={this.state.username} />
          } />
          <Redirect to="/main-menu" />
        </Switch>
      )
    }
    else if(this.state.loginStatus === Shared.LoginStatus.LOGGEDOUT){
      return(
        <Switch>
          <Route exact path="/" render={() =>
            <Welcome handleLogin={this.navigateLogin} handleCreate={this.navigateCreate} />
          } />
          <Route path="/login" render={() => 
            <AccountLogin submitCredentials={this.login} createRedirect={this.navigateCreate} />
          } />
          <Route path="/account-create" render={() => 
            <AccountCreation submitCredentials={this.createAccountWithConfirm} 
              loginRedirect={this.navigateLogin} />
          } />
          <Redirect to="/" />
        </Switch>
      )
    }
    else{
      return(
        <React.Fragment>
          <h2>Error communicating with server. Please try again later.</h2>
        </React.Fragment>
      )
    }
  }

  render() {
    return (
      <React.Fragment>
        <header>
          <h1>Absreim's Mafia React Client</h1>
        </header>
        <nav>
          <AccountMenu username={this.state.username} loginStatus={this.state.loginStatus} 
            handleLogin={this.navigateLogin} handleLogout={this.logout} 
            handleManage={this.navigateManage} />
        </nav>
        <main>{this.getMainContent()}</main>
        <footer>{this.state.userMessage}</footer>
      </React.Fragment>
    )
  }
}

export default App
