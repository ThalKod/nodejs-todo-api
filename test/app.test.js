const expect  = require("expect");
const request = require("supertest");

const {app}   = require("../app");
const Todo    = require("../models/todo");

var dbcount;
beforeEach((finish) =>{
    Todo.find({}).then((todo) => {
        dbcount = todo.length 
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