/* Core NPMs */
import express from 'express'
import compression from 'compression'
import fileupload from "express-fileupload";
import cors from 'cors'
import cookieParser from "cookie-parser";
import http from 'http'
import cron from 'node-cron'


/* Defining app for server */
export const app = express()


/* Files or FUNCTIONS */
import config from './config/config'
import { DecryptRequest } from './helper/decrypt';
import mongoCon from './config/mongoconnect';
import { Server } from 'socket.io';
import { socket } from './helper/socket';
import morganfile from './config/morgonmiddleware';


/* Routers */
import all_router from './v1_app/routes/all_routes';



/* const datas */
const cacheTime = 86400000 * 3


/* CRON INITIATE */
// cron.schedule('*/10 * * * * *', () => {
       // CRON FUNCTIONS
// });


app.use(
  cors(),  // prevent cors origin error
  express.urlencoded({extended: false, parameterLimit: 1000}), // parse request url
  express.json(),  // Accessing json data
  fileupload(),  // Accessing Files on request
  cookieParser(),
  compression(), // compress to our response
  morganfile(), // Morgon for inspect which route was calling
  async (req, res, next) => {
    //set a responce headers
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials', true);
    res.setHeader('Last-Modified', (new Date()).toUTCString());
    res.header('no-referrer-when-downgrade', '*');
    res.header('no-referrer', '*');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    /* ORGIN VERIFY */
    let Whitlist = ["http://localhost:3000", "https://localhost:3000", "http://localhost:3001"]
    let origin = req.get('origin');

    if (Whitlist.indexOf(origin) !== -1) {
      DecryptRequest(req, res, next)
    }
    else {
      return res.status(400).json({ "status": false, "msg": "Origin Failed", success: 'error' })
    }
  }
)

/* PUBLIC FILE CONFIGRATION */
app.use('/', express.static(path.join(__dirname, 'public'), {
  maxAge: cacheTime
}))


/* ROUTES FILES */
app.get("/", (req, res) => {
  res.write(`<a href =${config.SITE_URL}>Click To Redirect The ${config.SITE_NAME}</a>`)
})

/* Routers Defining */
app.use(all_router)


/* SERVER CREATION FOR SOCKET */
const server = http.createServer(app)

/* SOCKET CONFIGRATION */
export const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000','http://localhost:3001','https://localhost:3000','https://localhost:3001' ],
    methods: ['GET', "POST"]
  }
})

/* PORT LISTENIGN FOR SERVER */
server.listen(config.PORT,async()=>{
  console.log('PORT Listening-->',config.PORT)
  mongoCon(config.MONGOURI)
})


/* SOCKET CONNECTION */
server.on('listening', async () => {
  await socket(io,app)
})