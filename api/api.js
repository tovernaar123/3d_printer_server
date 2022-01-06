
let md5 = require('md5');
let crypto = require('crypto');
const messages = require('./messages.js');
var express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');



class Printer {
    constructor(ip, Key, name) {
        this.ip = ip;
        this.Key = Key;
        this.token;
        this.logged_in = false;
        this.name = name;
    }

    async login() {
        const date = +new Date();
        const shasum = crypto.createHash('sha1');
        shasum.update(`password=${this.Key}&timestamp=${date}`);
        let sha1 = shasum.digest('hex');
        let sign = md5(sha1);

        let request = {
            ip: this.ip,
            parms: {
                sign,
                timestamp: date
            }
        };
        let returns = {
            logged_in: false,
        };
        let { result, error } = await messages.printer.login.send(request);
        returns.error = error?.code;

        if (result?.data.status === 1) {
            this.logged_in = true;
            this.token = result.data.data.token;
        }
        return returns;
    }

    async get_camera() {
        //const url = `http://${this.ip}:10800/v1/printer/camera?token=${this.token}`
        let request = {
            ip: this.ip,
            parms: {
                token: this.token
            }

        };
        //camera_login
        let result = (await messages.printer.camera_login.send(request)).result;
        if(result.error) return result.error;

        result = result.data.data;
        let password = result.password;
        let username = result.user_name;

        request = {
            ip: this.ip,
            auth: {
                username,
                password
            }
        };

        let stream = messages.printer.camera_stream.send(request);
        if(stream.error) return stream.error;
        return stream;

    }

    async basic() {
        let request = {
            ip: this.ip,
            parms: {
                token: this.token
            }

        };
        let result = messages.printer.basic_info.send(request);
        return result;
    }
}

let login_cache = new Map();

// eslint-disable-next-line no-unused-vars
let realPass = 'Some secret pass';
/*
let jwt_secret = 'b4dc921000db5683adb397dbed10db0e3bdf4e3e5d6216d947e8478d67a3d5d234dabba0852120d1e81d0786b88814cab95a258830316660e7fe4396df332a49'
let hash = '$2b$10$BcCI/KAnNRXw6oVxhyMOmeZzG5Yxoz9rk0ydpLrWCvyTYs5ZUn6cq'
let username = 'tovernaar123'
*/

class Server {
    constructor(config) {
        this.jwt_secret = config.jwt_secret;
        this.hash = config.hash;
        this.user_name = config.user_name;

        this.router = express.Router();
        this.linkAll_requests();
        this.printers = [new Printer('192.168.1.115', '1234')];
        this.printers[0].login();
    }

    async linkAll_requests() {
        //loop over messages object 
        for (let key in messages.api) {
            let message = messages.api[key];
            message.link(this['on_' + key + '_handler'], this.router, this);
        }
    }

    async auth_handler(req, res, next) {
        let token = req.query.token;
        if (login_cache.has(token)) {
            let user = login_cache.get(token);
            req.user = user;
            return next();
        } else {
            try {
                var decoded = jwt.verify(token, this.jwt_secret);
                req.user = decoded.username;
                login_cache.set(token, decoded.username);
                return next();
            } catch (error) {
                return res.status(401).send();
            }
        }
    }

    async on_login_handler(req, res) { 

        let auth = req.query;
        if (auth.username !== this.user_name) return res.status(401).json({ login: false });
        let correct = await bcrypt.compare(auth.password, this.hash);
        if (!correct) return res.status(401).json({ login: false });
    
        const token = jwt.sign({ username: auth.username }, this.jwt_secret);
        res.json({ token, login: true });
    }

    async on_PrinterCamera_handler(req, res) {
        let id = Number(req.query.id);
        let printer = this.printers[id];
        let stream = (await printer.get_camera()).result;
        if(stream.error) return res.status(500).json({error: stream.error});
        res.set('Content-Type', 'multipart/x-mixed-replace;boundary=raise3dcameraboundary');
        stream.data.pipe(res);
    }


}
let a = {
    Printer,
    Server
};
module.exports = a;
/*
let ip = '192.168.1.115:10800'
let password = "c1b4f8"
*/
