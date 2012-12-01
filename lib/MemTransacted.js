/**
 * Main dependencies
 */
var uuid = require('node-uuid');
var MemTransactedEntity = require('./MemTransactedEntity.js');

/**
 * @param {Memcached} memcachedClient 	 provides direct access to Memcached.
 * @param {FSClient} fsClient	basic FS I/O operations client.
 * @param {JSON} options	JSON that specifies some optional parameters
 *				that configures MemcachedTransacted client 
 * 				and/or modifies timeline execution with debug
 * 				info traces, etc.
 */
function MemcachedTransacted(memcachedClient, fsClient, options) {
	this.memcachedClient = memcachedClient;
	this.fsClient = fsClient;
	
	this.options = options || {};
	this.debug = null;
    
	if (this.options.debug) {
		if (this.options.debug === true) {
			this.debug = console.info;
		}
	}
}

module.exports = MemcachedTransacted;


/**
 * Transaction lifecycle functions.
*/

MemcachedTransacted.prototype.initTransaction = function () {
    this.tx = uuid.v4();
    this.fsClient.writeFile(this.tx, '');
};

MemcachedTransacted.prototype.finishTransaction = function () {

  
};


/**
 * MemchachedTransacted operatios.
 */

/** ADD KEY, val: Añade un elemento si no existe. Si funciona retorna el elemento. Si falla retorna false
 * Adds a new element if it doesn't exist.
 * @param {Object}	The callback function get two parameters: 'error', which is Boolean and
 *			indicates if the operation succeded, and 'element', which returns the
 *			element added.
 */
MemcachedTransacted.prototype.add = function (key, value, callback) {
    var op = {};
    
    // Read from tx file and check if there exists an entry with that key.
    var operations = this.fsClient.readFile(this.tx);
    
    if(operations) {
      op = operations.split(';');
      
      for(var i=0; i<op.length; i++) {
	var value = op[i];
	if(value!='') {
	  try {
	    
	    var json = JSON.parse(value);
	    if(json.type == 'add' && json.entity.key == key) {
	      return callback(true);
	    }
	    
	  }catch(e) {
	    console.log('Entry value is not a JSON!');
	  }
	  
	}
      }
    }
    
    // If it doesn't:
    var entity = new MemTransactedEntity();
    entity.key = key;
    entity.version = 0;
    entity.value = value;
    entity.tx = this.tx;
    op[key] = { type: 'add', entity: entity };
        
    this.fsClient.appendToFile(this.tx, JSON.stringify({ type: 'add', entity: entity })+';');
    
};

/** SET KEY, val: Establece un elemento. Retorna el elemento. No falla
 * Sets an element to the key.
 * @param {Object}	The callback function get one parameter: 'element', which returns the
 *			element added.
 */
MemcachedTransacted.prototype.set = function (key, entity, callback) {

};

/** UPDATE KEY,val: Actualiza un elemento. Retorna el elemento. Falla si no existe en cuyo caso retorna false
 * Updates an entry entity by it's key.
 * @param {Object}	The callback function get two parameters: 'error', which is Boolean and
 *			indicates if the operation was succeded, and 'element', which returns the
 *			element added.
 */
MemcachedTransacted.prototype.update = function (key, entity, callback) {

  
};

/** INCR KEY,n: Suma n a un número. Si no existe o no es numérico retorna false. Si funciona retorna el resultado
 * Increments a numberic entity to the element by it's key if the entity is numeric.
 * @param {String} 	Entry memcached key.
 * @param {Number}	Number to increase by. 
 * @param {Object}	The callback function get two parameters: 'error', which is Boolean and
 *			indicates if the operation was succeded, and 'number', which returns the numeric result.
 */
MemcachedTransacted.prototype.incr = function (key, number, callback) {

};

/** GETV KEY: Lee un elemento y su num de versión/cambio. Retorna false si no existe. 
 *  Retorna un array  [valor,versión] si existe. El array contiene el valor y un número de versión.
 * Reads an element ant it's version.
 * @param {String} 	Entry memcached key.
 * @param {Object}	The callback function get two parameters: 'error', which is Boolean and
 *			indicates if the operation was succeded, and 'result', which is an array
 * 			composed by [value, version]
 */
MemcachedTransacted.prototype.getv = function (key, callback) {

};

/** UPDATEV KEY,val,ver: Igual a update pero solo realiza el cambio si el elemento coincide con el
 *  número de versión introducido, es decir, si nadie lo ha modificado desde entonces.
 * Updates an entry entity by it's key only if the version is the same as the one indicated.
 * @param {String} 	Entry memcached key. 
 * @param {Object}	The callback function get two parameters: 'error', which is Boolean and
 *			indicates if the operation was succeded, and 'element', which returns the
 *			element added.
 */
MemcachedTransacted.prototype.update = function (key, entity, version, callback) {

  
};

/**
 * DELETE KEY: Borra la clave si existe. Retorna true si borrado. False en caso contrario 
 */
MemcachedTransacted.prototype.delete = function (key, callback) {

  
};