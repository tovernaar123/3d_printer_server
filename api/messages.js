const axios = require('axios').default;
const Validator = require('jsonschema').Validator;
class Message {
    constructor(obj) {
        if (!obj.method) throw new Error(`No method on ${JSON.stringify(obj)}.`);
        if (!obj.url) throw new Error(`No url on ${JSON.stringify(obj)}.`);
        if (!obj.responseType) throw new Error(`No responseType on ${JSON.stringify(obj)}.`);
        if (!obj.properties) throw new Error(`No properties on ${JSON.stringify(obj)}.`);

        this.url = obj.url;
        this.method = obj.method;
        this.responseType = obj.responseType;
        this.properties = obj.properties;
        this.port = obj.port;
        this.create_schema();
    }

    create_schema() {
        this.properties.ip = { type: 'string' };
        this.schema = {
            type: 'object',
            properties: this.properties
        };

    }

    async send(request) {
        let v = new Validator();
        let valid_shema = v.validate(request, this.schema).valid;

        if (!valid_shema) throw new Error(`error on request: ${JSON.stringify(request)}, ${JSON.stringify(valid_shema.errors)}`);

        let url = `http://${request.ip}:10800/v1${this.url}`;

        if (this.port) url = `http://${request.ip}:${this.port}/api/v1${this.url}`;

        if (this.properties?.parms?.properties) {
            url += '?';
            for (const [key,] of Object.entries(this.properties.parms.properties)) {
                url += `${key}=${request.parms[key]}&`;
            }
            url = url.slice(0, -1); //remove the last &
        }

        let config = {
            method: this.method,
            url,
            responseType: this.responseType,
            data: request.data,
            auth: request.auth,
            timeout: 2500
        };
        let error;
        let p = axios(config)
            .catch((err) => {
                error = err;
            });

        let result = await p;
        return { 
            result,
            error 
        };
    }
}



const messages = {};
messages.printer = {};
messages.printer.login = new Message({
    method: 'get',
    url: '/login',
    responseType: 'json',
    type: 'object',
    properties: {
        parms: {
            type: 'object',
            properties: {
                sign: { 'type': 'string' },
                timestamp: { 'type': 'number' }
            }
        },
        //data: {} for post only
    }
});

messages.printer.get_info = new Message({
    method: 'get',
    url: '/printer/system',
    responseType: 'json',
    type: 'object',
    properties: {
        parms: {
            type: 'object',
            properties: {
                token: { 'type': 'string' },
            }
        },
        //data: {}
    }
});

messages.printer.camera_login = new Message({
    method: 'get',
    url: '/printer/camera',
    responseType: 'json',
    type: 'object',
    properties: {
        parms: {
            type: 'object',
            properties: {
                token: { 'type': 'string' },
            }
        },
        //data: {} for post only
    }
});

messages.printer.camera_stream = new Message({
    method: 'get',
    url: '/camera/stream',
    responseType: 'stream',
    type: 'object',
    port: '30216',
    properties: {
        //data: {} for post only
        auth: {
            type: 'object',
            properties: {
                username: { 'type': 'string' },
                password: { 'type': 'string' },
            }
        }
    }
});

messages.printer.runningstatus = new Message({
    method: 'get',
    url: '/printer/runningstatus',
    responseType: 'json',
    type: 'object',
    properties: {
        parms: {
            type: 'object',
            properties: {
                token: { 'type': 'string' },
            }
        },
        //data: {} for post only
    }
});

messages.printer.basic_info = new Message({
    method: 'get',
    url: '/printer/basic',
    responseType: 'json',
    type: 'object',
    properties: {
        parms: {
            type: 'object',
            properties: {
                token: { 'type': 'string' },
            }
        },
        //data: {} for post only
    }
});

messages.printer.nozzle_left = new Message({
    method: 'get',
    url: '/printer/nozzle1',
    responseType: 'json',
    type: 'object',
    properties: {
        parms: {
            type: 'object',
            properties: {
                token: { 'type': 'string' },
            }
        },
        //data: {} for post only
    }
});

