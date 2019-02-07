var express     = require("express")
var app         = express()
var bodyParser 	= require ("body-parser")
var handler     = require("./data/index.js")

var PORT = port = process.env.PORT || 8082

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))

app.get("/", (req, res) => { return handler.getHandler("index", req, res) })
app.get("/getData", (req, res) => { return handler.getHandler("getData", req, res) })

require("http")
 .createServer(app)
   .listen(PORT, () => { console.clear(); console.log("Running in port: " + PORT) })