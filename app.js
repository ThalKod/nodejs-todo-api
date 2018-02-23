const express = require("express");
var bodyParser = require("body-parser");

const {ObjectID} = require("mongodb");
const {mongoose} = require("./db/db");
const {User} = require("./models/user");
const Todo   = require("./models/todo");

var app = express();

app.use(bodyParser.json());


app.get("/", (req, res) =>{
    res.redirect("/todos");
});

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

app.get("/todos", (req, res) =>{
    Todo.find().then((rTodos) =>{
        res.send({todos: rTodos});
    }, (err) =>{
        res.status(400).send(err);
    });
});

app.get("/todos/:id", (req, res) =>{
    if(!ObjectID.isValid(req.params.id)){
        console.log("Not a valid ID");
        return res.status(404).send();
        
    }

    Todo.findById(req.params.id).then((rTodo) =>{
        if(!rTodo){
            return res.status(404).send();
        }
        res.send({rTodo});
    }).catch((err) =>{
        res.status(404).send();
    });

});

app.listen("3000", () =>{
    console.log("Server Started");
});

module.exports = {app};
