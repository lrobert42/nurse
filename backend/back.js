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
                return array[i].rank
            }
        }
        return null
    }
}

function registerUser(socket, credentials){
    let path = "./users/userList.json"
    fs.exists(path, function(exists){
        if (exists){
            fs.readFile(path, 'utf-8', function(err, data){
                if (err){
                    throw err
                } else {
                    var userList = JSON.parse(data)
                    let removedPassword = credentials
                    removedPassword.password = null
                    if (isInArray(userList, removedPassword))
                    {
                        console.log(credentials.username +" is already registered")
                        socket.emit('already_registered', credentials.username)
                    }
                    else {
                        credentials.rank="nurse"
                        userList.push(credentials)
                        json = JSON.stringify(userList)
                        fs.writeFile(path, json, function(err){
                            if (err)
                            {   throw err}
                            else {
                                console.log("Registration approved. New user: " + credentials.username)
                                socket.emit('registration_approved', credentials)
                            }
                        })
                    }
                }
            })
        }
    })
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
                    let rank = isInArray(userList, credentials)
                    if (userInArray !== null)
                    {
                        console.log(credentials.username +" is connecting")
                        socket.emit('connection_approved', rank)
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
    socket.on("registration_asked", function(credentials){
            registerUser(socket, credentials)
    })

    socket.on("ask_user_list", function() {
            sendUserList(socket)
    })


})

server.listen(3001, "localhost")
