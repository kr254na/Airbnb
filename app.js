if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}
const express = require('express');
const app = express();
const methodOverride=require('method-override');
const ejsMate = require("ejs-mate");
const mongoose = require('mongoose');
const mongoStore = require('connect-mongo');
const port = 8080;
/*const mongoUrl = 'mongodb://127.0.0.1:27017/wanderlust';*/
const mongoUrl = process.env.ATLASDB_URL;
const path = require('path');
const listingsRouter = require('./routes/listing.js');
const reviewsRouter = require('./routes/review.js');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require("./models/user.js");
const signupRouter = require('./routes/signup.js');
const loginRouter = require('./routes/login.js');
const logoutRouter = require('./routes/logout.js');
const expressError = require('./utils/ExpressErrors.js');
const store = mongoStore.create(
    {
        mongoUrl: mongoUrl,
        crypto: {
            secret:process.env.SECRET
        },
        touchAfter: 24 * 60 * 60 // time period in seconds to update session expiration
    }
)
store.on("error", () => {
    console.log("Error in mongo session store", err);
})
const sessionOptions = {
    store,//store:store
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() * 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly:true
    }
}
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, 'views'));
app.use(methodOverride("_method"));
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
async function main() {
    await mongoose.connect(mongoUrl);
}
main().then(() => {
    console.log('Connected to MongoDB');
})
    .catch((err)=>{
        console.log(err);
    });
/*app.get("/testListing", async(req, res) => {
    let sampleListing = new Listing({
        title: 'My New Villa',
        description: 'By the beach',
        location: 'Calangute,Goa',
        price: 1200,
        country: 'India'
    });
    await sampleListing.save();
    console.log("Sample was saved");
    res.send('Test listing created');
});*/
//listings
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});
app.use("/listings", listingsRouter);
//Reviews
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/login", loginRouter);
app.use("/signup", signupRouter);
app.use("/logout", logoutRouter);
app.all("*", (req, res, next) => {
    next(new expressError(404, "Page Not Found!"));
});
app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong!" } = err;
    res.status(status).render("listings/error.ejs", { message });
});
app.listen(port, (req, res) => {
    console.log(`Listening to port ${port}`);
});