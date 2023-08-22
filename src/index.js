const express = require("express");
const app = express()
const routes = require("./router/router");

app.use(express.json());
const port = 3001
app.use("/",routes)

app.listen(port,()=>{
    console.log(`server is running on ${port}`)
})