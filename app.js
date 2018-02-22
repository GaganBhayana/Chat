var express = require('express');


server = require('http').createServer(app);
io = require('socket.io').listen(server);
usernames= [];
app =express(); 

server.listen(process.env.PORT || 3000,function(){
	console.log("server Started!");
})

app.get('/',function(req,res){
	res.sendFile(__dirname+'/index.html')
	// res.sendFile("./index.html");
	// res.render("index.html");
})

io.sockets.on('connection',function(socket){//everything of server side
	
	socket.on('new user',function(data,callback){ // similar to req,res
		if(usernames.indexOf(data)!= -1)// chscking id username is already existed
		{
			callback(false);
		}
		else
		{
			callback(true);
			socket.username = data;
			usernames.push(socket.username);
			updateUserNames();
		}
	});

	function updateUserNames()
	{
		io.sockets.emit('usernames',usernames);
	}

	socket.on('send message',function(data){
		io.sockets.emit('new message',{msg:data,user:socket.username});//the whole data is transferred to client side using the 'new message' variable
	})
	
	// Disconnect
	socket.on('disconnnect',function(data){ //disconnect call is sent automatically
		if(!socket.username)
			return;
		usernames.splice(usernames.indexOf(socket.username),1);
		updateUserNames();
	})
})
