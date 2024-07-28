const express = require("express");
const bodyParser = require("body-parser");
const multer = require('multer');
const session=require('express-session');
const path = require('path');
const ejs = require('ejs'); 

const app = express();
app.use(bodyParser.urlencoded({
        extended:true
}));

const db=require('mongoose');
db.set("strictQuery", false);

db.connect("mongodb://127.0.0.1:27017/manoj",(err)=>{
if(err)
        console.log("NOt Connected");
else
{   
        console.log("Db connected :) ");  
}
});

app.use(session({
  secret: '2566',
  resave: false,
  saveUninitialized: true
}));

const ns= new db.Schema({
        n1:Number,
        n2:Number,
        add:Number
});
const newS=new db.Schema({
  party:String,
  count:Number
});

const userSchema = new db.Schema({
    name: {
      type: String,
      required: true,
    },
    dateOfBirth: Date,
    aadhar: String,
    address: String,
    email: {
      type: String,
      unique: true,
      required: true,
    },
    phoneNumber: String,
    district: String,
    constituency: String,
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
    },
    status: {
      type: String,
      enum: ['Yes', 'No'],
    },
    password: String,
    pin: String,
    photo: {
      data: Buffer, 
      contentType: String,
    },
  });
  app.set('view engine', 'ejs');


app.set('views', path.join(__dirname, 'views'));
  
const User = new db.model('Voterss', userSchema);
const votetable = new db.model('Parties',newS);  
console.log("table Voters created ");
console.log("***votetable  Voters created ");

// const voterSchema = new mongoose.Schema( 
//     { name: String, age: Number ,aadhar: Number,filename:String,data:Buffer} 
// )
const table=new db.model("Calci",ns);
console.log("table calci created ");


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });




app.get("/", function(req, res) {
res.sendFile(__dirname + "/index.html");
});

// app.get("/main", function(req, res) {
// res.sendFile(__dirname + "/main.ejs");
// // res.render('main',{req.session.user});
// });

app.get("/login", function(req, res) {
res.sendFile(__dirname + "/login.html");
});

app.get("/elections", function(req, res) {
  res.sendFile(__dirname + "/elections.html");
  });

app.get("/vote", function(req, res) {
  res.sendFile(__dirname + "/vote.html");
  });

app.get("/register", function(req, res) {    
res.sendFile(__dirname + "/register.html");
});

app.get('/logout', (req, res) => {
  req.session.destroy(); 
  res.redirect('/'); 
});

app.post('/register', upload.single('photo'), (req, res) => {
    const {
      name,
      dateOfBirth,
      aadhar,
      address,
      email,
      phoneNumber,
      district,
      constituency,
      gender,
      status,
      password,
      pin,
    } = req.body;
  
    const newUser = new User({
      name,
      dateOfBirth,
      aadhar,
      address,
      email,
      phoneNumber,
      district,
      constituency,
      gender,
      status,
      password,
      pin,
      photo: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      },
    });
    
    newUser.save((err) => {
      if (err) {
        console.error('Error saving user:', err);
        res.status(500).send('Error saving user.');
      } else {
        console.log('User saved successfully.');
        res.redirect('/login');
      }
    });
  });

  app.get('/userlist', (req, res) => {
    User.find({}, (err, users) => {
      if (err) {
        console.error('Error fetching user list:', err);
        res.status(500).send('Error fetching user list.');
      } else {
        res.render('userlist', { users });
      }
    });
  });
app.post('/login',(req,res)=>
{
  const {
    ano,
    pass
  }=req.body;
  User.findOne({$and:[{"aadhar":ano},{"password": pass}]},(err,data)=>{
    if(err)
    {
      console.error('Error fetching user list:', err);
        res.status(500).send('<h2>Error fetching user list.</h2>');
        res.redirect("/login");
    }
    else{
      // res.render('userlist',{data});
      // console.log
      if(data)
      {
      req.session.user=data;
      console.log(data.name);
      console.log(req.session.user.name);
      const user = data;
      res.render('main',{user});
      }
      else{
        console.error('Error fetching user list:', err);
        // res.status(500).send('Error fetching user list.');
        res.status(500).send('<h2>Invalid Credentials <a href="/login"> Login </a></h2>');

      }
    }
  });

});

