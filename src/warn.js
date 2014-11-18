/**
 * warns
 *
 * @param template {String}
 * @returns
 */
function warn(condition, template, ...replacements){
  if(condition || !console || !console.warn) {
    return
  }
  console.warn.apply(console, [template].concat(replacements))
}

module.exports = warn
