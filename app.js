if(process.env.NODE_ENV !== "production"){
require('dotenv').config();
}

const express = require("express");
const app = express();
const path = require("path");
const port = 8080;
const mongoose = require("mongoose");
let  dburl = process.env.ATLASDB_URL;
let methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listings.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


main()
.then((res)=>{
    console.log("connected to DB");
}).catch((e)=>{
    console.log(e);
})


async function main(){
    await mongoose.connect(dburl);
}

app.set("view engine" , "ejs");
app.set("views",path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public/css")));
app.use(express.static(path.join(__dirname,"/public/js")));


const store = MongoStore.create({
    mongoUrl: dburl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600 //seconds this is for session 
})

store.on("error",(err)=>{
    console.log("ERROR IN MONGO SESSION STORE:",err);
})

const sessionOption = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7*24*60*60*1000,
        maxAge : 7*24*60*60*1000,
        httpOnly : true,
    }
}


app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currUser = req.user; 
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

app.get("/demoUser",async(req,res)=>{
    let fakeUser = new User({
        email : "abc@gmail.com",
        username  : "abc@fake"
    })

    let user = await User.register(fakeUser, "abc@pass");
    res.send(user);
});

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);

// Global error handler
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("listings/error.ejs",{message});
});

app.listen(port,()=>{
    console.log("server listening 8080 port");
})