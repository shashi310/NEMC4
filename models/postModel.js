const mongoose= require('mongoose');

const postSchema = mongoose.Schema({
title:{type:String,required:true},
body:{type:String,required:true},
device:{type:String,enum:["Laptop", "Tablet", "Mobile"],required:true},
no_of_comments:{type:Number,required:true},
userID:{type:String,required:true},
userName:{type:String,required:true},
},{
versionKey:false
})
// ,enum:["Laptop", "Tablet", "Mobile"]
const PostModel= mongoose.model("post",postSchema);
module.exports = {
    PostModel
}
