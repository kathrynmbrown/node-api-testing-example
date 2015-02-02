var express = require('express'),
	bodyParser = require('body-parser'),
	port = process.env.PORT || 3000,
	app = express();

app.use(express.static(__dirname + '/public'))

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

var locationList = [];

app.get('/users/1', function(req, res) {
	var user = {
		name: "Karen",
		email: "karen@example.com",
		phoneNumber: "5556667777",
		role: "admin"
	};
	res.send(user);
});

app.put('/users/1', function(req, res) {
	var user = {
		name: req.body.name,
		email: req.body.email,
		phoneNumber: req.body.phoneNumber,
		role: req.body.role
	};
	res.send(user);
});

app.post('/locations', function(req, res) {
	var location = {
    addressStreet: req.body.addressStreet,
		addressCity: req.body.addressCity,
		addressState: req.body.addressState,
		addressZip: req.body.addressZip,
		userId: req.body.userId
	};
	locationList.push(location);
	res.send(location);
});

app.get('/users/1/location', function(req, res) {
	res.send(locationList[0]);
});

app.get('/users/2/location', function(req, res) {
   if (req.body.userId == 2) {
 		res.send(locationList[0]);
 	} else {
		res.send(401);
 	}
});

app.listen(port);
console.log("Server loaded. The magic happens on port", port)
