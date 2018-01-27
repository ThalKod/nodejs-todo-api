const express = require("express");
var bodyParser = require("body-parser");

const {mongoose} = require("./db/db");
var {User} = require("./models/user");
var Todo   = require("./models/todo");

var app = express();

app.use(bodyParser.json());

app.post("/todos", (req, res) =>{
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((rTodo) =>{
        res.send(rTodo);
    }, (err) =>{
        res.status(400).send(err);
    });
});

app.listen("3000", () =>{
    console.log("Server Started");
});
