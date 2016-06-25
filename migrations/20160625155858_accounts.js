
exports.up = function(knex, Promise) {
  console.log('create accounts table');
  return knex.schema.createTableIfNotExists('accounts', function(table) {
    table.increments('id')
    table.string('user_name')
    table.string('hash')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('accounts').then(function () {
    console.log('accounts table was dropped')
  })
};
