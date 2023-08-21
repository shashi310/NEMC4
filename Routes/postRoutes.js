const express= require('express');
const {Auth}= require('../middlewares/Auth.middleware');
const {PostModel}= require("../models/postModel")
const {BlacklistAuth}=require("../middlewares/BlacklistAuth.middleware")

const postRouter=express.Router()

postRouter.use(Auth)
postRouter.use(BlacklistAuth)

postRouter.get("/",async(req,res)=>{
const {userID}= req.body;
const {no_of_comments,page}= req.query;
try {
    const findPosts = await PostModel.find({userID});
    if(findPosts){
        res.json({posts:findPosts})
    }else{
        res.json({msg:"something is wrong please try again"})
    }
} catch (error) {
    res.status(400).send({error:error.message})
}
})


postRouter.post("/top",async(req, res)=>{
    const {userID}= req.body;
    const {no_of_comments,page}= req.query;

    try {
        const findPosts = await PostModel.find({userID});
        let filter
        if(no_of_comments && findPosts){
            filter=await PostModel.find({userID,no_of_comments:$gte(4)}).fix(3)
            res.json({posts:filter})
            return
        }
        
        else{
            res.json({msg:"something is wrong please try again"})
        }
    } catch (error) {
        res.status(400).send({error:error.message})
    }
    })




postRouter.post("/add",async(req, res)=>{
try {
    const post= new PostModel(req.body);
    await post.save();
    res.json({msg:`${post.title} post created`,post});
} catch (error) {
    res.status(400).send({error:error.message})
}
})



    
    // postRouter.post("/add",async(req, res)=>{
    // try {
    //     const post= new PostModel(req.body);
    //     await post.save();
    //     res.json({msg:`${post.title} post created`,post});
    // } catch (error) {
    //     res.status(400).send({error:error.message})
    // }
    // })




postRouter.patch("/update/:id",async(req, res)=>{
    const {id} = req.params;
    const {title,body,device,no_of_comments,userID}=req.body;

    const updateQuery={}
    if(title){
        updateQuery.title=title
    }
    if(body){
    updateQuery.body=body
    }
    if(device){
        updateQuery.device=device
    }
    if(no_of_comments){
        updateQuery.no_of_comments=no_of_comments
    }


    try {
        const updatePost= await PostModel.findOneAndUpdate({_id:id,userID},updateQuery)
        if(updatePost){
            res.json({msg:`${updatePost.title} post updated`,updatePost})
        }else{
            res.json({msg:"something went wrong"})
        }
    } catch (error) {
        res.status(400).send({error:error.message})
    }
})
postRouter.delete("/delete/:id",async(req, res)=>{
    const {userID}= req.body
    const {id}= req.params

    try {
        const deletedPost= await PostModel.findOneAndDelete({_id:id,userID})

        if(deletedPost){
            res.json({msg:`${deletedPost.title} post deleted`})

        }else{
            res.json({msg:"Something went wrong, please try again"})
        }
    } catch (error) {
        res.status(400).send({error:error.message})
    }
})

module.exports ={
    postRouter
}