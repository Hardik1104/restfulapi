var express=require('express');
var app=express();
var bodyParser=require('body-parser');
var mongoose=require('mongoose');
var Vehicle=require('./app/models/vehicle');

//Configure app for bodyParser()
//lets us grab data from the body of POST
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//setup port for server to listen

var port=process.env.PORT || 3000;

//Connect to DB

mongoose.connect('mongodb://localhost:27017/codealong');

//API Routes
var router = express.Router();

//Routes will all be prefixed with /API
app.use('/api',router);

//MIDDLEWARE-
//Middleware can be very useful for validations.we can codealong
//things from here or stop the request from continuing in the event
//that the request is not safe
//Middleware to use for all request
router.use(function(req,res,next){
  console.log('FYI..There some processing currently going');
  next();
});

//Test Routes
router.get('/',function(req,res){
  res.json({message:'Welcome to our API'});
});
//vehicle routes
router.route('/vehicles')
.post(function(req, res) {
    var vehicle = new Vehicle(); // new instance of a vehicle
    vehicle.make = req.body.make;
    vehicle.model = req.body.model;
    vehicle.color = req.body.color;

    vehicle.save(function(err) {
      if (err) {
        res.send(err);
      }
      res.json({message: 'Vehicle was successfully manufactured'});
    });
  })
.get(function(req,res){
  Vehicle.find(function(err,vehicles){
    if(err){
      res.send(err)
    }
    res.json(vehicles);
  });
});
//Find vehicle by ID
router.route('/vehicle/:vehicle_id')
.get(function(req,res){
  Vehicle.findById(req.params.vehicle_id,function(err,vehicle){
    if(err){
      res.send(err);
    }
    res.json(vehicle);
  });
});
//Find vehicle by make
router.route('/vehicle/make/:make')
.get(function(req,res){
  Vehicle.find({make:req.params.make},function(err,vehicle){
    if(err){
      res.send(err);
    }
    res.json(vehicle);
  });
});
//Find vehicle by make
router.route('/vehicle/color/:color')
.get(function(req,res){
  Vehicle.find({color:req.params.color},function(err,vehicle){
    if(err){
      res.send(err);
    }
    res.json(vehicle);
  });
});
//Fire up server

app.listen(port);

//Print message to console
console.log('Server listening on port '+port);
