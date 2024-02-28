const authRoute = require("../routes/auth");
const postRoute = require("../routes/post"); 
const userRoute = require("../routes/user");

const routes = (app) => {
    app.get("/v1/", (req,res)=>{
        res.send("Hello world");
      })
    app.use("/v1/auth", authRoute);
    app.use("/v1/post", postRoute);
    app.use("/v1/users", userRoute);
}

module.exports = routes