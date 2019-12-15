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
            return (<h1>1</h1>);
            break;
        case 2:
            return (<h1>2</h1>);
            break;
        case 3:
            return (<h1>3</h1>);
            break;
        case 4:
            return (<h1>4</h1>);
            break;
        default:
            return null;
            break;
    }
}

export default class MainScreen extends React.Component{
    constructor (props){
        super(props)
    }
    render(){
        return(
            <PersistentDrawerLeft handleLogout = {this.props.handleLogout} status={this.props.status}/>
        )
    }
}

function PersistentDrawerLeft(props) {
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
            <MainScreenArea page={page}/>
        </div>

        <Typography paragraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent elementum
          facilisis leo vel. Risus at ultrices mi tempus imperdiet. Semper risus in hendrerit
          gravida rutrum quisque non tellus. Convallis convallis tellus id interdum velit laoreet id
          donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
          adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra nibh cras.
          Metus vulputate eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo quis
          imperdiet massa tincidunt. Cras tincidunt lobortis feugiat vivamus at augue. At augue eget
          arcu dictum varius duis at consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem
          donec massa sapien faucibus et molestie ac.
        </Typography>
        <Typography paragraph>
          Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper eget nulla
          facilisi etiam dignissim diam. Pulvinar elementum integer enim neque volutpat ac
          tincidunt. Ornare suspendisse sed nisi lacus sed viverra tellus. Purus sit amet volutpat
          consequat mauris. Elementum eu facilisis sed odio morbi. Euismod lacinia at quis risus sed
          vulputate odio. Morbi tincidunt ornare massa eget egestas purus viverra accumsan in. In
          hendrerit gravida rutrum quisque non tellus orci ac. Pellentesque nec nam aliquam sem et
          tortor. Habitant morbi tristique senectus et. Adipiscing elit duis tristique sollicitudin
          nibh sit. Ornare aenean euismod elementum nisi quis eleifend. Commodo viverra maecenas
          accumsan lacus vel facilisis. Nulla posuere sollicitudin aliquam ultrices sagittis orci a.
        </Typography>
      </main>
    </div>
  );
}
