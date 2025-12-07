const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const {connectToMongoDB} = require("./connect");
const {restrictToLoggedinUserOnly, checkAuth} = require("./middleware/auth");
const URL = require('./models/url');

const urlRoute = require('./routes/url');
const staticRoute = require('./routes/staticRouter');
const userRouter = require('./routes/user');

const app = express();
const http = require('node:http');
const { timeStamp } = require("node:console");

const hostname = '127.0.0.1';
const PORT = 8001;

connectToMongoDB('mongodb://127.0.0.1:27017/short-url').then(() => console.log('MongoDb Connected'))

app.set("view engine", "ejs");
app.set('views', path.resolve('./views'));

app.use(express.json());
app.use(express.urlencoded({extended: false})); 
app.use(cookieParser()); 

app.use("/url", restrictToLoggedinUserOnly, urlRoute);
app.use("/user",  userRouter);
app.use("/", checkAuth, staticRoute); 
 
app.get('/url/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId
    },{ $push: {
        visitHistory: { timeStamp: Date.now()},
    }});
    res.redirect(entry.redirectURL);
})

app.listen(PORT, ()=> console.log(`Server Started at PORT ${PORT}`));
// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Hello, World!\n');
// });
// server.listen(PORT, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// }); 