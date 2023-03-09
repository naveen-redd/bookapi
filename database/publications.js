const mongoose=require("mongoose");

//Publication schema
const Publicationschema=mongoose.Schema({
    id:Number,
    name:String,
    books:[String]
});

//Publication model
const Publicationmodel=mongoose.model("publications",Publicationschema);

module.exports=Publicationmodel;