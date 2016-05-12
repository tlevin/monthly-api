

var knex = require('knex')({
  client: 'postgresql',
  connection: {
    host: 'localhost',
    port: 5432,
    user: 'admin',
    password: 'admin',
    database: 'monthlyapi'
  }
});

knex.schema.createTableIfNotExists('companies', function(table){
  console.log('Companies Table created');
  table.increments('id').primary();
  table.string('apiKey');
  table.string('name');
  table.string('contact_name');
  table.string('contact_phone');
  table.string('address_street');
  table.string('address_city');
  table.string('address_state');
  table.string('address_zip');
  table.string('address_country');
});

knex.schema.createTableIfNotExists('monthly_charges', function(table){
  console.log('Monthly Charges table created');
  table.increments('id').primary();
  table.timestamps();
  table.json('pricing_tiers');
  table.integer('users');
  table.integer('charge');
  table.date('month');
  table.integer('company_id').unsigned().index().references('id').inTable('companies');
})

module.exports = knex;

