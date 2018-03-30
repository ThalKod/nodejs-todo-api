const express = require("express");
const _       = require("lodash");
const bodyParser = require("body-parser");

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
        completed: req.body.completed,
        text: req.body.text
    });

    Todo.create(todo).then((rTodo) =>{
        res.send({rTodo});
    })
    .catch((err) =>{
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

app.delete("/todos/:id", (req, res) =>{
    
    if(!ObjectID.isValid(req.params.id)){
        return res.status(404).send();
    }
    
    Todo.findByIdAndRemove(req.params.id).then((rTodo) =>{
        if(!rTodo){
            return res.status(404).send();
        }
        res.status(200).send({rTodo});
    }).catch((err) =>{
        res.status(404).send();
    });
});


app.patch("/todos/:id", (req, res) =>{

    var id = req.params.id;
    var body = _.pick(req.body, ["text", "completed"]);

    if(!ObjectID.isValid(req.params.id)){
        return res.status(404).send();
    }

    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    }else{
        body.completed = false;
        body.completedAt  = null;
    }

    Todo.findByIdAndUpdate(req.params.id, body, {new: true}).then((rTodo) =>{
        if(!rTodo){
            return res.status(404).send();
        }

        res.send({rTodo});

    }).catch((err) =>{
        res.status(404).send();
    })

});

app.post("/users", (req, res) =>{

    var body = _.pick(req.body, ["email", "password"]);

    User.create(body).then((rUser) =>{
        res.status(200).send({rUser});
    })
    .catch((err) =>{
        res.status(400).send(err);
    });
});

app.listen("3000", () =>{
    console.log("Server Started");
});

module.exports = {app};
