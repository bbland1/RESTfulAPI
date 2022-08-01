const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Middleware
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// MongoDB Set Up
mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = new mongoose.model("Article", articleSchema);

// Requests targeting all articles
app.route("/articles")

  .get((req, res) => {

    Article.find({}, (err, foundArticles) => {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });

  })

  .post((req, res) => {

    Article.create({
      title: req.body.title,
      content: req.body.content
    }, (err) => {
      if (!err) {
        res.send("Successfully added a new article.")
      } else {
        res.send(err);
      }
    });

  })

  .delete((req, res) => {

    Article.deleteMany({}, (err) => {
      if (!err) {
        res.send("Successfully deleted all articles.");
      } else {
        res.send(err);
      }
    });

  });

// request targetins a specific article
app.route("/articles/:articleTitle")

  .get((req, res) => {

    Article.findOne({title: req.params.articleTitle}, (err, foundArticle) => {
      if(foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("No articles found matching that title.");
      }
    })

  })

  .put((req, res) => {

    Article.replaceOne(
      {title: req.params.articleTitle},
      {title: req.body.title, content:req.body.content},
      {overwrite: true}, (err) => {
        if (!err) {
          res.send("Successfully updated article.");
        } else {
          res.send(err);
        }
      }
    );

  })

  .patch((req, res) => {

    Article.updateOne(
      {title: req.params.articleTitle},
      {$set: req.body},
      (err) => {
        if (!err) {
          res.send("Successfully updated article.");
        } else {
          res.send(err);
        }
      }
    );

  })

  .delete((req, res) => {

    Article.deleteOne(
      {title: req.params.articleTitle},
      (err) => {
        if (!err) {
          res.send("Successfully deleted the specifc article.");
        } else {
          res.send(err);
        }
      }
    );

  });
  
// Server Listening
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}.`)
});