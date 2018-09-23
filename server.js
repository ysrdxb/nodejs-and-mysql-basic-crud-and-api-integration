const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nodedb'
});
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected!');
});



const app = express();

const apiKey = '1f89b4c0047500e917ded512d75f8f73';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  res.render('index', {weather: null, error: null});
});
app.get('/about', function(req,res){
  res.render('about');
});
app.get('/contact', function(req,res){
  res.render('contact', {ctext: null});
//  res.render('contact');
});
app.get('/services', function(req,res){
  res.render('services');
});
app.post('/contact', function (req,res) {
  let yname = req.body.yname;
  let yemail = req.body.yemail;
  let ymessage = req.body.ymessage;

  //insert into db
  const contact_data = { name: yname, email: yemail, message: ymessage };
  connection.query('INSERT INTO contactus SET ?', contact_data, (err, res) => {
    if(err) throw err;
  
    console.log('Last insert ID:', res.insertId);
  });


     // let yname = JSON.parse(body)
     // let contacttext = `Thanks for contacting us!`;
        var ctext = '';
    console.log(yname);
        res.render('contact', {ctext: 'Thanks for contacting us! Data inserted'});
});
app.post('/', function (req, res) {
  let city = req.body.city;
  let yname = req.body.yname;
 // console.log(req.body.yname);

  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

  request(url, function (err, response, body) {
    if(err){
      res.render('index', {weather: null, error: 'Oops, no result found!',yname:yname});
    } else {
      let weather = JSON.parse(body)
      if(weather.main == undefined){
        res.render('index', {weather: null, error: 'Oops, city not found',yname:yname});
      } else {
        let weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
        res.render('index', {weather: weatherText, error: null,yname:yname});
      }
    }
  });
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
  
})