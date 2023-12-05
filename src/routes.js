const { addBookHandler, getBooksHandler, getBookByIdHandler, editBookByIdHandler } = require("./handler");

const routes = [
    {
        method: 'GET',
        path: '/books',
        handler: getBooksHandler
    },
    {
        method: 'GET',
        path: '/books/{bookId}',
        handler: getBookByIdHandler
    },
    {
        method: 'POST',
        path: '/books',
        handler: addBookHandler
    },
    {
        method: 'PUT',
        path: '/books/{bookId}',
        handler: editBookByIdHandler
    },
];
    
module.exports = routes;