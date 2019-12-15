import React from 'react'
import Paper from "@material-ui/core/Paper";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import DraftsIcon from '@material-ui/icons/Drafts';
import ListItem from '@material-ui/core/ListItem'
import List from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import { blue } from "@material-ui/core/colors";
import "./Messages.css";


const theme = createMuiTheme({ palette: { type: "light", primary: blue } });

const messages = ["Lorem ipsum","Lorem ipsum","Lorem ipsum","Lorem ipsum","Lorem ipsum","Lorem ipsum","Lorem ipsum","Lorem ipsum","Lorem ipsum",]

const flexContainer = {
  display: 'flex',
  flexDirection: 'column',
  padding: 0,

};

export default function MessageList(){

const renderMessageList = (message, index) => {
    return (

        <ListItem key={index}>
            <ListItemIcon>
                 <DraftsIcon/>
             </ListItemIcon>
            <ListItemText primary={message}/>
        </ListItem>
    )
}

    return (
        <MuiThemeProvider theme={theme} className="messageList">
            <Paper>
                <h1> No new notification </h1>

                <h2> Last messages: </h2>
                <List style={flexContainer}>
                    {messages.map((messages, index) => renderMessageList(messages, index))}
                </List>
            </Paper>
        </MuiThemeProvider>
    )
}
