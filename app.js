/**
 * Simple test app.
 */

// Imports and initializations.

var memcache = require('memcache');
var MemTransacted = require('./lib/MemTransacted.js');
var FSClient = require('./lib/FSClient.js');

var fsClient = new FSClient('/home/lcappa/workspace_js/memtransacted/transactions');
var memcachedClient = new memcache.Client(11211, 'localhost');

// Example:

// 1. We create a transaction manager instance.
var memtransacted = new MemTransacted(memcachedClient, fsClient, { debug:true });

// 2. Then we init a transaction.
memtransacted.initTransaction();

// 3. We link several operations into that transaction.
memtransacted.add(1, {title: 'Los tres cerditos',
		      description: 'Pedazo de libro, oiga'},
		  function(error){
		      if(error) {
		          console.log('ERROR: There exists an entry element with that key!');
		      }
		  }
);

memtransacted.add(1, {title: 'Los tres cerditos',
		      description: 'Pedazo de libro, oiga'},
		  function(error){
		      if(error) {
		          console.log('ERROR: There exists an entry element with that key!');
		      }
		  }
);

memtransacted.add(2, {title: 'Crepúsculo',
		      description: 'Soy un vampiro que brilla. Molo mazo.'},
		  function(error){
		      if(error) {
		          console.log('ERROR: There exists an entry element with that key!');
		      }
		  }
);

// 4. Finally we finish our transaction commiting those operations.

