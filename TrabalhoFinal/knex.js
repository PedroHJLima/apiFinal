var knex = require('knex')({
    client:'postgres',
    connection:{
        host:'localhost',
        user:'postgres',
        password:'123456',
        database:'livraria',
        port: 5433
    }
});

module.exports = knex;