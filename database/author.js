const mongoose =require("mongoose");

//Author schema
const Authorschema=mongoose.Schema({
    id:Number,
    name:String,
    books:[String]
});

//Author model
const Authormodel=mongoose.model("authors",Authorschema);

module.exports=Authormodel;