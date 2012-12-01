/**
 * Memtransacted Entity object.
 */

function MemcachedTransactedEntity() {
  this.key = null;
  this.value = null;
  this.version = null;
  this.tx = null;

}
module.exports = MemcachedTransactedEntity;