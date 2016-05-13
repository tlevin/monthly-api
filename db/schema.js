var pg_connection = require('../env.js')

var knex = require('knex')({
  client: 'pg',
  connection: pg_connection
});

knex.schema.hasTable('monthly_charges').then(function(exists){
  if(!exists){
    knex.schema.createTable('monthly_charges', function(table){
      table.increments('id').primary();
      table.timestamps();
      table.json('pricing_tiers');
      table.integer('users');
      table.integer('charge');
      table.json('company_name');
      table.string('month');
    }).then(function(){
      console.log('Monthly Charges table created');
    });
  }
});

module.exports = knex;

