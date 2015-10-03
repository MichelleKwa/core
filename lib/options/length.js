
var isstream = require('isstream')
  , _length = require('@http/length')


function length (req, options, done) {
  if (options.headers.get('transfer-encoding') === 'chunked' ||
      options.headers.get('content-length') !== undefined) {
    return done()
  }

  if (options.body && !options.multipart) {
    if (isstream(options.body)) {
      _length.async(options.body, done)
    }
    else {
      done(_length.sync(options.body))
    }
  }
  else if (req._src) {
    _length.async(req._src, done)
  }
  else if (options.multipart) {
    _length.multipart(options.body, done)
  }
}

module.exports = length