messages.printer.nozzle_right = new Message({
    method: 'get',
    url: '/printer/nozzle2',
    responseType: 'json',
    type: 'object',
    properties: {
        parms: {
            type: 'object',
            properties: {
                token: { 'type': 'string' },
            }
        },
        //data: {} for post only
    }
});

messages.printer.nozzle_left_temp_set = new Message({
    method: 'post',
    url: '/printer/nozzle1/temp/set',
    responseType: 'json',
    type: 'object',
    properties: {
        parms: {
            type: 'object',
            properties: {
                token: { 'type': 'string' },
            }
        },
        data: {
            type: 'object',
            properties: {
                temperature: {
                    'type': 'integer',
                    'minimum': 0,
                    'maximum': 310,
                },
            }
        }
    }
});

messages.printer.nozzle_right_temp_set = new Message({
    method: 'post',
    url: '/printer/nozzle2/temp/set',
    responseType: 'json',
    type: 'object',
    properties: {
        parms: {
            type: 'object',
            properties: {
                token: { 'type': 'string' },
            }
        },
        data: {
            type: 'object',
            properties: {
                temperature: {
                    'type': 'integer',
                    'minimum': 0,
                    'maximum': 310,
                },
            }
        }
    }
});

messages.printer.nozzle_left_flowrate_set = new Message({
    method: 'post',
    url: '/printer/nozzle1/flowrate/set',
    responseType: 'json',
    type: 'object',
    properties: {
        parms: {
            type: 'object',
            properties: {
                token: { 'type': 'string' },
            }
        },
        data: {
            type: 'object',
            properties: {
                flowrate: {
                    'type': 'integer',
                    'minimum': 0,
                    'maximum': 310,
                },
            }
        }
    }
});

messages.printer.nozzle_right_flowrate_set = new Message({
    method: 'post',
    url: '/printer/nozzle2/flowrate/set',
    responseType: 'json',
    type: 'object',
    properties: {
        parms: {
            type: 'object',
            properties: {
                token: { 'type': 'string' },
            }
        },
        data: {
            type: 'object',
            properties: {
                flowrate: {
                    'type': 'integer',
                    'minimum': 0,
                    'maximum': 310,
                },
            }
        }
    }
});

messages.printer.heatbedtemp_temp_set = new Message({
    method: 'post',
    url: '/printer/heatbedtemp/set',
    responseType: 'json',
    type: 'object',
    properties: {
        parms: {
            type: 'object',
            properties: {
                token: { 'type': 'string' },
            }
        },
        data: {
            type: 'object',
            properties: {
                temperature: {
                    'type': 'integer',
                    'minimum': 0,
                    'maximum': 110,
                },
            }
        }
    }
});

messages.printer.feedrate_set = new Message({
    method: 'post',
    url: '/printer/feedrate/set',
    responseType: 'json',
    type: 'object',
    properties: {
        parms: {
            type: 'object',
            properties: {
                token: { 'type': 'string' },
            }
        },
        data: {
            type: 'object',
            properties: {
                feedrate: {
                    'type': 'integer',
                    'minimum': 0,
                    'maximum': 350,
                },
            }
        }
    }
});

messages.printer.fanspeed_set = new Message({
    method: 'post',
    url: '/printer/fanspeed/set',
    responseType: 'json',
    type: 'object',
    properties: {
        parms: {
            type: 'object',
            properties: {
                token: { 'type': 'string' },
            }
        },
        data: {
            type: 'object',
            properties: {
                fanspeed: {
                    'type': 'integer',
                    'minimum': 0,
                    'maximum': 100,
                },
            }
        }
    }
});

messages.printer.axiscontrol_set = new Message({
    method: 'post',
    url: ' /printer/axiscontrol/set',
    responseType: 'json',
    type: 'object',
    properties: {
        parms: {
            type: 'object',
            properties: {
                token: { 'type': 'string' },
            }
        },
        data: {
            type: 'object',
            properties: {
                is_relative_pos: {
                    'type': 'integer',
                    'minimum': 0,
                    'maximum': 1,
                },

                nozzle: {
                    'type': 'integer',
                    'minimum': 0,
                    'maximum': 1,
                },

                x: { 'type': 'integer' },
                y: { 'type': 'integer' },
                z: { 'type': 'integer' },
                e: { 'type': 'integer' }
            }
        }
    }
});

