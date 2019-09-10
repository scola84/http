## 6.0.10 (Tue Sep 10 2019)

* Update dependencies

## 6.0.9

* Update scripts

## 6.0.8

* Update dependencies

## 6.0.7

* Update license

## 6.0.6

* Update scripts

## 6.0.5

* Reimplement license, add scripts

## 6.0.4

* Update dependencies

## 6.0.3

* Update dependencies

## 6.0.2

* Update dependencies

## 6.0.1

* Update dependencies

## 6.0.0

* Prepare publish
* Implement standardjs
* Move object to helper
* Use new streamer interface
* Update dependencies
* Reorder methods
* Fix reference
* Handle regexp named capture in routers
* Update rollup config
* Fix resource router
* Update dependencies
* Smarter path format
* Remove locale
* Fix request/resource router
* Add err methods to connectors
* Improve response transformer
* Return array from client factory
* Fix request line writer
* Add buffer import/check
* Do not set data on error
* Simplify logging
* Implement message end
* Check method in resolvers
* Fix formdata path
* Move user
* Remove default router in server factory
* Allow array output in factories
* Add err to response transformer
* Fix request line parser, remove default hostname
* Refactor statics
* Fix defaults
* Refactor
* Update rollup config
* Integrate codec
* Change to named expoorts
* Remove encoding headers in browser mediator
* Remove options, add log, refactor
* Implement file resolver
* Implement resolvers, improve routers, refactor
* Add content-length header to browser response
* Make private methods public
* Improve responses, add locale
* Fix createResponse
* Simplify factories, improve error resolve
* Update rollup config
* Restructure package

## 5.9.11

* Fix content encoding header

## 5.9.10

* Refactor path router

## 5.9.9

* Decorate XHR in browser connector

## 5.9.8

* Update dependencies
* Remove string from error in response transformer

## 5.9.7

* Make routers more efficient

## 5.9.6

* Update dependencies
* Add static options getter

## 5.9.5

* Add content encoding for gzip files

## 5.9.4

* Remove obsolete password null

## 5.9.3

* Always set box error in response transformer

## 5.9.2

* Catch merge error again

## 5.9.1

* Fix retry

## 5.9.0

* Update dependencies
* Add error state to box in response transformer
* Add retry to client connector

## 5.8.5

* Catch callback errors in response transformer

## 5.8.4

* Improve socket management

## 5.8.3

* Add connection timeout

## 5.8.2

* Update license
* Add label to test
* Add responseString to error in response transformer

## 5.8.1

* Update dependencies
* Add unit tests
* Refactor response transformer

## 5.8.0

* Update dependencies
* Remove default max length of body
* Add connector global options

## 5.7.0

* Update dependencies
* Fix deconstruction in test stub
* Add net stub
* Allow injection of net/tls in client connector
* Merge response data by default in response transformer
* Handle data is null as response
* Improve error handling

## 5.6.2

* Catch errors in response transformer

## 5.6.1

* Update dependencies
* Add extra data to box in response transformer

## 5.6.0

* Improve response transformer
* Remove box from message
* Improve logging of client/server

## 5.5.4

* Fix arguments of private scope call

## 5.5.3

* Update dependencies

## 5.5.2

* Allow partial user name

## 5.5.1

* Fix message defaults

## 5.5.0

* Make format/parse function static

## 5.4.4

* Add parts filter in name format

## 5.4.3

* Remove password from data in checker
* Update get/setters in user

## 5.4.2

* Fix details getter in user

## 5.4.1

* Fix message name getter

## 5.4.0

* Set error on response
* Add convenience methods to message

## 5.3.0

* Add static mask getter

## 5.2.6

* Update dependencies
* Fix import
* Use long for 64-bit integer handling

## 5.2.5

* Delete response in browser by default

## 5.2.4

* Make box resolution optional in response transformer

## 5.2.3

* Throw error if response is being reset

## 5.2.2

* Accept user properties through constructor

## 5.2.1

* Update dependencies

## 5.2.0

* Reimplement scope check in user

## 5.1.4

* Update dependencies
* Improve logging

## 5.1.3

* Add field/reason only to client-side errors

## 5.1.2

* Check end of message
* Add decision to response transformer
* Add message end checker
* Improve header getter
* Remove linebreaks

## 5.1.1

* Prevent erroneous response from being passed more than once

## 5.1.0

* Update dependencies
* Do not write null
* Add file type to response
* Implement serperate file/options resolver, allow logging

## 5.0.1

* Fix calculation of body length

## 5.0.0

* Update dependencies
* Simplify client factory, use bypass
* Fix circular ref in response transformer
* Fix progress callback for non-GET request
* Normalize box in response transformer

## 4.4.2

* Transform errors too

## 4.4.1

* Add response data to error in response transformer

## 4.4.0

* Update dependencies
* Prevent password to end up in logs

## 4.3.0

* Add scope check to user

## 4.2.2

* Fix response transformer

## 4.2.1

* Filter out vulnerable error messages

## 4.2.0

* Update dependencies
* Remove unnecessary trim
* Handle validator errors from the server
* Add information to error
* Smarter error handling, add default password hash
* Make user name formatting static
* Transform response in http client
* Add servername to net/tls connector

## 4.1.1

* Update dependencies

## 4.1.0

* Allow setup by client factory
* Allow catching of client connectiong error
* Remove error details from response
* Filter codecs for browser
* Let decoders handle null data
* If body is empty, pass empty string instead of object
* Allow state to be preset on message
* Prevent duplicate values in header
* Extract paths only once
* Add agent router

## 4.0.2

* Check if data is set, some minor fixes
* Fix URL in request line
* Fix creation of net/tls client
* Allow extra properties on message

## 4.0.1

* Update dependencies

## 4.0.0

* Update dependencies
* Always event (dummy)
* Add default cache control for list/object resolvers
* Allow extra linebreak in response headers
* Add extra callback when xhr is finished
* Handle cookies, modify user
* Fix user construction and checking
* Check password from user on request
* Add file support to object resolver
* Handle progress
* Allow multiple codecs
* Allow in place header parsing
* Set all initial properties to null
* Write Buffer if data is Buffer
* Add person name getter
* Fix bitwise and for 64-bit integers
* Set default value may argument
* Improve act/pass arguments, simplify permission checking
* Replace foreach with for
* Add strings
* Add import/export files
* Add workers, update managers

## 3.3.1

* Break up export

## 3.3.0

* Update dependencies
* Add response transformer to browser client

## 3.2.0

* Update dependencies
* Remove package lock

## 3.1.0

* Resolve to application/octet-stream if data is null
* Pass worker props through constructor
* Fix match of error code
* Update locale

## 3.0.0

* Update dependencies
* Move locale

## 2.1.0

* Add resolvers
* Set user on message

## 2.0.4

* Update dependencies

## 2.0.3

* Add option to delete default headers

## 2.0.2

* Update dependencies

## 2.0.1

* Fix header parsing (tentative)

## 2.0.0

* Update dependencies
* Remove list/object responders

## 1.1.0

* Add responders
* Add strings
* Add static methods to set default headers

## 1.0.1

* Add dependencies

## 1.0.0

* Initial import
