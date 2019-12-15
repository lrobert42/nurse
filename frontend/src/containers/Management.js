import React from 'react'
import Paper from "@material-ui/core/Paper";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { blue } from "@material-ui/core/colors";
import MaterialTable from "material-table"

const theme = createMuiTheme({ palette: { type: "light", primary: blue } });

export default class Management extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        { title: 'Username', field: 'username' },
        { title: 'Status', field: 'rank', lookup:{'admin':'admin', 'nurse':'nurse'
        }}
      ],
      data: []
    }

  }

  componentDidMount(){
this.props.socket.emit("ask_user_list")

      this.props.socket.on("user_list", object =>{
          const sortedArray = object.slice().sort()
          this.setState({data:sortedArray})
      })
  }

  // shouldComponentUpdate(){
  //
  //     this.props.socket.on("user_list", object =>{
  //         const sortedArray = object.slice().sort()
  //         if (sortedArray !=this.state.data){
  //             this.setState({data:sortedArray}, function(){
  //                 return true
  //             })
  //         }
  //         else {
  //             return false
  //         }
  //     })
  //     return false
  // }

  render() {
      console.log(this.state.data)
      console.log("rendering")
    return (
        <MuiThemeProvider theme={theme} >
            <Paper>
                <h1> Management section </h1>
                  <MaterialTable
                    title="User list"
                    columns={this.state.columns}
                    data={this.state.data}
                    editable={{
                        isDeletable: rowData => rowData.status !== "admin",
                      onRowAdd: newData =>
                        new Promise((resolve, reject) => {
                          setTimeout(() => {
                            {

                              var data = this.state.data;
                              var length = data.length
                              let defaultPassword = newData
                              defaultPassword.password = "default"
                              defaultPassword.tableData = {id:length}
                              data.push(defaultPassword);
                              this.props.socket.emit('updatedUserList', data);
                              this.setState({ data}, function(){
                                  resolve()
                              });
                            }
                            
                        }, 1000)
                        }),
                      onRowUpdate: (newData, oldData) =>
                        new Promise((resolve, reject) => {
                          setTimeout(() => {
                            {
                              const data = this.state.data;
                              const index = data.indexOf(oldData);
                              data[index] = newData;
                               this.props.socket.emit('updatedUserList', data);
                              this.setState({ data }, () => resolve());
                            }
                            resolve()
                          }, 1000)
                        }),
                      onRowDelete: oldData =>
                        new Promise((resolve, reject) => {
                          setTimeout(() => {
                            {
                              let data = this.state.data;
                              const index = data.indexOf(oldData);
                              data.splice(index, 1);
                              this.props.socket.emit('updatedUserList', data)
                              this.setState({ data }, () => resolve());
                            }
                            resolve()
                          }, 1000)
                        }),
                    }}
                  />
          </Paper>
      </MuiThemeProvider>
    )
  }
}
