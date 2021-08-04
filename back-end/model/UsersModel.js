require('mysql2/promise');

const { v4: uuidv4 } = require('uuid');
const db = require('../db').db;
const c = require('../constants');

const multer = require('multer');
const profilePicsPath = './assets/profilePics/';
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, profilePicsPath);
	},
	filename: function (req, file, cb) {
		cb(null, uuidv4().concat(file.originalname.slice(-4)));
	},
});

const fileFilter = (req, file, cb) => {
	if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
		cb(null, true);
	} else {
		cb(new Error('Non accepted image type'));
	}
};

const upload = multer({
	storage: storage,
	fileFilter: fileFilter,
});


async function getUser(params) {
    /*  error 1 -> internal server error (500)
        error 2 -> not found (404)
        error 0 -> ALL GOOD 
    */
    try{
        let myRequest = 'SELECT * FROM user WHERE ';
        let fields = [];
        for (let key in params) {
            myRequest += key+' = ?' + ' AND ';
            fields.push(params[key]);
        }
        myRequest = myRequest.slice(0,myRequest.length - 4);
        const [result] = await db.pool.query(
            myRequest, fields
        );
        result = result[0];
        if(result.length < 1) result.error = 2;
        else result.error = 0;
        return result;
    }catch(err){
        return {error:1};
    }
}

async function createUser(params) {
    /*  error 1 -> internal server error (500)
        error 0 -> ALL GOOD
    */
    // username, email, password, name, surname, verified, plan , picture
    try{
        let myRequest = 'INSERT INTO user (username,email, password, name, surname, verified, plan , picture) VALUES (?,?,?,?,?,?,?,?)';
        let fields = [];
        for (let key in params) {
            fields.push(params[key]);
        }
        const [result] = await db.pool.query(
            myRequest, fields
        );

        return {error:0};
    }catch(err){
        return {error:1};
    }
}

async function updateUser(params) {
    /*  error 1 -> internal server error (500)
        error 0 -> ALL GOOD
    */
    try{
        let myRequest = 'UPDATE user SET username = ? ,email = ? , name = ? , surname = ? , plan = ? WHERE idUser = ?';
        let fields = [];
        for (let key in params) {
            fields.push(params[key]);
        }
        const [result] = await db.pool.query(
            myRequest, fields
        );
        
        return {error:0};
    }catch(err){
        return {error:1};
    }
}

async function deleteUser(params) {
    /*  error 1 -> internal server error (500)
        error 0 -> ALL GOOD
     */
    try{
        let myRequest = 'DELETE FROM user WHERE ';
        let fields = [];
        for (let key in params) {
            myRequest += key+' = ?' + ' AND ';
            fields.push(params[key]);
        }
        myRequest = myRequest.slice(0,myRequest.length - 4);
        const [result] = await db.pool.query(
            myRequest, fields
        );
        return {error:0};
    }catch(err){
        return {error:1};
    }
}

module.exports = {
    getUser,
    createUser,
    updateUser,
    deleteUser,
}