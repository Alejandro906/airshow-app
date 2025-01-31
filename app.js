const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Airshow = require('./models/Airshow')
const Aircraft = require('./models/Aircraft')
const Ticket = require('./models/Ticket')
const User = require('./models/User')
require('dotenv').config()
const passport = require('passport')
const session = require('express-session')
const flash = require('express-flash')
const { addLoggedInUser } = require('./utils/loggedInUser');

const airshowRouter = require('./routes/airshow')
const aircraftRouter = require('./routes/aircraft')
const ticketRouter = require('./routes/ticket')
const authRouter = require('./routes/auth')
const userRouter = require('./routes/user')

const port = process.env.PORT || 3000

app.set('view engine', 'ejs')
app.use(flash());
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(passport.initialize())
app.use(session({
  secret: 'secret', 
  resave : false,
  saveUninitialized : false
}))
app.use(passport.session())

app.use(addLoggedInUser);


const connect = async () => {
    try{
      await mongoose.connect(process.env.MONGO_URL)
      console.log('Connected to mongoDB')
    }catch (err){
      console.log(err)
    }
}

app.get('/', async (req, res) => {
    let loggedIn;
    if(req.isAuthenticated()){
        const user = await User.findById(req.user.id);
        loggedIn = user;
    }
    try {
        const featuredAirshows = await Airshow.find({ featured: true });
        const featuredAircrafts = await Aircraft.find({ featured: true });

        // Fetch types and their counts
        const types = ['Fighter', 'Bomber', 'Passenger', 'Transport', 'Civil'];
        const images = [
            "https://cdn.shopify.com/s/files/1/0360/4209/t/49/assets/514th-fts-f-22-at-hill-afb-utah_march-22-2021_u.s.-air-force-photo-by-alex-r.-lloyd2.pc-adaptive.full.medium-1687335048847_1200x.jpg?v=1687335049",
            "https://i.guim.co.uk/img/media/b0e05688ed5f912c843300200be7ecedc0c80166/40_0_1643_986/master/1643.jpg?width=1200&quality=85&auto=format&fit=max&s=f28d70113861210ba85300efd07fee2d",
            "https://www.usatoday.com/gcdn/-mm-/aaa492124255419162203cbefcb7d9c5c48aa618/c=229-0-4546-3246/local/-/media/2015/04/16/USATODAY/USATODAY/635647920926118639-AP-Emirates-A380-DFW-Airport.jpg",
            "https://static1.simpleflyingimages.com/wordpress/wp-content/uploads/2022/07/FLE_CGO_C031Y18_E0.jpg",
            "https://astonfly.com/wp-content/uploads/2024/06/heading-img-18-6671890e7aaba.webp",
        ];

        const countList = await Promise.all(
            types.map(async (type) => {
                const count = await Aircraft.countDocuments({ type });
                return { type, count };
            })
        );

        // Pass countList and images to the template
        res.render('index', { featuredAirshows, featuredAircrafts, countList, images, msg: req.flash('msg'), loggedIn});
    } catch (error) {
        next(error);
    }
});

app.use('/airshow', airshowRouter)
app.use('/aircraft', aircraftRouter)
app.use('/ticket', ticketRouter)
app.use('/auth', authRouter)
app.use('/user', userRouter)

app.listen(port, () => {
    connect()
    console.log(`Listening on port:${port}`)
})