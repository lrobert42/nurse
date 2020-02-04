import React from 'react'
import Paper from "@material-ui/core/Paper";
import { ViewState } from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  WeekView,
  Appointments,
  AppointmentTooltip,

} from "@devexpress/dx-react-scheduler-material-ui";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { blue } from "@material-ui/core/colors";
import { appointments } from "./data";

// import { fetch_planning } from "../api_communication/planning_api.js"


const theme = createMuiTheme({ palette: { type: "light", primary: blue } });

export default class Planning extends React.PureComponent
{
    constructor(props)
    {
        super(props);


        this.state = {
          data: [],
          ids: 0,
          test: false
        };


        this.callback = this.callback.bind(this)
        this.fetch_planning = this.fetch_planning.bind(this)


        console.log("lavba ", this.state)

        console.log("hello constructeur ", this.state.data)


        this.state.data.push({title:"CACA", startDate: new Date(2020, 1, 25, 10, 0), endDate: new Date(2020, 1, 25, 11, 0)})

        console.log("je passe ici 1")
    }

    async fetch_planning(nurse, date, success_callback, set_error)
    {
        const nurse_id = nurse.id;
        const token = nurse.token;


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

            console.log("je passe ici 2")

            data = this.state.data

            console.log("xxxxxx ici " , data)
            this.forceUpdate();
            this.setState({data: data, ids: ids, test: true})
    }

    componentDidMount()
    {
        const lol = this.fetch_planning({id: 1, token: this.props.token}, "", this.callback, console.log, this)
        console.log("ici 4")

    }

    render()
    {

        const data = this.state.data;

        console.log("hello ", data)
            console.log("je passe ici 3")


        return (!this.state.test ? <div></div> :

          <MuiThemeProvider theme={theme}>
            <Paper>
              <Scheduler data={data}>
                <ViewState currentDate="2020-02-23" />
                <WeekView startDayHour={9} endDayHour={19} />
                <Appointments />
                <AppointmentTooltip />
              </Scheduler>
            </Paper>
          </MuiThemeProvider>
        );
    }
}