app.get('/votesec',(req,res)=>{
res.sendFile(__dirname + "/voteSecurity.html");
});
app.post('/votesec',(req,res)=>{
  console.log(req.body);
  User.findOneAndUpdate({$and:[{"aadhar":req.body.uname},{"password": req.body.pass}]},{pin:req.body.pin},(err, user) => {
    if (err) {
      console.error('Error updating PIN:', err);
    } else {
      if (user) {
        console.log('PIN updated successfully:', user.pin);
        // res.send('Successs');
        res.render('main',{user});
      } else {
        console.log('User not found.');
         res.send('Error !!!');

      }
    }
  });
  // res.send("bye");
// res.sendFile(__dirname + "/voteSecurity.html");
});
app.get('/voteValidate',(req,res)=>{
res.sendFile(__dirname + "/voterValid.html");
});
app.post('/voteValidate',(req,res)=>{
  
  console.log(req.body.uname,req.body.pin);
  User.findOne({$and:[{"aadhar":req.body.uname},{"pin": req.body.pin}]},(err,data)=>{
    if(err)
    {
      console.error('Error fetching user list:', err);
        res.status(500).send('<h2>Error fetching user list.</h2>');
        res.redirect("/login");
    }
    else{
      // res.render('userlist',{data});
      // console.log
      if(data)
      {
      // req.session.user=data;
      console.log(data.name);
      // const user = data;
      res.redirect('/voting');
      // res.render('main',{user});
      }
      else{
        console.error('Error fetching user list:', err);
        // res.status(500).send('Error fetching user list.');
        res.status(500).send('<h2>Invalid Credentials <a href="/login"> Login </a></h2>');

      }
    }
  });
  // res.send("bye");
// res.sendFile(__dirname + "/voteSecurity.html");
});
app.get('/voting',(req,res)=>{
  res.sendFile(__dirname+'/votePooling.html');
});
app.post('/giveVote', (req, res) => {
  votetable.findOne({ party: req.body.party }, (err, data) => {
    if (err) {
      console.error('Error fetching user list:', err);
      res.status(500).send('<h2>Error fetching user list.</h2>');
      return;
    }
    console.log("**** partuuuuty :",data);
    try{
    User.findOne({ "aadhar": req.session.user.aadhar, "pin": req.session.user.pin, "status": "No" }, (err, person) => {
      if (err) {
        res.status(500).send('<h2>Error fetching user list.</h2>');
        return;
      }

      if (person) {
        console.log("**person : ",person.name);
        votetable.findOneAndUpdate({ party: req.body.party }, { count: data.count + 1 }, (err, party) => {
          if (err) {
            res.status(500).send('<h2>Error fetching user list.</h2>');
            return;
          }

          User.findOneAndUpdate({ $and: [{ "aadhar": req.session.user.aadhar }, { "password": req.session.user.password }] }, { status: "Yes" }, (err, user) => {
            if (err) {
              res.status(500).send('error');
              return;
            }

            console.log('updated count');
            res.send('<h2> Voted Successfully <a href="/login"> Login </a> </h2>');
            // res.render('main',{user});
          });
        });
      } else {
        console.error('Invalid Credentials');
        res.status(500).send('<h2>Sorry You already Voted Mawa !.... <a href="/login"> Login </a></h2>');
      }
    });
  }
  catch{
    res.send("error <a href='/login'> Login </a>")
  }
  });
});

// app.post('/giveVote',(req,res)=>{
//   // res.sendFile(__dirname+'/votePooling.html');
//   votetable.findOne({party:req.body.party},(err,data)=>
//   {
//     if(err)
//     {
//       console.error('Error fetching user list:', err);
//         res.status(500).send('<h2>Error fetching user list.</h2>');
//         res.redirect("/login");
//     }
//     else{
//       console.log(req.session.user);
//         User.findOne( {"aadhar":req.session.user.aadhar},{"pin": req.session.user.pin},{status:"No"},(err,person)=>
//       { 
//         if(err)
//         {
//           res.status(500).send('<h2>Error fetching user list.</h2>');
//         } 
//         else
//         {
//           console.log("** Person : ",person);
//           if(data && person)
//           {
//             votetable.findOneAndUpdate({party:req.body.party},{count:data.count+1},(err,pariity)=>{
//               if(err)
//               {
//                 res.status(500).send('<h2>Error fetching user list.</h2>');

//               }
//               else
//               {
//                 console.log("*****Paritiity",pariity);
//                 User.findOneAndUpdate({$and:[{"aadhar":req.session.user.aadhar},{"password": req.session.user.password}]},{status:"Yes"},(err, user)=>{
//                   if(err){
//                     res.send('error');}
//                   else{
//                     console.log("Ok Mawa")
//                     res.send("OK Mawaa...")
//                   }
//                 });
//               console.log('updated count');
//               }
             
//             })
//           console.log(data,req.session.user);
        
//           res.send("Voted Successfully");
          
//           }
//           else{
//             console.error('Error fetching user list:', err);
          
//             res.status(500).send('<h2>Invalid Credentials <a href="/login"> Login </a></h2>');

//           }
//        } 
//       });
//     }
//   });
// });

app.listen(3000, function(){
console.log("server is running on port 3000");
})