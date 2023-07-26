var express =require('express')
const mongoose = require("mongoose");
var ejs= require('ejs')
const app=express();
var bodyParser=require('body-parser');

const bcrypt = require('bcrypt');


//......................................................................................................................//
// PAYMENT IMPLEMENTAION//
const Razorpay = require('razorpay'); 
var instance = new Razorpay({
    key_id: 'SBSnHZRLNuBoqQp1L4ubD95d ',
    key_secret: 'SBSnHZRLNuBoqQp1L4ubD95d ',
  });


  app.post('/create/orederId',(req,res)=>{
    console.log("create orderId request",req.body);
    var options = {
        amount: 199900,  // amount in the smallest currency unit
        currency: "INR",
        receipt: "recp1"
      };
      instance.orders.create(options, function(err, order) {
        console.log(order);
        res.send({orderId : order.id});
      });


  })

  app.post("/api/payment/verify",(req,res)=>{

    let body=req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id;
   
     var crypto = require("crypto");
     var expectedSignature = crypto.createHmac('sha256', 'SBSnHZRLNuBoqQp1L4ubD95d')
                                     .update(body.toString())
                                     .digest('hex');
                                     console.log("sig received " ,req.body.response.razorpay_signature);
                                     console.log("sig generated " ,expectedSignature);
     var response = {"signatureIsValid":"false"}
     if(expectedSignature === req.body.response.razorpay_signature)
      response={"signatureIsValid":"true"}
         res.send(response);
     });
   
  

//..........................................................................................................................//




app.use(express.urlencoded({extended:false}))
app.use(
    express.urlencoded({ extended: true })
);
app.use(express.json());
mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1:27017/latestdb", {
useNewUrlParser:true, useUnifiedTopology:true
}, (err) =>{
if(err)
{
console.log(err)
}else{
console.log("successfully connected")
}
})


//login adnd registration inforamtion

const LogInSchema=new mongoose.Schema ({
    email: {
      type: String,
        required: true
    },

    name: {
    type: String,
    required: true
},
number: {
    type: Number,
    required: true
 },
     password: {
    type: String,
    required: true
    }
})

const collection=new mongoose.model("collection1",LogInSchema);


//............................................................................................................





const crypto = require('crypto');









//Logout Information...............................................................

app.post('/logout',  function (req, res, next)  {
    // If the user is loggedin
    if (req.session.LogInSchema) {
          req.session.LogInSchema = false;
          res.redirect('/');
    }else{
        // Not logged in
        res.redirect('/');
    }
});




//BOOKIGN SCEHEMA
//..........................................................................................................
const bookingSchema=new mongoose.Schema({
    Name:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true
    },
    people:{
        type:Number,
        required:true
    },
    time:{
        type: String,
           required:true
    },
    date:{
type:Date,
required:true
    },
    Fnumber:{
        type:Number,
        required:true

    }
   
    
})

const booking =new mongoose.model("booking1",bookingSchema);
app.post("/book",async(req,res)=>{
  const data={
        Name:req.body.Name,
        Email:req.body.Email,
        people:req.body.people,
        time:req.body.time,
        date:req.body.date,
        Fnumber:req.body.Fnumber,
       
    }
     await booking.insertMany([data])
     res.render("pages/index");
});



///..................................................................................................................

//CONTACT SCHEMMA................................................................

const ContactSchema=new mongoose.Schema ({
    name: {
      type: String,
        required: true
    },

    lname: {
    type: String,
    required: true
},
email: {
    type: String,
    required: true
 },
     subject: {
    type: String,
    required: true
    },

    message: {
        type: String,
        required: true
        }
})

const contact=new mongoose.model("contact1",ContactSchema);



app.post("/contact",async(req,res)=>{
    const data={
        name:req.body.name,
        lname:req.body.lname,
        email:req.body.email,
        subject:req.body.subject,
        message:req.body.message,
    }
     await contact.insertMany([data])
    res.write(
        '<script>window.alert("Thnak You For Connecting Us!");window.location="index.ejs" ;</script>'
    );
});
// .........................................................................................................


app.use(express.static('public'));
app.use(bodyParser.json());

app.set('view engine','ejs');
app.listen(8080,()=>{
console.log("on port 8080 ")
})
app.use(bodyParser.urlencoded({extended:true}));
app.get('/',(req,res)=>{
    res.render('pages/Home');
    
});
app.get('/Home.ejs',(req,res)=>{
    res.render('pages/Home');
});
app.get('/Kashmir.ejs',(req,res)=>
{
    res.render('pages/Kashmir');
});

app.get('/login.ejs',(req,res)=>{
    res.render('pages/login');
});
app.get('/book.ejs' ,(req,res)=>{
    res.render('pages/book');
});

app.get('/login.ejs',(req,res)=>{
    res.render('pages/login');
});


app.get('/signup.ejs',(req,res)=>{
    res.render('pages/signup');
});
// hashingjj
// const saltRound=10;
// LogInSchema.pre('insertMany',async(next)=>{
//     try{
// const salt= await bcrypt.genSalt(10)
// const hashPassword=await bcrypt.hash(this.password,salt)
// this.password=hashPassword
// next()
//     } catch(error){
//         next(error)
//     }
// })


app.post("/signup", async (req, res) => {
    const data = {
      email: req.body.email,
      name: req.body.name,
      number: req.body.number,
      password: req.body.password,
    };
  
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);
    data.password = hashedPassword;
  
    await collection.insertMany([data]);
    res.render("pages/login");
  });
  


// LogInSchema.pre('insertMany',async(next)=>{
//     try{
// const salt= await bcrypt.genSalt(10)
// const hashPassword=await bcrypt.hash(this.password,salt)
// this.password=hashPassword
// next()
//     } catch(error){
//         next(error)
//     }
// })


app.post("/login",async(req,res)=>{
 
    try{
  const check=await collection.findOne({name:req.body.name})
  if(check.hashedPassword===req.body.hashedPassword){
    res.render("pages/index");
  }
    else{
        res.write(
            '<script>window.alert("Sorry You have Entered Incorrect Password!");window.location="login.ejs" ;</script>'
        );
            
    }   
    }
    catch{
        res.write(
            '<script>window.alert("Sorry You have Entered Incorrect Password!");window.location="login.ejs" ;</script>'
        );
    }
})

app.get('/blog.ejs',function(req,res){
    res.render('pages/blog');

    
});

app.get('/services.ejs',function(req,res){
    res.render('pages/services');

    
});

app.get('/index.ejs',(req,res)=>{
res.render('pages/index');
});
app.get('/contact.ejs',function(req,res){
    res.render('pages/contact');

    
});
app.get('/about.ejs',function(req,res){
    res.render('pages/about');

    
});
app.get('/hotel-room.ejs',function(req,res){
    res.render('pages/hotel-room');

    
});
app.get('/hotels.ejs',function(req,res){
    res.render('pages/hotels');

    
});
app.get('/tours.ejs',function(req,res){
    res.render('pages/tours');

    
});

app.get('/tour-place.ejs',function(req,res){
    res.render('pages/tour-place');

    
});
app.get('/index.ejs',(req,res)=>{
    res.render('pages/index');

    
});
app.get('/Contact1.ejs',(req,res)=>{
    res.render('pages/Contact1.ejs');
})

app.get('/blog1.ejs',(req,res)=>{
    res.render('pages/blog1.ejs');
})
//app.post('/login.ejs',function(req,res){
  //  res.render('pages/login');

    
//});
app.get('/news.ejs',function(req,res){
    res.render('pages/news');

    
});
app.get('/edit', function(req, res) {
    res.render('pages/edit');
});



