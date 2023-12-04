const { addBookHandler, getBooksHandler } = require("./handler");

const routes = [
    {
        method: 'GET',
        path: '/books',
        handler: getBooksHandler
    },
    {
        method: 'POST',
        path: '/book',
        handler: addBookHandler
    }
];
    
module.exports = routes;