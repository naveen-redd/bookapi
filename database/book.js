const mongoose=require("mongoose");

//Creating schema
const BookSchema=mongoose.Schema({
    ISBN:String,
    title:String,
    authors:[Number],
    language:String,
    pubDate:String,
    numOfPage:Number,
    category:[String],
    publication:Number
});

//Create a model
const Bookmodel=mongoose.model("books",BookSchema);

module.exports=Bookmodel;