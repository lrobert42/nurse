import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MailIcon from '@material-ui/icons/Mail';

import Planning from './Planning.js'
import MessageList from './Messages.js'
import Management from "./Management.js"
import AccountSettings from "./Account.js"

import {CalendarToday, AccountCircle, PowerSettingsNew, SupervisorAccount} from "@material-ui/icons"


const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

function MainScreenArea(props){

    switch(props.page){
        case 0:
            return (<Planning />);
            break;
        case 1:
            return (<MessageList />);
            break;
        case 2:
            return (<AccountSettings/>);
            break;
        case 4:
            return (<Management socket={props.socket}/>);
            break;
        default:
            return null;
            break;
    }
}


export default function MainScreen(props) {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const [page, setPage] = React.useState(0);

  const [name, setName] = React.useState("Planning")

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleUserMenuClick = (index) =>{
      switch(index){
        case 0:
            setPage(0)
            setName("Planning")
            break;
        case 1:
            setPage(1)
            setName("Messages")
            break;
        case 2:
            setPage(2)
            setName("Account settings")
            break;
        case 3:
            props.handleLogout("a")
            break;
        case 4:
            setPage(4)
            setName("Management")
            break;
        default:
            return null;
            break;
        }

      console.log(index +" has been clicked")
  }

  const userIconSwitch = (index) => {
      switch(index){
        case 0:
            return(<CalendarToday />)
            break;
        case 1:
            return(<MailIcon />)
            break;
        case 2:
            return(<AccountCircle />)
            break;
        case 3:
            return(<PowerSettingsNew />)
            break;
        default:
            return null;
            break;
        }
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            {name}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
             <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          {['Planning', 'Messages', 'Account', "Log out"].map((text, index) => (
            <ListItem button key={text} onClick = {() =>handleUserMenuClick(index)}>
              <ListItemIcon>{userIconSwitch(index)}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>


    {props.status === "admin" ? (
        <>
        <Divider />
        <List>
            <ListItem key="admin">
                <ListItemText primary={"Admin section"}/>
            </ListItem>
            <ListItem button key={"management"} onClick={() => handleUserMenuClick(4)}>
                  <ListItemIcon>
                      <SupervisorAccount />
                  </ListItemIcon>
              <ListItemText primary="Manage nurses" />
            </ListItem>
      </List>
  </>) : null
    }

      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />

        <div className="mainScreenArea">
            <MainScreenArea page={page} socket={props.socket}/>
        </div>
      </main>
    </div>
  );
}
