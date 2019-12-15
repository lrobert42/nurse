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

const flexContainer = {
  display: 'flex',
  flexDirection: 'column',
  padding: 0,

};

export default class Management extends React.Component{
    constructor(props){
        super(props)

        this.props.socket.emit("ask_user_list")
        this.props.socket.on("user_list", object =>{
            console.log(object)
        })
    }

    componentWillMount(){

    }

render(){

    return (
        <MuiThemeProvider theme={theme} >
            <Paper>
                <h1> Management section </h1>

                <h2> Userlist: </h2>
                <List style={flexContainer}>

                </List>
            </Paper>
        </MuiThemeProvider>
    )}
}
