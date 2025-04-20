const express = require('express')
const cros = require('cors')
const mongoose =require('mongoose')
const bodyParser = require('body-parser');
const dotenv=require('dotenv')

const app =express();
app.use(cros())
app.use(express.json())
app.use(bodyParser.json())
dotenv.config()

// DB operations


async function connectDB(){
 await mongoose.connect(process.env.db_link).then(()=>console.log("DB connect succesfully")).catch((err)=>console.log(err.message))
}
connectDB()

const Schema = new mongoose.Schema({
    name:{
      type:String,
      required:true
    },
    age:{
      type:String,
      required:true
    },
    city:{
      type:String,
      required:true
    }
})

const model = mongoose.model('todo',Schema)

app.get("/",async(req,res)=>{
    try {
        const getFile= await model.find()
        res.json(getFile)
    } catch (error) {
        console.log(error)
    }
})

app.post("/", async (req,res)=>{
    console.log("work")
    let {name,age,city}=req.body
    try {
        let newModel=new model({name,age,city})
        await newModel.save()
        res.end()
    } catch (error) {
     console.log(error)   
    }
    
})


// update item

app.put('/:id', async (req, res) => {
    const userId = req.params.id; // Retrieve the user ID from the URL
    const { name, age, city } = req.body; // Retrieve the updated fields from the body
  
    try {
      // Find and update the user document by ID
      const updatedUser = await model.findByIdAndUpdate(
        userId, // Find the user by this ID
        { name, age, city }, // Update these fields
        { new: true, runValidators: true } // Ensure updated document is returned and validations are run
      );
  
      if (!updatedUser) {
        return res.status(404).send('User not found');
      }
  
      // Respond with the updated user data
      res.json(updatedUser);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error updating user');
    }
  });
  

app.delete("/:id",async(req,res)=>{
    let id=req.params.id
    await model.findByIdAndDelete(id)
    res.end()
})

app.listen(3000,()=>{
    console.log("server start")
})