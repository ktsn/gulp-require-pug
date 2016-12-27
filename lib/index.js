const path = require('path')
const fs = require('fs')
const through = require('through2')
const pug = require('pug')
const PluginError = require('gulp-util').PluginError
const PLUGIN_NAME = 'gulp-require-pug'

module.exports = function gulpRequirePug (options = {}) {
  const data = options.data || {}
  delete options.data

  function transform (file, encoding, done) {
    if (file.isStream()) {
      emitError(this, 'Streams are not supported')
    }

    if (file.isBuffer()) {
      const basePath = path.dirname(file.path)
      const contents = String(file.contents)
      const finalData = Object.assign(file.data || {}, data)

      file.contents = Buffer.from(transformRequires(contents, pugPath => {
        const pugSrc = fs.readFileSync(path.resolve(basePath, pugPath), 'utf8')
        return pug.compile(pugSrc, options)(finalData)
      }))
    }

    done(null, file)
  }
  return through.obj(transform)
}

/**
 * Transform all require expression
 * content - string
 * fn - RequirePath -> TransformedContent
 */
function transformRequires (contents, fn) {
  const regexp = /require\(['"](.+?)["']\)/g

  let match
  while (match = regexp.exec(contents)) { // eslint-disable-line
    const start = match.index
    const end = start + match[0].length
    const length = end - start

    // Escape quotes
    const transformed = JSON.stringify(fn(match[1]))

    // Replace `require` with transformed contents
    contents = contents.slice(0, start) + transformed + contents.slice(end)

    // Tweak the start position for next match
    // by transformed contents
    regexp.lastIndex += transformed.length - length
  }

  return contents
}

function emitError (stream, message) {
  return stream.emit('error', new PluginError(PLUGIN_NAME, message))
}
