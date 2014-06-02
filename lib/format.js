/**
 * Format a .less file that only has comments and
 * `@import` statements.
 *
 * @param   {[type]}  str  [description]
 * @return  {[type]}       [description]
 */

module.exports = function(str) {
  str = str.replace(/[\n\r]+/g, '\n');
  str = str.replace(/(^\/[^@]+)/gm, '\n$1\n');
  str = str.replace(/^\s*/, '');
  return str;
};
