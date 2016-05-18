var pg_connection;

if(process.env.NODE_ENV === 'test'){
  pg_connection = {
    host: 'localhost',
    port: 5432,
    user: 'admin',
    password: 'admin',
    database: 'monthlyapi-test'
  }
} else if(process.env.NODE_ENV === 'production'){
  // fill in values based on process elements
} else {
  pg_connection = {
    host: 'localhost',
    port: 5432,
    user: 'admin',
    password: 'admin',
    database: 'monthlyapi'
  }
}
module.exports = pg_connection;