messages.printer.currentjob = new Message({
    method: 'get',
    url: '/job/currentjob',
    responseType: 'json',
    properties: {
        parms: {
            type: 'object',
            properties: {
                token: { 'type': 'string' },
            }
        },
    }
});

messages.printer.currentjob_set = new Message({
    method: 'post',
    url: '/job/currentjob/set',
    responseType: 'json',
    type: 'object',
    properties: {
        parms: {
            type: 'object',
            properties: {
                token: { 'type': 'string' },
            }
        },
        data: {
            type: 'object',
            properties: {
                operate: {
                    'type': 'string',
                    'enum': ['pause', 'resume', 'stop']
                },
            }
        }
    }
});

messages.printer.newjob_set = new Message({
    method: 'post',
    url: '/job/newjob/set',
    responseType: 'json',
    type: 'object',
    properties: {
        parms: {
            type: 'object',
            properties: {
                token: { 'type': 'string' },
            }
        },
        data: {
            type: 'object',
            properties: {
                file_path: { 'type': 'string' },
            }
        }
    }
});

messages.printer.recover_set = new Message({
    method: 'post',
    url: '/job/recover/set',
    responseType: 'json',
    type: 'object',
    properties: {
        parms: {
            type: 'object',
            properties: {
                token: { 'type': 'string' },
            }
        },
        data: {
            type: 'object',
            properties: {}
        }
    }
});

messages.printer.get_files = new Message({
    method: 'get',
    url: '/fileops/list',
    responseType: 'json',
    type: 'object',
    properties: {
        parms: {
            type: 'object',
            properties: {
                token: { 'type': 'string' },
            }
        },
    }
});


class Request {
    constructor(obj) {
        if (!obj.method) throw new Error(`No method on ${JSON.stringify(obj)}.`);
        if (!obj.url) throw new Error(`No url on ${JSON.stringify(obj)}.`);
        if (!obj.request_schema) throw new Error(`No responseType on ${JSON.stringify(obj)}.`);
        this.url = obj.url;
        this.method = obj.method;
        this.request_schema = obj.request_schema;
    }

    async link(hanlder, router, server) {
        this.server = server;
        this.hanlder = hanlder;
        router[this.method](this.url, this.execute.bind(this));
    }

    async execute(req, res, next) {
        let parms = { query: req.query, body: req.body };
        //validate the parms with the schema
        if (this.request_schema) {
            let v = new Validator();
            let validation = v.validate(parms, this.request_schema);
            if (validation.valid === false) {
                return await res.status(400).send(validation.errors);
            }
        }

        //bind the handler to the server
        if (!this.hanlder) throw new Error(`No handler for ${this.url}`);
        let func = this.hanlder.bind(this.server);

        await func(req, res, next).catch(err => {
            console.error(err);
            res.status(500).send(err.toString());
        });
    }

}
messages.api = {};
messages.api.login = new Request({
    method: 'get',
    url: '/user/login',
    request_schema: {
        type: 'object',
        properties: {
            query: {
                type: 'object',
                properties: {
                    username: { type: 'string', minLength: 5, maxLength: 25 },
                    password: { type: 'string', minLength: 5, maxLength: 50 },
                },
                required: ['username', 'password'],
            },
            required: ['query'],
        }
    },

});
 
messages.api.PrinterCamera = new Request({
    method: 'get',
    url: '/printer/camera',
    request_schema: {
        type: 'object',
        properties: {
            query: {
                type: 'object',
                properties: {
                    id: { 
                        type: 'string',
                        pattern: '^[0-9]+$',
                    },
                },
                required: ['id'],
            },
            required: ['query'],
        }
    },

});



module.exports = messages;
