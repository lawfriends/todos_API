const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const getTodo = async (req, res, next) => {
  try {
    const data = fs.readFileSync(path.join(__dirname, './todos.json'));
    const todos = JSON.parse(data);
    const todo = todos.find(todo => todo.id === Number(req.params.id));
    if (!todo) {
      const err = new Error('Todo not found');
      err.status = 404;
      throw err;
    }
    res.json(todo);
  } catch (e) {
    next(e);
  }
};

const createTodo = async (req, res, next) => {
    try {
      const data = fs.readFileSync("./todos.json");
      const todos = JSON.parse(data);
      const newTodo = {
        id: req.body.id,
        action: req.body.action,
        done: req.body.done,
      };
      todos.push(newTodo);
      fs.writeFileSync("./todos.json", JSON.stringify(todos));
      res.status(201).json(newTodo);
    } catch (e) {
      next(e);
    }
};

const updateTodo = async (req, res, next) => {
    try {
      const data = fs.readFileSync("./todos.json");
      const todos = JSON.parse(data);
      const todo = todos.find(todo => todo.id === Number(req.params.id));
      if (!todo) {
        const err = new Error('Todo not found');
        err.status = 404;
        throw err;
      }
      const newTodoData = {
        id: req.body.id,
        action: req.body.action,
        done: req.body.done,
      };
      const newTodo = todos.map(todo => {
        if (todo.id === Number(req.params.id)) {
          return newTodoData;
        } else {
          return todo;
        }
      });
      fs.writeFileSync("./todos.json", JSON.stringify(newTodo));
      res.status(200).json(newTodoData);
    } catch (e) {
      next(e);
    }
};

const deleteTodo = async (req, res, next) => {
    try {
      const data = fs.readFileSync("./todos.json");
      const todos = JSON.parse(data);
      const todo = todos.find(todo => todo.id === Number(req.params.id));
      if (!todo) {
        const err = new Error('Todo not found');
        err.status = 404;
        throw err;
      }
      const newTodo = todos.map(todo => {
        if (todo.id === Number(req.params.id)) {
          return null;
        } else {
          return todo;
        }
      })
      .filter(todo => todo !== null);
      fs.writeFileSync("./todos.json", JSON.stringify(newTodo));
      res.status(200).end();
    } catch (e) {
      next(e);
    }
};

router
  .route('/api/v1/todos/:id')
  .get(getTodo)
  .post(createTodo)
  .put(updateTodo)
  .delete(deleteTodo);

module.exports = router;