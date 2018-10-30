/*
In game chat box component.
Required props:
chatMessages - array of chat message objects
sendMessage(text) - function to send non-privileged
message
*/

import React, {Component} from "react"
import "./InGameChat.css"

class InGameChat extends Component {
    constructor(props){
        super(props)
        this.state = {
            inputBoxText: ""
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleTextInputChange = this.handleTextInputChange.bind(this)
    }
    handleSubmit(event){
        event.preventDefault()
        this.props.sendMessage(this.state.inputBoxText)
        this.setState({
            inputBoxText: ""
        })
    }
    handleTextInputChange(event){
        this.setState({inputBoxText: event.target.value})
    }
    componentDidUpdate(prevProps){
        if(prevProps.chatMessages !== this.props.chatMessages){
            this.ulElementRef.current.lastChild.scrollIntoView(false)
        }
    }
    render(){
        let chatMessageListItems = null
        if(!this.props.chatMessages || this.props.chatMessages.length === 0){
            chatMessageListItems = <li className="chat-log__placeholder-text">No one has said anything yet.
            &nbsp;Start the conversation yourself!</li>
        }
        else{
            chatMessageListItems = this.props.chatMessages.map((messageObj, index) => {
                if(messageObj.playerName && messageObj.text && messageObj.timeStamp){
                    const dateStr = (new Date(messageObj.timeStamp)).toLocaleTimeString()
                    return <li key={index}>({dateStr})&nbsp;
                        <span className="chat-log__username">{messageObj.playerName}: </span>
                        {messageObj.text}</li>
                }
                else{
                    return null
                }
            })
        }
        const receivedMessagesArea = <ul className="chat-log">
            {chatMessageListItems}</ul>
        return(
            <div className="chat-container">
                {receivedMessagesArea}
                <form onSubmit={this.handleSubmit} className={"chat-log__form"}>
                    <input type="text" value={this.state.inputBoxText} onChange={this.handleTextInputChange} />
                    <input type="submit" value="Send" />
                </form>
            </div>
        )
    }
}

export default InGameChat