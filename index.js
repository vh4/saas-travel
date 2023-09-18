const express = require('express');
const cors = require('cors');
const Routes = require("./routes/api");
const logger = require('./utils/logger.js');
const app = express();
const port = 9999;

app.use(cors({
    origin:["*", "http://localhost:3000", "http://10.0.9.88:3000", "http://10.0.9.88:1111", "http://localhost:1111"],
    methods: ['GET', 'POST','DELETE', 'PUT'],
    credentials:true
})); 

app.use(express.json());
app.use(Routes);

app.listen(port, ()=>{
    logger.info("server listening on port " + port);
})