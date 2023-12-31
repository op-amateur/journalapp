const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");


const homeStartingContent = "Here at Daily Journal, we believe in the power of daily reflection and self-discovery. Our mission is to inspire and guide individuals on their personal growth journey through the transformative practice of daily journaling. We understand that life is a continuous journey of learning, and every written word is a step towards understanding oneself better. Whether you're a seasoned journaler or just starting out, there's a place for you here. Let's navigate the ups and downs of life together, one journal entry at a time. Your story matters, and we're here to help you tell it.Thank you for choosing our website as your companion on the path to self-discovery.";
const aboutContent = "Here at Daily Journal, we believe in the power of daily reflection and self-discovery. Our mission is to inspire and guide individuals on their personal growth journey through the transformative practice of daily journaling. We understand that life is a continuous journey of learning, and every written word is a step towards understanding oneself better. Whether you're a seasoned journaler or just starting out, there's a place for you here. Let's navigate the ups and downs of life together, one journal entry at a time. Your story matters, and we're here to help you tell it.Thank you for choosing our website as your companion on the path to self-discovery.";
const contactContent = "Here at Daily Journal, we believe in the power of daily reflection and self-discovery. Our mission is to inspire and guide individuals on their personal growth journey through the transformative practice of daily journaling. We understand that life is a continuous journey of learning, and every written word is a step towards understanding oneself better. Whether you're a seasoned journaler or just starting out, there's a place for you here. Let's navigate the ups and downs of life together, one journal entry at a time. Your story matters, and we're here to help you tell it.Thank you for choosing our website as your companion on the path to self-discovery.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


function connectDB() 
{
    mongoose.connect("mongodb+srv://parwalprashansa:atlasadmin123@cluster0.l2fld4h.mongodb.net/?retryWrites=true&w=majority").then(function() 
    {
        console.log("DB connection successful.");
    }).catch(function(err)
    {
        console.log(`DB connection error:${err}`);
    });
}

connectDB();

const postSchema = new mongoose.Schema(
{
    title: String,
    content: String
});

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res) 
{
    Post.find({}).then(function(posts) 
    {
        res.render("home", 
        {
            startingContent: homeStartingContent,
            posts: posts
        });
    }).catch(function(err) 
    {
        console.error(err);
        res.send("Error retrieving posts");
    });
});

app.post("/", function(req,res)
{
    res.redirect("/compose");
});

app.get("/about",function(req,res)
{
    res.render("about",{aboutContent:aboutContent});
});

app.get("/contact",function(req,res)
{
    res.render("contact",{contactContent:contactContent});
});

app.get("/compose", function(req, res)
{
    res.render("compose");
});

app.post("/compose", function(req, res)
{
    const post = new Post({
        title: req.body.postTitle,
        content: req.body.postContent
    });
    post.save().then(function() 
    {
        res.redirect("/");
    }).catch(function(err) 
    {
        console.log(err);
        res.send("Error creating post");
    });
});

app.get("/posts/:postId", function(req, res) 
{
    const requestedPostId = req.params.postId;
    Post.findOne({_id: requestedPostId}).then(function(post) 
    {
        res.render("post", 
        {
            currId:requestedPostId,
            currpostTitle: post.title,
            currpostContent: post.content
        });
    }).catch(function(err) 
    {
        console.log(err);
        res.send("Post not found");
    });
});

app.post("/posts/:postId", function(req, res) 
{
    res.redirect("/");
});
  
app.post("/delete/:postId", function (req, res) 
{
    const requestedPostId = req.params.postId;
    Post.findByIdAndDelete({_id: requestedPostId}).then(function(post) 
    {
        res.redirect("/");
    }).catch(function(err) 
    {
        console.log(err);
        res.send("Post not found");
    });
});

app.get("/edit/:postId", function(req, res) 
{
    const requestedPostId = req.params.postId;
    Post.findOne({_id: requestedPostId}).then(function(post) 
    {
        res.render("edit",
        {
            editId:requestedPostId,
            editTitle: post.title,
            editContent:post.content
        });
    }).catch(function(err) 
    {
        console.log(err);
        res.send("Post not found");
    });
});

app.post("/edit/:postId", function(req, res) 
{
    const postEditId = req.params.postId;
    Post.findByIdAndUpdate(postEditId, 
    { 
        title: req.body.postEditTitle, 
        content: req.body.postEditContent
    },{new:true}).then(function(post) 
    {
        if (!post) 
        {
            return res.status(404).send("Post not found");
        }
        res.redirect("/");
    }).catch(function(err) 
    {
        console.log(err);
        res.send("Post not found");
    });
});


app.listen(3000, function() 
{
  console.log("Server started on port 3000");
});