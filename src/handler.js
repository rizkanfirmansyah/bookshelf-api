const { nanoid } = require('nanoid');
const books = require('./book');

const getBooksHandler= (req, res) => {
    const param = req.query;
    let result = books;

    result = param.name ? result.filter((book) => book.name === param.name) : result;
    result = result.map(({ id, name, publisher }) => ({ id, name, publisher }));
    
    const response = res.response({
        status : "success",
        data : {
            books:result
        }
    });
    response.code(200);
    return response;
}

const addBookHandler = (req, res) => {
    const { name, year, author, summary, publisher, pageCount, readPage,  reading } = req.payload;

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;
   
    const newData = {
      id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
    };
   
    books.push(newData);
   
    const isSuccess = books.filter((note) => note.id === id).length > 0;

    if(name.length < 1 ){
        const response = res.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
          });
          response.code(400);
          return response;
    }

    if(readPage > pageCount){
        const response = res.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
          });
          response.code(400);
          return response;
    }
   
    if (isSuccess) {
      const response = res.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          noteId: id,
        },
      });
      response.code(201);
      return response;
    }
   
    const response = res.response({
      status: 'fail',
      message: 'Buku gagal ditambahkan, internal server error',
    });
    response.code(500);
    return response;
};


module.exports = {getBooksHandler, addBookHandler};