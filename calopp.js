const express = require("express");
const bodyParser = require("body-parser")

// New app using express module
const app = express();
app.use(bodyParser.urlencoded({
        extended:true
}));
const db=require('mongoose');
        db.set("strictQuery", false);
        db.connect("mongodb://127.0.0.1:27017/MST",(err)=>{
        if(err)
                console.log("NOt Connected");
        else
        {   
                console.log("Db connected :) ");  
        }
        });
const ns= new db.Schema({
        ano:String,
        dob:Date,
       
});
const table=new db.model("sru",ns);
console.log("table sru created ");
app.get("/", function(req, res) {
        
res.sendFile(__dirname + "/login1.html");
});

app.post("/register",async function(req, res) {
        try{
          
        console.log(req.body);
        const record_1=new table({
                ano:req.body.aadhar,
                dob:req.body.dob,
        });
        record_1.save();
        console.log("Data Inserted ");
        }catch(error){
                console.log(error);
        }
        
        // res.sen
        res.sendFile(__dirname + "/login1.html");
        // var result = num1 + num2 ;
        // res.send("<h1>Maths Operation "+(num1+num2)+"</h1>");
        // <h1>${num1}+${num2} sum is ${num1+num2}</h1>");
        // res.send("Data saved");
        // table.find({},(err,data)=>{
                // console.log(data);
        // })
});

// app.post('/register', (req, res) => {
    // const { aadhar, Birth } = req.body;
	 // const record_1=new table({
                // ano:aadhar,
				// datwww:Birth
        // });
        // record_1.save();
		
	// console.log(req.body,'ok');
	
	// res.sendFile(__dirname + "/login1.html");
    // // const newUser = new User({
        // // aadharNumber:aadhar,
       // // dateOfBirth:Birth,
    // // });

    // // newUser.save((err) => {
        // // if (err) {
            // // console.error(err);
            // // res.status(500).json({ message: 'Registration failed' });
        // // } else {
            // // res.json({ message: 'Registration successful' });
        // // }
    // // });
// });
// app.get("/values",)
// app.get("/values", async function (req, res) {
        // try {
          // const data = await table.find(); // Fetch data from MongoDB
          // res.json(data);
        // } catch (error) {
          // console.error(error);
          // res.status(500).json({ error: 'Internal Server Error' });
        // }
// });
app.listen(3000, function(){
console.log("server is running on port 3000");
})