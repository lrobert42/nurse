import React from 'react'
import Paper from "@material-ui/core/Paper";
import { ViewState } from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  WeekView,
  Appointments,
  AppointmentTooltip,
  DateNavigator,
  Toolbar as ToolbarScheduler,
  TodayButton

} from "@devexpress/dx-react-scheduler-material-ui";
import { MuiThemeProvider, createMuiTheme, withStyles } from "@material-ui/core/styles";
import LocalHospital from '@material-ui/icons/LocalHospital'
import Grid from '@material-ui/core/Grid';
import Room from '@material-ui/icons/Room';

import { blue } from "@material-ui/core/colors";
import { appointments } from "./data";
import Cookies from 'universal-cookie';

// import { fetch_planning } from "../api_communication/planning_api.js"


const theme = createMuiTheme({ palette: { type: "light", primary: blue } });

const style = ({ palette }) => ({
  icon: {
    color: palette.action.active,
  },
  textCenter: {
    textAlign: 'center',
  },
  header: {
    height: '260px',
    backgroundSize: 'cover',
  },
  commandButton: {
    backgroundColor: 'rgba(255,255,255,0.65)',
  },
});

function get_today_date()
{
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;

    return today
}

export default class Planning extends React.PureComponent
{
    constructor(props)
    {
        super(props);


        this.state = {
          data: appointments,
          ids: 0,
          currentDate: get_today_date(),
          test: false
        };


        this.callback = this.callback.bind(this)
        this.fetch_planning = this.fetch_planning.bind(this)
        this.currentDateChange = this.currentDateChange.bind(this)

    }

    async fetch_planning(nurse, date, success_callback, set_error)
    {
        const nurse_id = nurse.id;
        const token = nurse.token;

        const cookies = new Cookies();
        const cookie_token = cookies.get('token')

        const response = await fetch('/treatments/', {
                                method: 'GET',
                                headers: { 'Authorization':  "Bearer " + token},
        })

        let res = await response.json();
        let status = response.status;
        if (status === 200)
        {
            this.callback(res);
        }
        else
        {
           set_error("Could not fetch planning for nurse ")
           console.error(`Request rejected with status ${status} and message ${JSON.stringify(res)}`)
        }

    }

    currentDateChange(currentDate)
    {
          this.setState({currentDate});
          // TO DO : Fetch function to new week
    };

    callback(treatments_array)
    {

            var data = this.state.data

            // data[0].title = "coucou les copains"
            var ids = this.state.ids;

            for (var i =0; i < treatments_array.length; ++i)
            {
                const treatment = treatments_array[i];

                let date = treatment["date"].split("-")

                let year = parseInt(date[0])
                let month = parseInt(date[1])
                let day = parseInt(date[2])

                year = 2020;
                month = 1;
                day = 25
                var new_data = {
                    "title": "ewqewqewqewqewq",
                    "startDate": new Date(year, month, day, 14, 0),
                    "endDate": new Date(year, month, day, 15, 0),
                }

                this.state.data.push(new_data)


            };


            data = this.state.data

            console.log("xxxxxx ici " , data)
            this.forceUpdate();
            this.setState({data: data, ids: ids, test: true})
    }

    componentDidMount()
    {
        const lol = this.fetch_planning({id: 1, token: this.props.token}, "", this.callback, console.log, this)

    }

    render()
    {

        const {data, currentDate} = this.state;

        const Content = withStyles(style, {name: 'Content'})(({
          children, appointmentData, classes, ...restProps
        }) => (
          <AppointmentTooltip.Content {...restProps} appointmentData={appointmentData}>
            <Grid container alignItems="center">
              <Grid item xs={2} className={classes.textCenter}>
                <Room className={classes.icon} />
              </Grid>
              <Grid item xs={4}>
                <span>{appointmentData.location}</span>
              </Grid>
            </Grid>
            <Grid container alignItems="center">
              <Grid item xs={2} className={classes.textCenter}>
                <LocalHospital className={classes.icon} />
              </Grid>
              <Grid item xs={4}>
                <span>{appointmentData.treatment}</span>
              </Grid> 
            </Grid>
          </AppointmentTooltip.Content>
        ));

        const CommandButton = withStyles(style, { name: 'CommandButton' })(({
          classes, ...restProps
        }) => (
          <AppointmentTooltip.CommandButton {...restProps} className={classes.commandButton} />
        ));


        return (!this.state.test ? <div></div> :

          <MuiThemeProvider theme={theme}>
            <Paper>
              <Scheduler data={data}>
                <ViewState
                    currentDate={currentDate}
                    onCurrentDateChange={this.currentDateChange}
                />
                <WeekView startDayHour={9} endDayHour={19} />
                <ToolbarScheduler/>
                <DateNavigator />
                <TodayButton />
                <Appointments />
                <AppointmentTooltip 
                  contentComponent={Content}
                  commandButtonComponent={CommandButton}
                  showCloseButton/>
              </Scheduler>
            </Paper>
          </MuiThemeProvider>
        );
    }
}
