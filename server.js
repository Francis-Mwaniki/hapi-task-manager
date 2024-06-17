const Hapi = require('@hapi/hapi');
const Vision = require('@hapi/vision');
const Path = require('path');

const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
        routes: {
            files: {
                relativeTo: Path.join(__dirname, 'public')
            }
        }
    });

    await server.register(Vision);

    server.views({
        engines: {
            html: require('handlebars')
        },
        relativeTo: __dirname,
        path: 'templates'
    });

    let tasks = [];

    server.route([
        {
            method: 'GET',
            path: '/',
            handler: (request, h) => {
                return h.view('index', { tasks });
            }
        },
        {
            method: 'POST',
            path: '/create',
            handler: (request, h) => {
                const newTask = request.payload.task;
                tasks.push(newTask);
                return h.redirect('/');
            }
        },
        {
            method: 'GET',
            path: '/edit/{index}',
            handler: (request, h) => {
                const index = request.params.index;
                const task = tasks[index];
                return h.view('edit', { task, index });
            }
        },
        {
            method: 'POST',
            path: '/update/{index}',
            handler: (request, h) => {
                const index = request.params.index;
                const updatedTask = request.payload.task;
                tasks[index] = updatedTask;
                return h.redirect('/');
            }
        },
        {
            method: 'GET',
            path: '/delete/{index}',
            handler: (request, h) => {
                const index = request.params.index;
                tasks.splice(index, 1);
                return h.redirect('/');
            }
        }
    ]);

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

init();