const express = require('express')
var cors = require('cors')
const path = require('path')
const PORT = process.env.PORT || 5000
const mysql = require('mysql');
var util = require('util');

const con = mysql.createConnection({
  host: "remotemysql.com",
  port: '3306',
  user: "bDmi1fwKY7",
  password: "sqXlPyCLv3"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

const query = util.promisify(con.query).bind(con);

async function getActivities() 
{
  let activity = await query("select * from bDmi1fwKY7.activity");

  return JSON.stringify(JSON.parse(JSON.stringify(activity)));
}

async function addActivity(body) 
{
  let res = await query(
    `INSERT INTO bDmi1fwKY7.activity (date, type, distance, duration, speed) ` +
    `VALUES('${body.date}', '${body.type}', '${body.distance}', '${body.duration}', '${body.speed}')`
  );

  return res;
}

let app = express()

app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => {res.render('pages/index')})
app.get('/activities', async (req, res) => {res.json(await getActivities())})
app.post('/add', async (req, res) => {res.json(await addActivity(req.body))})
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
