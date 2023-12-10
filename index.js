import mongoose, { Schema } from 'mongoose';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import axios from 'axios';
const app = express();
app.use(express.json());
app.use(cors());
mongoose.connect("mongodb+srv://ysgangwarfbd:2001agra@leetcode.w4hmyea.mongodb.net/?retryWrites=true&w=majority",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
});
const userSchema= new mongoose.Schema({
    username:{type:String,required:true,unique:true},
    password:{type:String,required:true},
});
const Collection=new mongoose.model("users",userSchema);
// app.get("/api",(req,res)=>{
//     res.send({data:"💝💗💗💗💗💕"});
// });
app.post("/authRegister",async(req,res)=>{
    
    const {username,password}=req.body;
    const ifUserPresent= await Collection.findOne({username});
    if(ifUserPresent){
        return res.json({message:"300"});
    }
    const user=new Collection();
    user.username=req.body.username;
    user.password=req.body.password;
    await user.save();
    res.json({message:"User Resgistration Completed"});
});
app.post("/authLogin",async(req,res)=>{
    const {username,password}=req.body;
    
    const UserPresent=await Collection.findOne({username});
    if(!UserPresent){
        return res.json({message:"300"});
    }
    if(UserPresent.password!==password){
        return res.json({message:"300"});
    }
    const token = jwt.sign({id:UserPresent._id},"secret");
    // console.log(UserPresent._id);
    res.json({token,userID:UserPresent._id}); 
});
const questionsSchema= new mongoose.Schema({
    title:String,
    description:String,
    constraints:String,
    sampleTestCases:String,
    answer:String,
    input:String
});
const questionsDetails= new mongoose.model("questionsData",questionsSchema);
// let details= new questionsDetails();
// details.title="Perfect Number";
// details.description="A perfect number is a positive integer that is equal to the sum of its positive divisors, excluding the number itself. A divisor of an integer x is an integer that can divide x evenly";
// details.constraints="1 <= num <= 108";
// details.sampleTestCases="Input: num = 7 Output: false";
// details.answer="true";
// details.input="28";
// await details.save();
app.post("/getQuestions",async(req,res)=>{
    const data =await questionsDetails.find();
    res.json(data);
});
app.get("/getQuestions/:id",async(req,res)=>{
    const { id } = req.params;
    try {
        const document = await questionsDetails.findById(id);
        res.json(document);
      } catch (error) {
        console.error('Error fetching document:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
});
app.listen(3001,()=>{
    console.log("System is On !!");
});