
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('accounts').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('accounts').insert({id: 10, user_name: 'Maxine', hash: 'isnice'}),
        knex('accounts').insert({id: 2, user_name: 'Dominic', hash: 'secret'}),
        knex('accounts').insert({id: 3, user_name: 'Crispy', hash: 'crisp'})
      ]);
    });
};
