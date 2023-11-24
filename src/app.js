import express from "express";
import bodyparser from 'body-parser';
import hbs from 'hbs';
import routes from './controller/main.js'
import mongodb from 'mongodb';
import DbClient from './CommanFiles/DbClient.js';
import session from 'express-session';
import {v4 as uuidv4} from 'uuid';


const PORT = process.env.PORT || 3000;
const app = express()
const mongodbClient = mongodb.MongoClient;
const url = `mongodb+srv://gajrajnitin201:nfwhGAXYflThqCjw@cluster0.1n5wlfw.mongodb.net/?retryWrites=true&w=majority`


app.use(bodyparser.json({ limit: '10mb' }));
app.use(bodyparser.urlencoded({
    extended:true
}))
app.use(session({
    secret:uuidv4(),
    resave:false,
    saveUninitialized:true,
    cookie: {
        maxAge: 3600000 // Session expires after 1 hour (in milliseconds)
    }
}));

app.use('/static',express.static("public"));
app.use('/inboxMailHtml/static',express.static("public"));
app.set('view engine','hbs')
app.set('views','views');
app.use('/',routes);
hbs.registerPartials("views/partials")


mongodbClient.connect(url,{
    maxPoolSize:50,
    wtimeoutMS: 2500,
    useNewUrlParser:true,
}).catch(e=>console.log("error in app.js"+e.message))
.then(async client=>{
    DbClient.injectDb(client);
    console.log('Db connected');
})  

app.listen(PORT,()=>{
    console.log('Application started')
})