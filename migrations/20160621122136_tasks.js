
exports.up = function(knex, Promise) {
  console.log('create tasks table');
  return knex.schema.createTableIfNotExists('tasks', function(table) {
    table.increments('id')
    table.integer('userId')
    table.string('task')
  })
  .createTableIfNotExists('accounts',
  function(table) {
    table.increments('id');
    table.string('account_name');
    table.integer('user_id').unsigned().references('users.id');
})
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('tasks').then(function () {
    console.log('tasks table was dropped')
  })
};
