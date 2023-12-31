const { nanoid } = require('nanoid');
const books = require('./book');

const getBooksHandler= (req, res) => {
  try {
    const param = req.query;
    let result = books;
    param.reading = param.reading > 0 ? true:false;
    param.finished = param.finished > 0 ? true:false;

    let name = param.name ?? undefined;
    result = name !== undefined ? result.filter((book) => book.name.toLowerCase().includes(name.toLowerCase())) : result;
    // Filter By Finished is True
    result = param.finished ? result.filter((book) => book.finished === param.finished) : result;
    // Filter By Reading is True
    result = param.reading ? result.filter((book) => book.reading === param.reading) : result;
    // Filter By Name
    // Format JSON for id, name, publisher
    result = result.map(({ id, name, publisher }) => ({ id, name, publisher }));

    const response = res.response({
        status : "success",
        data : {
            books:result
        }
    });
    response.code(200);
    return response;
  } catch (error) {
    const response = res.response({
        status : "fail",
        data : {
            books:null
        }
    });
    response.code(500);
    return response;
  }
}

const getBookByIdHandler = (req, res) => {
  const { bookId } = req.params;
 
  const book = books.filter((n) => n.id === bookId)[0];
 
if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }
 
  const response = res.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const addBookHandler = (req, res) => {
    const { name, year, author, summary, publisher, pageCount, readPage,  reading } = req.payload;

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;
   
    const newData = {
      id, 
      name, 
      year, 
      author, 
      summary, 
      publisher, 
      pageCount, 
      readPage, 
      finished, 
      reading, 
      insertedAt, 
      updatedAt,
    };
   
    books.push(newData);
   
    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if(!name || name.length < 1){
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
          bookId: id,
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

const editBookByIdHandler = (req, res) => {
  const { bookId } = req.params;
 
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = req.payload;
  const updatedAt = new Date().toISOString();
 
  const index = books.findIndex((book) => book.id === bookId);

  if(!name || name.length < 1){
    const response = res.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
  }

  if(readPage > pageCount){
    const response = res.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
  }
 
  if (index !== -1) {
    books[index] = {
      ...books[index],
      name, 
      year, 
      author, 
      summary, 
      publisher, 
      pageCount, 
      readPage, 
      reading, 
      updatedAt,
    };
 
    const response = res.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
 
  const response = res.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (req, res) => {
  const { bookId } = req.params;
 
  const index = books.findIndex((book) => book.id === bookId);
 
  if (index !== -1) {
    books.splice(index, 1);
    const response = res.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
 
  const response = res.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};


module.exports = {getBooksHandler, addBookHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler};