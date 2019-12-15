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
          this.setState({data:object})
      })
  }


  render() {
    return (
        <MuiThemeProvider theme={theme} >
            <Paper>
                <h1> Management section </h1>
                  <MaterialTable
                    title="User list"
                    columns={this.state.columns}
                    data={this.state.data}
                    editable={{
                      onRowAdd: newData =>
                        new Promise(resolve => {
                          setTimeout(() => {
                            resolve();
                            this.setState(prevState => {
                              const data = [...prevState.data];
                              let refactoredData = newData;
                              refactoredData.password = "default";
                              data.push(refactoredData);
                              this.props.socket.emit("updatedUserList", data)
                              return { ...prevState, data };
                            });
                          }, 600);
                        }),
                      onRowUpdate: (newData, oldData) =>
                        new Promise(resolve => {
                          setTimeout(() => {
                            resolve();
                            if (oldData) {
                             this.setState(prevState => {
                                const data = [...prevState.data];
                                data[data.indexOf(oldData)] = newData;
                                this.props.socket.emit("updatedUserList", data)
                                return { ...prevState, data };
                              });
                            }
                          }, 600);
                        }),
                      onRowDelete: oldData =>
                        new Promise(resolve => {
                          setTimeout(() => {
                            resolve();
                            this.setState(prevState => {
                              const data = [...prevState.data];
                              data.splice(data.indexOf(oldData), 1);
                              this.props.socket.emit("updatedUserList", data)
                              return { ...prevState, data };
                            });
                          }, 600);
                        }),
                    }}
                  />
          </Paper>
      </MuiThemeProvider>
    )
  }
}
