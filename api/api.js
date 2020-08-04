const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://Vansh:Naman1703@cluster0.zdswl.mongodb.net',{useNewUrlParser: true, useUnifiedTopology: true });
const Device = require('./models/device');
const User = require('./models/user');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { exists } = require('./models/device');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const port = process.env.PORT || 5000;
//mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
/**
* @api {get} /api/test Test API
* @apiGroup Test
* @apiSuccessExample {string} Success-Response:
* 'The API is working!'
* @apiErrorExample {string} Error-Response:
* {
* "null"
* }
*/
app.get('/api/test', (req, res) => {
 res.send('The API is working!');
});
app.use(express.static(`${__dirname}/public/generated-docs`));
app.get('/docs', (req, res) => {
 res.sendFile(`${__dirname}/public/generated-docs/index.html`);
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-RequestedWith, Content-Type, Accept");
    next();
   });

/**
* @api {get} /api/devices/:deviceId/device-history AllDevices An array of device id
* @apiGroup Device with their Id's
* @apiSuccessExample {json} Success-Response:
* [
* {
* {
* "ts": "1529542230",
* "temp": 12,
* "loc": {
* "lat": -37.84674,
* "lon": 145.115113
* },
* {
* "ts": "1529572230",
* "temp": 17,
* "loc": {
* "lat": -37.850026,
* "lon": 145.117683
* }
*{
* "ts": "1529545935",
* "temp": 14,
* "loc": {
* "lat": -37.839587,
* "lon": 145.101386
*}
*}
* ]
* @apiErrorExample {json} Error-Response:
* {
* "null"
* }
*/
app.get('/api/devices/:deviceId/device-history', (req, res) => {
    const { deviceId } = req.params;
    Device.findOne({"_id": deviceId }, (err, devices) => {
    const { sensorData } = devices;
    return err
    ? res.send(err)
    : res.send(sensorData);
    });
   });

/**
* @api {get} /api/devices AllDevices An array of all devices
* @apiGroup Device
* @apiSuccessExample {json} Success-Response:
* [
* {
* "_id": "dsohsdohsdofhsofhosfhsofh",
* "name": "Mary's iPhone",
* "user": "mary",
* "sensorData": [
* {
* "ts": "1529542230",
* "temp": 12,
* "loc": {
* "lat": -37.84674,
* "lon": 145.115113
* }
* },
* {
* "ts": "1529572230",
* "temp": 17,
* "loc": {
* "lat": -37.850026,
* "lon": 145.117683
* }
* }
* ]
* }
* ]
* @apiErrorExample {json} Error-Response:
* {
* "User does not exist"
* }
*/
app.get('/api/devices', (req, res) => {
    Device.find({}, (err, devices) => {
    if (err == true) {
        return res.send(err);
    } else {
        return res.send(devices);
        }
    });
    });

app.post('/api/devices', (req, res) => {
    const { name, user, sensorData } = req.body;
    const newDevice = new Device({
    name,
    user,
    sensorData
    });
    newDevice.save(err => {
    return err
    ? res.send(err)
    : res.send('successfully added device and data');
    });
   });
   app.post('/api/send-command', (req, res) => {
    console.log(req.body);
   });
   app.post('/api/authenticate', (req, res) => {
        const {user, password} = req.body;
        console.log(req.body);
        User.findOne({name:user},(err,found) => {
        if( err )
        {
            return res.send(err);
        }
        else if(!found)
        {
            return res.send('Sorry. We cant find any such username');
        }
        else if(found.password != password)
        {
            return res.send('The password is invalid');
        }
        else
        {
            return res.json({
                success: true,
                message: 'Authenticated successfully',
                isAdmin: found.isAdmin
               });
        }
    });
});
        app.post('/api/register', (req, res) => {
            const {user, password,isAdmin} = req.body;
            console.log(req.body);
        User.findOne({name:user},(err,found) => {
        if( err )
        {
            return res.send(err);
        }
        else if(found)
        {
            return res.send('User already exists');
        }
        else{
        const newUser = new User({
            name: user,
            password,
            isAdmin
           });
           newUser.save(err => {
            return err
            ? res.send(err)
            : res.json({
            success: true,
            message: 'Created new user'
            });
           });
        }
        });
    });

/**
* @api {get} /api/users/:user/devices AllDevices An array of users
* @apiGroup Device with the user names
* @apiSuccessExample {json} Success-Response:
* [
*{
*"sensorData": [],
*"_id": "5f225c5b866960ead8027cd0",
*"name": "apple",
*"user": "test",
*"__v": 0
*},
*{
*"sensorData": [
*{
*"ts": "1529545935",
*"temp": 14,
*"loc": {
*"lat": -37.839587,
*"lon": 145.101386
*}
*}
*]
*},
*{
*"_id": "5f19550f21c699eb8c6ef582",
*"name": "Bob's Samsung Galaxy",
*"user": "bob",
*"id": "7"
*},
*{
*"sensorData": [
*{
*"ts": "1529572230",
*"temp": 14,
*"loc": {
*"lat": -37.850026,
*"lon": 145.117683
*}
*}
*]
*},
*{
*"sensorData": [
*{
*"ts": "1529545935",
*"temp": 14,
*"loc": {
*"lat": -37.839587,
*"lon": 145.101386
*}
*}
*],
*"_id": "5f195755d15e4b29145af3f2",
*"name": "Bob's Samsung Galaxy",
*"user": "bob",
*"id": "7"
*},
*{
*"_id": "5f19550f21c699eb8c6ef583",
*"id": "2",
*"name": "Sam's iPhone",
*"user": "sam"
*}
*]
* @apiErrorExample {json} Error-Response:
*{
* "User does not exist"
*}
*/


    app.get('/api/users/:user/devices', (req, res) => {
        const { user } = req.params;
        Device.find({ "user": user }, (err, devices) => {
        return err
        ? res.send(err)
        : res.send(devices);
        });
       });


app.listen(port, () => {
 console.log(`listening on port ${port}`);
});
