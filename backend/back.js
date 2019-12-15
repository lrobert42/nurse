var http = require('http')
var fs = require('fs')

var server = http.createServer(function(req, res){
        res.writeHead(200, {"Content-type":"text/html"})
        res.end()
    })
var io = require('socket.io')(server, {
    //TODO change
    pingInterval: 100000000,
    pingTimeout: 10000
})

function isInArray(array, object){

    if (array.length == 0)
    {
        return null
    }
     else {
        for (i = 0; i < array.length; i++){
            if ((array[i].username === object.username && array[i].password == object.password) ||(object.password == null && array[i].username == object.usermame))
            {
                return array[i]
            }
        }
        return null
    }
}


function checkUserList(socket, credentials){
    let path = "./users/userList.json"
    fs.exists(path, function(exists){
        if (exists){
            fs.readFile(path, 'utf-8', function(err, data){
                if (err){
                    throw err
                } else {
                    var userList = JSON.parse(data)
                    let user = isInArray(userList, credentials)
                    if (user !== null)
                    {
                        console.log(credentials.username +" is connecting")
                        socket.emit('connection_approved', user)
                    }
                    else {
                        console.log("Wrong credentials. Connection denied")
                        socket.emit('connection_denied')
                    }
                }
            })
        }
    })
}

function updateUserList(userList){
    console.log("updating user list")
    console.log(userList)
    let path = "./users/userList.json"
    json = JSON.stringify(userList)
    fs.writeFile(path, json, function(err){
        if(err){
            throw(err)
        }
    })
    sendUserList(socket)
}


function sendUserList(socket){
    let path = "./users/userList.json"
    fs.exists(path, function(exists){
        if (exists){
            fs.readFile(path, 'utf-8', function(err, data){
                if (err){
                    throw err
                } else {
                    var userList = JSON.parse(data)
                    socket.emit("user_list", userList);
                }
            })
        }
    })
}

io.sockets.on('connection', function(socket){

    socket.on('new_client', function(credentials){
        //TODO check if user is already connected
            checkUserList(socket, credentials)
        })

    socket.on("ask_user_list", function() {
            sendUserList(socket)
    })

    socket.on("updatedUserList", function(userList){
            updateUserList(userList)
    })


})

server.listen(3001, "localhost")
