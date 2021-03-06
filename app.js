const express = require("express");
const _       = require("lodash");
const bodyParser = require("body-parser");

const {ObjectID} = require("mongodb");
const {mongoose} = require("./db/db");
const {User} = require("./models/user");
const Todo   = require("./models/todo");
const bcrypt    = require("bcryptjs");

var {authenticate}  = require("./middleware/authenticate");

var app = express();

app.use(bodyParser.json());


app.get("/", (req, res) =>{
    res.redirect("/todos");
});

app.post("/todos", authenticate,(req, res) =>{
    var todo = new Todo({
        completed: req.body.completed,
        text: req.body.text,
        _creator: req.user.id
    });

    Todo.create(todo).then((rTodo) =>{
        res.send({rTodo});
    })
    .catch((err) =>{
        res.status(400).send(err);
    });
});

app.get("/todos", authenticate, (req, res) =>{
    Todo.find({_creator: req.user._id}).then((rTodos) =>{
        res.send({todos: rTodos});
    }, (err) =>{
        res.status(400).send(err);
    });
});

app.get("/todos/:id", authenticate, (req, res) =>{
    if(!ObjectID.isValid(req.params.id)){
        console.log("Not a valid ID");
        return res.status(404).send();
        
    }

    Todo.findOne({_id: req.params.id, _creator: req.user._id}).then((rTodo) =>{
        if(!rTodo){
            return res.status(404).send();
        }
        res.send({rTodo});
    }).catch((err) =>{
        res.status(404).send();
    });

});

app.delete("/todos/:id", authenticate, (req, res) =>{
    
    if(!ObjectID.isValid(req.params.id)){
        return res.status(404).send();
    }
    
    Todo.findOneAndRemove({_id: req.params.id, _creator: req.user._id}).then((rTodo) =>{
        if(!rTodo){
            return res.status(404).send();
        }
        res.status(200).send({rTodo});
    }).catch((err) =>{
        res.status(404).send();
    });
});


app.patch("/todos/:id", authenticate, (req, res) =>{

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

    Todo.findOnedAndUpdate({_id: req.params.id, _creator: req.user._id}, body, {new: true}).then((rTodo) =>{
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
    var user = new User(body);

    user.save().then(() =>{
        return user.generateAuthToken();
    }).then((token) =>{
        res.header('x-auth', token).send(user);
    })
    .catch((e) =>{
        res.status(400).send(e);
    });

    // User.create(body).then((rUser) =>{
    //    return User.generateAuthToken();
    //     //res.status(200).send({rUser});
    // })
    // .then((token) =>{
    //     res.header("x-auth",token).send({rUser});
    // })
    // .catch((err) =>{
    //     res.status(400).send(err);
    // });
});



app.get("/users/me", authenticate ,(req, res) =>{
    res.send(req.user);
});


app.post("/users/login", (req, res) =>{

    User.findByCredentials(req.body.email, req.body.password).then((rUser) =>{
        return rUser.generateAuthToken().then((token) =>{
            res.header('x-auth', token).send(rUser);
        });
    }).catch((e) =>{
        res.status(400).send();
    });

    // User.findOne({email: req.body.email}).then((rUser) =>{
    //     bcrypt.compare(req.body.password, rUser.password, (err, result) =>{
    //         if(result){
    //             res.send(rUser);
    //         }else{
    //             res.send("Wrong password");
    //         }
    //     });
    // })
    // .catch((e)=>{
    //     res.send("No User");
    // })

});

app.delete("/users/me/token", authenticate, (req, res) =>{
    req.user.removeToken(req.token).then(() =>{
        res.status(200).send();
    },()=>{
        res.status(400).send();
    });
});

app.listen("3000", () =>{
    console.log("Server Started");
});

module.exports = {app};
