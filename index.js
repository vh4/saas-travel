const express = require('express');
const cors = require('cors');
const Routes = require("./routes/api")
const app = express();
const port = process.env.PORT || 5000;
require('./utils/createFs');

app.use(cors({
    origin:["http://localhost:3000", "http://10.0.9.88:3000", "http://10.0.9.88:1111", "http://localhost:1111"],
    methods: ['GET', 'POST','DELETE', 'PUT'],
    credentials:true
})); 

app.use(express.json());
app.use(Routes);

app.listen(port, ()=>{
    console.log("server listening on port " + port);
})