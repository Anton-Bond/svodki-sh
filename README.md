# Svodki

API

=====================================================================================================
++++++++++++++++++++++++++++++++++++++++++++++++ USER ++++++++++++++++++++++++++++++++++++++++++++
=====================================================================================================

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
PUT: /api/user/:userId

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
PUT: /api/user/passw/:userId

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
DELETE: /api/user/:userId

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

=====================================================================================================
++++++++++++++++++++++++++++++++++++++++++++++++ SVTABLE ++++++++++++++++++++++++++++++++++++++++++++
=====================================================================================================

---------------------------------- CREATE
POST: /api/sv-table/new

BODY
{
  "svtableId": "string",
  "svtableDate": "string",
  "header": Array,
  "data": "Array"
}

RESPONSE
{
  "_id": "string",
  "svtableId": "string",
  "svtableDate": "string",
  "header": "[...]",
  "data": "[...]"
  "__v": 0
}

--------------------------------- GET BY DATE
GET: /api/sv-table/:svtableDate

BODY
{}

RESPONSE
{
  "_id": "string",
  "svtableId": "string",
  "svtableDate": "string",
  "header": "[...]",
  "data": "[...]"
  "__v": 0
}

-----------------------------------  SET TABLES ON CURRENT DATE
POST: /api/sv-table/on-current-date/:currentDate

BODY
{
    "tableList": ["_id", ...]
}

RESPONSE   (old data)
{
    "tableList": ["_id", ...],
    "_id": "string",
    "date": "string",
    "__v": 0
}
-------------------------------------  GET TABLES ON CURRENT DATE
GET: /api/sv-table/on-current-date/:currentDate

BODY
{}

RESPONSE   (old data)
[
    {
        "svtableId": "string",
        "svtableDate": "string",
        "name": "string",
        "header": [],
        "data": []
    },
    ...
]


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
