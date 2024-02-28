const authRoute = require("../routes/auth");

const routes = (app) => {
    app.get("/v1/", (req,res)=>{
        res.send("Hello world");
      })
    app.use("/v1/auth", authRoute);
}

module.exports = routes