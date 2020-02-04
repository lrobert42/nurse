import React from 'react'
import Paper from "@material-ui/core/Paper";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { blue } from "@material-ui/core/colors";
import MaterialTable from "material-table"
import Cookies from 'universal-cookie'

const theme = createMuiTheme({ palette: { type: "light", primary: blue } });

export default class NurseManagement extends React.Component
{
    constructor(props)
    {
        super(props);
        const cookies = new Cookies();
        const cookie_token = cookies.get('token')

        this.state = {
            columns: [
                    { title: 'Username', field: 'name' },
                //    { title:'Address', field:'address'},
                    { title: 'Status', field: 'rank', lookup: { 'admin':'admin', 'nurse':'nurse' } },
                ],
            data: [],
            access_token:cookie_token.access_token
        }
        this.get_nurses_callback = this.get_nurses_callback.bind(this)
        this.set_error = this.set_error.bind(this)
    }


  async fetch_nurses_list(get_nurses_callback, set_error)
  {

      const response = await fetch('/nurses/', {
                              method: 'GET',
                              headers: { 'Authorization':  "Bearer " + this.state.access_token},
      })

      let res = await response.json();
      let status = response.status;
      if (status === 200)
      {
          this.get_nurses_callback(res);
      }
      else
      {
         set_error("Could not fetch planning for nurse ")
         console.error(`Request rejected with status ${status} and message ${JSON.stringify(res)}`)
      }
  }

    get_nurses_callback(res)
    {
      this.setState({data:res}, () =>{console.log(this.state.data)})
    }

    set_error(e)
    {
        console.error(e)
    }
    componentDidMount()
    {
        this.fetch_nurses_list(this.get_nurses_callback, this.set_error)
    }

    on_row_add(newData)
    {
        this.setState(prevState => {
            console.log("yyy ==> ewq" )
            const data = [...prevState.data];
            let refactoredData = newData;
            refactoredData.password = "default";

            data.push(refactoredData);

            console.log("yyy ==> ", data )
            this.add_nurse(newData)

            // TODO: Add a fetch here
            return { ...prevState, data };
        });
    }

    async add_nurse(newData){
      console.log("NEWDATA IS HERE     ", newData)
      let date = new Date()
      console.log("DATE          ", date)
      // let newNurse = {
      //   user:0,
      //   name:newData.name,
      //   address:newData.address,
      //   treatment_types:newData.treatment_types,
      //   agenda:date
      // }
    }

    on_row_update(new_data, old_data)
    {
        if (old_data)
        {
            this.setState(prevState => {
                const data = [...prevState.data];
                data[data.indexOf(old_data)] = new_data;

                // this.props.socket.emit("updatedUserList", data)

                // ManagementApi.edit_nurse()
                // TODO: Add a fetch here
                return { ...prevState, data };
            });
        }
    }

    on_row_delete(old_data)
    {
        this.setState(prevState => {
            const data = [...prevState.data];
            data.splice(data.indexOf(old_data), 1);

            // this.props.socket.emit("updatedUserList", data)

            // ManagementApi.delete_nurse()

            // TODO: Add a fetch here
            return { ...prevState, data };
        });
    }

    render() {
        return (
                <MuiThemeProvider theme={theme} >
                    <Paper>
                            <h1> Management section </h1>

                                <MaterialTable

                                    title = "Nurse list"
                                    columns = {this.state.columns}
                                    data = {this.state.data}

                                    editable = {{

                                        onRowAdd: newData =>
                                            new Promise(resolve => {
                                                console.log("ICI     ", newData)
                                                this.on_row_add(newData);
                                                resolve();
                                            }),

                                        onRowUpdate: (newData, oldData) =>
                                            new Promise(resolve => {
                                                resolve()
                                                this.on_row_update(newData, oldData)
                                            }),

                                        onRowDelete: oldData =>
                                            new Promise(resolve => {
                                                resolve()
                                                this.on_row_delete(oldData)
                                            }),
                                    }}
                                />
                </Paper>
            </MuiThemeProvider>
        )
    }
}
