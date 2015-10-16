
# @http/core

Duplex Streams2 HTTP client. By default it behaves identically to Node's Core [http.request][node-http-request] method.

Each additional feature must be enabled explicitly via option. Some options requires additional dependencies.


## Table of Contents

- **[Options][options]**
- **[DEBUG Logger][options]**
- **[Events][options]**


---


## Options


### URL

#### url/uri
  - `String`
  - `url.Url`

#### qs
  - `Object`
  - `String`

### Body

#### form
  - `Object`
  - `String`

#### json
  - `Object`
  - `String`

#### body
  - `Stream`
  - `Buffer`
  - `string`
  - `Array`

#### multipart - requires [@http/multipart][http-multipart]
```js
multipart: {key: 'value'}
multipart: {key: ['value', 'value']}
multipart: {key: {
  value: 'value',
  options: {filename: '', contentType: '', knownLength: 0}
}}
```
- Generates `multipart/form-data` or any other `multipart/[TYPE]` body.
The multipart's body item can be either: `Stream`, `Request`, `Buffer` or `String`.

```js
multipart: [{key: 'value', body: 'body'}]
multipart: [{key: 'value', body: 'body'}]
```


### Authentication

#### auth - digest auth requires [@http/digest][http-digest]
- `{user: '', pass: '', sendImmediately: false}`
  - Sets the `Authorization: Basic ...` header.
  - The `sendImmediately` option default to `true` if omitted.
  - The `sendImmediately: false` options requires the [redirect option][redirect-option] to be enabled.
  - Digest authentication requires the [@http/digest][http-digest] module.
- `{bearer: '', sendImmediately: false}`
  - Alternatively the `Authorization: Bearer ...` header can be set if using the `bearer` option.
  - The rules for the `sendImmediately` option from above applies here.


#### oauth - requires [@http/oauth][http-oauth]

#### hawk - requires [hawk][hawk]

#### httpSignature - requires [http-signature][http-signature]

#### aws - requires [aws-sign2][aws-sign2]


### Modifiers

#### gzip
- `gzip: true`
  - Pipes the response body to [zlib][zlib] Inflate or Gunzip stream based on the compression method specified in the `content-encoding` response header.
- `gzip: 'gzip'` | `gzip: 'deflate'`
  - Explicitly specify which decompression method to use.

#### encoding - requires [iconv-lite][iconv-lite]
- `encoding: true`
  - Pipes the response body to [iconv-lite][iconv-lite] stream, defaults to `utf8`.
- `encoding: 'ISO-8859-1'` | `encoding: 'win1251'` | ...
  - Specific encoding to use.
- `encoding: 'binary'`
  - Set `encoding` to `'binary'` when expecting binary response.


### Misc

#### cookie - requires [tough-cookie][tough-cookie]
  - `true`

#### length
  - `true` defaults to `false` if omitted

#### callback
  buffers the response body
  - `function(err, res, body)` by default the response buffer is decoded into string using `utf8`. Set the `encoding` property to `binary` if you expect binary data, or any other specific encoding

#### redirect
  - `true` follow redirects for `GET`, `HEAD`, `OPTIONS` and `TRACE` requests
  - `Object`
    - *all* follow all redirects
    - *max* maximum redirects allowed
    - *removeReferer* remove the `referer` header on redirect

#### parse
  - `{json: true}`
    - sets the `accept: application/json` header for the request
    - parses `JSON` or `JSONP` response bodies (only if the server responds with the approprite headers)
  - `{qs: {sep:';', eq:':'}}`
    - `qs.parse` options to use
  - `{querystring: {sep:';', eq:':', options: {}}}` use the [querystring][node-querystring] module instead
    - `querystring.parse` options to use

#### stringify
  - `{qs: {sep:';', eq:':'}}`
    - `qs.stringify` options to use
  - `{querystring: {sep:';', eq:':', options: {}}}` use the [querystring][node-querystring] module instead
    - `querystring.stringify` options to use

#### end
  - `true` tries to automatically end the request on `nextTick`


---


## HTTPDuplex

###### Private Flags and State

- `_initialized` set when the outgoing HTTP request is fully initialized
- `_started` set after first write/end
- `_req` http.ClientRequest created in HTTPDuplex
- `_res` http.IncomingMessage created in HTTPDuplex
- `_client` http or https module
- `_redirect` boolean indicating that the client is going to be redirected
- `_redirected` boolean indicating that the client is been redirected at least once
- `_src` the input read stream, usually from pipe
- `_chunks` Array - the first chunk read from the input read stream
- `_ended` whether the outgoing request has ended


###### Public Methods

  - `init`
  - `abort`


---

## Request

## Methods

- **Request** the HTTPDuplex child class

## Events

- **init** should be private I guess
- **request** req, options
- **redirect** res
- **options** emit [@http/core][http-core] options
- **body** emit raw response body, either `Buffer` or `String` (the `callback` option is required)
- **json** emit parsed JSON response body (the `callback` and the `parse:{json:true}` options are required)

## req/res

- **headers** is instance of the [@http/headers][http-headers] module


---


## Generated Options

- **url** contains the parsed URL
- **redirect** is converted to object containing all possible options including the `followed` state variable, containing the followed redirects count
- **auth** containes `sent` state variable indicating whether the Basic auth is sent already
- **cookie** is converted to object and containes the initial cookie `header` as a property
- **jar** the internal [tough-cookie][tough-cookie] jar


---


## Logger

Requires [@http/log][http-log]

- **req** prints out the request `method`, `url`, and `headers`
- **res** prints out the response `statusCode`, `statusMessage`, and `headers`
- **http** prints out the options object passed to the underlying `http.request` method
- **raw** prints out the raw `@http/core` options object right before sending the request
- **body** prints out the raw request and response bodies (the response body is available only when the `callback` option is being used)
- **json** prints out the parsed JSON response body (only if the response body is a JSON one, and if the `callback` and `parse.json` options are being used)

```bash
$ DEBUG=req,res node app.js
```

---


## Errors

###### oauth

- `oauth: transport_method: body requires method: POST and content-type: application/x-www-form-urlencoded`
- `oauth: signature_method: PLAINTEXT not supported with body_hash signing`


---


## Notice

This module may contain code snippets initially implemented in [request][request] by [request contributors][request-contributors].


  [request]: https://github.com/request/request
  [request-contributors]: https://github.com/request/request/graphs/contributors
  [zlib]: https://iojs.org/api/zlib.html
  [node-http-request]: https://nodejs.org/api/http.html#http_http_request_options_callback

  [tough-cookie]: https://github.com/SalesforceEng/tough-cookie
  [iconv-lite]: https://www.npmjs.com/package/iconv-lite
  [hawk]: https://github.com/hueniverse/hawk
  [aws-sign2]: https://github.com/request/aws-sign
  [http-signature]: https://github.com/joyent/node-http-signature

  [http-core]: https://github.com/node-http/core
  [http-headers]: https://github.com/node-http/headers
  [http-digest]: https://github.com/node-http/digest
  [http-oauth]: https://github.com/node-http/oauth
  [http-multipart]: https://github.com/node-http/multipart
  [http-log]: https://github.com/node-http/log

  [redirect-option]: #redirect
