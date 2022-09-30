const express = require('express');
const { restart } = require('nodemon');
const app = express();
const port = 5000;
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

const users = { 
    users_list :
    [
       { 
          id : 'xyz789',
          name : 'Charlie',
          job: 'Janitor',
       },
       {
          id : 'abc123', 
          name: 'Mac',
          job: 'Bouncer',
       },
       {
          id : 'ppp222', 
          name: 'Mac',
          job: 'Professor',
       }, 
       {
          id: 'yat999', 
          name: 'Dee',
          job: 'Aspring actress',
       },
       {
          id: 'zap555', 
          name: 'Dennis',
          job: 'Bartender',
       }
    ]
 }

app.get('/users', (req, res) => {
    const name = req.query.name;
    const job = req.query.job;
    if (name != undefined && job == undefined){
        let result = findUserByName(name);
        result = {users_list: result};
        res.send(result);
    }
    else if (name == undefined && job != undefined){
        let result = findUserByJob(job);
        result = {users_list: result};
        res.send(result);
    }
    else if (name != undefined && job != undefined){
        let nameFilter = findUserByName(name);
        result = {users_list: nameFilter};
        let jobFilter = findUserByJob(job);
        result = {users_list: jobFilter};
        res.send(result);
    }
    else{
        res.send(users);
    }
});

const findUserByJob = (job) => { 
    return users['users_list'].filter( (user) => user['job'] === job); 
}

const findUserByName = (name) => { 
    return users['users_list'].filter( (user) => user['name'] === name); 
}

app.get('/users/:id', (req, res) => {
    const id = req.params['id']; //or req.params.id
    let result = findUserById(id);
    if (result === undefined || result.length == 0)
        res.status(404).send('Resource not found.');
    else {
        result = {users_list: result};
        res.send(result);
    }
});

function findUserById(id) {
    return users['users_list'].find( (user) => user['id'] === id); // or line below
    //return users['users_list'].filter( (user) => user['id'] === id);
}

app.post('/users', (req, res) => {
    req.body["id"] = uuidv4();
    const userToAdd = req.body;
    addUser(userToAdd);
    res.status(201).send(req.body).end();
});

function addUser(user){
    users['users_list'].push(user);
}

app.delete('/users/:id', (req, res) => {
    const userToDel = req.params['id'];
    let result = delUser(userToDel);
    if (result === undefined)
        res.status(404).send('Resource not found.');
    else {
        result = {users_list: result};
        res.status(200).end();
    }
});

function delUser(id){
    let userToDel =  users['users_list'].find( (user) => user['id'] === id);
    let index = users.users_list.indexOf(userToDel);
    return users.users_list.splice(index, 1);
}

