module.exports = {
  address : '127.0.0.1',

  db : {
    url : process.env.MONGOLAB_URI || process.env.MONGOHQ_URL ||'mongodb://localhost/database'
  }
};
