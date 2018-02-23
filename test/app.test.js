const expect  = require("expect");
const request = require("supertest");

const {app}   = require("../app");
const Todo    = require("../models/todo");

var dbcount;
var testTodo;
beforeEach((finish) =>{
    Todo.find({}).then((todo) => {
        dbcount = todo.length; 
        testTodo = todo[0];
        finish();
    });
});


describe("POST /todos", () =>{
    it("Should create a new Todo", (finish) =>{
        var text = "Testing the text field";
        
        request(app)
            .post("/todos")
            .send({text})   
            .expect(200)
            .expect((res) =>{
                expect(res.body.text).toBe(text);
            })
            .end((err, res) =>{
                if(err){
                   return finish(err);
                }

                Todo.findById(res.body._id).then((todo) =>{
                    expect(res.body._id).toEqual(todo._id);
                    finish();
                }).catch((err) => finish(err));
            });
    });

    it("Should not create a new Todo Documents", (finish) =>{
         var text = "";

         request(app)
            .post("/todos")
            .send({text})
            .expect(400)
            .end((err, res) =>{
                if(err){
                    return finish(err);
                }

                Todo.find().then((todo) =>{
                    expect(todo.length).toBe(dbcount);
                    finish();
                }).catch((err) =>{
                    finish(err);
                });
            });
    });
});

describe("GET /todos", () =>{
    it("Should return all todos", (finish) =>{
        request(app)
            .get("/todos")
            .expect(200)
            .expect((res) =>{
                expect(res.body.todos).toExist();
            })
            .end(finish);
    });
});


describe("GET /todos/:id", () =>{
    it("Should return todo", (finish) =>{
        request(app)
            .get("/todos/"+testTodo._id.toHexString())
            .expect(200)
            .expect((res) =>{
                //console.log(testTodo._id.toHexString())
                expect(res.body.rTodo.text).toBe(testTodo.text);
            })
            .end(finish);
    });

    it("Should return 404 if not found todo", (finish) =>{
        request(app)
            .get("/todos/5a8dea2a7ec80208f48e09b7")
            .expect(404)
            .end(finish)
    });

    it("Should return 404 if not a Object ID", (finish) =>{
        request(app)
            .get("/todos/23242")
            .expect(404)
            .end(finish)
    });
});