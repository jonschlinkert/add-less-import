var path = require('path');
var file = require('fs-utils');
var _ = require('lodash');
var format = require('./lib/format.js');

/**
 * Pass a string, the import statement to add, and a keyword in a code comment that indicates where you want the `@import` statement to be added.
 * Duplicates will only be _uniqued_ when they are in the same "section".
 *
 * **Example**
 *
 * Assuming you have a `.less` file and it looks something like this:
 *
 * ```less
 * //
 * // Styles
 * // --------------------------------------------
 *
 * // Variables and mixins
 * `@import "variables.less";
 * `@import "mixins.less";
 *
 * // Components
 * `@import "alerts.less";
 * `@import "buttons.less";
 *
 * // Utilities
 * `@import "utilities.less";
 * ```
 *
 * Here is how you would add import statements:
 *
 * ```js
 * var addImport = require('add-less-import');
 * var str = fs.readFileSync('bootstrap.less', 'utf8');
 *
 * // obviously you would probably want to do this dynamically,
 * // like with command line arguments. this is just an example
 * addImport(str, 'components', '@import "nav.less";');
 * ```
 *
 * The result would be:
 *
 * ```less
 * //
 * // Styles
 * // --------------------------------------------
 *
 * // Variables and mixins
 * `@import "variables.less";
 * `@import "mixins.less";
 *
 * // Components
 * `@import "alerts.less";
 * `@import "buttons.less";
 * `@import "nav.less";
 *
 * // Utilities
 * `@import "utilities.less";
 * ```
 *
 * @param   {String}  `str`
 * @param   {String}  `section` The code-comment keyword to search for.
 * @param   {String}  `statement` The full import statement.
 * @param   {Object}  `options`
 * @return  {String}
 */

module.exports = function(str, statement, section, options) {
  if (arguments.length === 2 || typeof section === 'object') {
    throw new Error('You must pass a section to add-less-import. e.g. just a keyword in a code comment before the insertion point.');
  }

  var imports = new RegExp('((^\\/[\\/\\*])(\\s*' + section + '\\s*)([^^@]+)([^\\/*\\/]+))', 'gmi');
  var output = str.replace(imports, function(match, $1, $2, $3, $4, components) {
    var comment = $2 + $3 + $4;
    components = components + '\n' + statement;
    components = _.unique(components.split('\n')).join('\n');

    var str = '';
    str += comment;
    str += '\n';
    str += components;
    str += '\n';
    return str;
  });

  if (options.format) {
    return format(output);
  }

  return output;
};
