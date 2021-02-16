# Svodki

API
----------------------------LOGIN
/api/auth/registration

BODY
{
  "email": "string",
  "password": "string",
}

RESPONSE
{
    "token": "Bearer ey..."
}

---------------------------- GET ALL
GET: /api/user


----------------------------CREATE
POST: /api/user/new

BODY
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "string"
}

RESPONSE
{
  "_id": "string",
  "userId": "string",
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "string",
  "__v": 0
}

-----------------------------USER BY ID
GET: /api/user/:userId

/api/user/{userId}

BODY
none

RESPONSE
{
  "_id": "string",
  "userId": "string",
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "string",
  "__v": 0
}

------------------------------- UPDATE BY ID
PUT: /api/user/:id

BODY
{
    "name":  "string",
    "email": "string",
    "role": "string"
}

RESPONSE
            (old data)
}
    "_id": "string",
    "userId": "string",
    "name": "string",
    "email": string,
    "password": "string",
    "role": string,
    "__v": 0
}

-------------------------------- UPDATE USER PASSWORD
PUT: /api/user/passw/:id

BODY
{
    "password": "string"
}

RESPONSE
{
    "_id": "string",
    "userId": "string",
    "name": "string",
    "email": "string",
    "password": "string",   // password is old
    "role": "string",
    "__v": 0
}

----------------------------------- DELETE USER BY ID
DELETE: /api/user/:id

BODY
{}

RESPONSE
{
    "_id": "string",
    "userId": "string",
    "name": "string",
    "email": "string",
    "password": "string",   // password is old
    "role": "string",
    "__v": 0
}



++++++++++++++++++++++++++++++++++++++++++++++++++++++
set up MongoDB:
По умолчанию порт 27017 прослушивает только локальный адрес 127.0.0.1. 

db.createUser({user: "root", pwd: "...", roles: [{role: "userAdminAnyDatabase", db: "admin"}, "readWriteAnyDatabase"]})

$ sudo vim /lib/systemd/system/mongodb.service 
Find the following line:
Environment="OPTIONS=--f /etc/mongod.conf"
Add the --auth option as follows:
Environment="OPTIONS= --auth -f /etc/mongod.conf"

$ systemctl daemon-reload

$ sudo systemctl restart mongodb
$ sudo systemctl status mongodb

start:
$ mongo
> show dbs

$ mongo -u "root" -p --authenticationDatabase "admin"

db.createUser({user: "some_name",pwd: "...",roles: [{role: "readWrite", db: "svodki-sh"}]})

$ mongo -u "some_name" -p --authenticationDatabase "test"
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
