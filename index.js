const express = require('express');

const bodyParser = require('body-parser');
const {Server } = require('./api/api');

let dev_on = true;
const app = express();
app.use(bodyParser.json());
if (!dev_on) {
    app.use(express.static('./main/build/'));
}

//d2f29b secret key
//1234 api key

let config ={
    jwt_secret: 'b4dc921000db5683adb397dbed10db0e3bdf4e3e5d6216d947e8478d67a3d5d234dabba0852120d1e81d0786b88814cab95a258830316660e7fe4396df332a49',
    hash: '$2b$10$BcCI/KAnNRXw6oVxhyMOmeZzG5Yxoz9rk0ydpLrWCvyTYs5ZUn6cq',
    user_name: 'tovernaar123'
};
let server = new Server(config);
app.use('/api', server.router);
/*
app.get('/user/login', async (req, res) => {
    if (!req.headers.authorization) return res.status(401).json({ login: false });

    let auth = req.headers.authorization;
    if (auth.length > 150) return res.status(401).json({ login: false });
    try {
        auth = JSON.parse(req.headers.authorization);
    } catch (_) {
        return res.status(401).json({ login: false });
    }
    if (auth.username !== username) return res.status(401).json({ login: false });

    let correct = await bcrypt.compare(auth.password, hash);

    if (!correct) return res.status(401).json({ login: false });

    const token = jwt.sign({ username: auth.username }, jwt_secret);
    res.json({ token, login: true });
});

app.use('/api', async (req, res, next) => {
    let token = req.query.token;
    if (login_cache.has(token)) {
        let user = login_cache.get(token);
        req.user = user;
        return next();
    } else {
        try {
            var decoded = jwt.verify(token, jwt_secret);
            req.user = decoded.username;
            login_cache.set(token, decoded.username)
            return next()
        } catch (error) {
            return res.status(401).send();
        }
    }

});

app.get('/api/printers', (_, res, __) => {
    res.json(printers);
});

app.post('/api/printers', async (req, res, _) => {
    let printer = new PrinterApi(req.body.Ip, req.body.ApiKey, req.body.Name);
    const { logged_in, error } = await printer.login();

    let id = printers.length;
    let data = {
        id,
        logged_in,
    }

    if (logged_in) {
        printers[id] = printer;
        res.json({ data, error });
    }
    data = {
        logged_in,
    }
    res.json({ data, error });
});

app.get('/api/:id/basic', async (req, res, _) => {
    let id = Number(req.params.id)
    let printer = printers[id];
    let reuslt = await (await printer.basic()).data
    res.json(reuslt)
});

app.get('/api/printer/:id/camera', async (req, res, _) => {
    let id = Number(req.params.id)
    let printer = printers[id];
    let stream = await printer.get_camera()
    res.set('Content-Type', 'multipart/x-mixed-replace;boundary=raise3dcameraboundary');
    stream.data.pipe(res);
});

*/
app.listen(5000, '0.0.0.0', () => { console.log('listing'); });