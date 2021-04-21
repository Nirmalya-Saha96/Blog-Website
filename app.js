//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const request = require("request");
const https = require("https");

const homeStartingContent = "Hello guys I am Nirmalya Saha Btech Student of Haldia Institute of Technology an ISP of Internshala, a tech enthusiast, a Web Developer and an Android Developer. Welcome to my Blog tour hope you will enjoy and keep subscribed. Enjoy the tour.";
const contactContent = "hii";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-Nirmalya:<password>@blogdb.vbpur.mongodb.net/blogDB", {useNewUrlParser: true});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });


  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});

app.get("/about", function(req, res){
  // res.render("about", {aboutContent: aboutContent});
    res.sendFile(__dirname + "/signup.html");
});

app.post("/about", function(req, res){
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;


  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields:{
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us1.api.nirmalyaEmailApiMailandChimp.com/3.0/lists/eb93c22f25";

  const options = {
    method: "POST",
    auth: "nirmalya1:d2346af8d2f10923ad158feb0098367d-us1<nirmalya-cancel>"
  };

  const request = https.request(url, options, function(response){

    if(response.statusCode === 200){
      res.sendFile(__dirname + "/success.html");
    }else{
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data){
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
  console.log(firstName, lastName, email);
});

app.post("/failure", function(req, res){
  res.redirect("/about");
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});


app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
