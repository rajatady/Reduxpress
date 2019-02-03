<h1>Reduxpress</h1>
<hr>

A utility framework built on top of [expressJS] to provide single line implementations for commonly used tasks.

[![view on npm](https://img.shields.io/npm/v/reduxpress.svg)](https://www.npmjs.org/package/reduxpress)
[![view on npm](https://img.shields.io/npm/dm/reduxpress.svg)](https://www.npmjs.org/package/reduxpress)

***

It provides the following functionality
* Request Validation
* Formatted Console Logs
* Authentication
* Response Handling
* Error Handling
* Object Logging in File or DB

### Example Usage

1. Install the reduxpress module

* `npm i reduxpress --save`

2. Configure the module before the endpoints

```javascript
// server.js

import reduxpress from 'reduxpress'
// var reduxpress = require('reduxpress')
import api from './api';
// var api = require('./api');

...

reduxpress.setOptions({
    saveTrace : true,
    // default - false | Flag to save the data generated with each request,
    secret : '<YOUR JWT SECRET HERE>'
})

    ...
```

3. Mount the object as a middleware before the endpoints you want to have reduxpress included in

```javascript
// server.js

...
app.use(reduxpress.mount);
// OR app.use('/api', reduxpress.mount);

...

app.post('/api', api);

...

```

4. Access the redux object from the request object directly. Each redux object is unique and is saved separately for all the incoming requests

```javascript
// api.js

module.exports = function(request, response) {
    var redux = request.redux;

    redux
        .bodyValidator(response, ['name', '^email'])
        .then(function(body) {
            // body should now contain name property and an optional email
            redux.sendSuccess(response, body, 'body');
        })
        .catch(function(err) {
            // if the name property is not present in the body of the request, an error will be thrown
            redux.sendError(response, err);
        })
}

```


    ## Modules

<dl>
<dt><a href="#module_reduxpress">reduxpress</a></dt>
<dd></dd>
</dl>

## Classes

<dl>
<dt><a href="#Redux">Redux</a></dt>
<dd><p>Redux</p>
</dd>
</dl>

## Members

<dl>
<dt><a href="#defaultOptions">defaultOptions</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#router">router</a></dt>
<dd><p>Created by kumardivyarajat on 10/10/16.</p>
</dd>
</dl>

<a name="module_reduxpress"></a>

## reduxpress

* [reduxpress](#module_reduxpress)
    * _static_
        * [.schema](#module_reduxpress.schema)
        * [.logger](#module_reduxpress.logger)
        * [.setOptions(options)](#module_reduxpress.setOptions)
        * [.mount(request, response, next)](#module_reduxpress.mount)
        * [.startCronJobs()](#module_reduxpress.startCronJobs)
        * [.router()](#module_reduxpress.router) ⇒ <code>Routes</code>
        * [.crud()](#module_reduxpress.crud) ⇒ <code>Crud</code>
        * [.getTestDouble(options)](#module_reduxpress.getTestDouble)
    * _inner_
        * [~tokenValidatorMiddleware(aclRules, debug)](#module_reduxpress..tokenValidatorMiddleware)

<a name="module_reduxpress.schema"></a>

### reduxpress.schema
Exports the model object

**Kind**: static property of [<code>reduxpress</code>](#module_reduxpress)  
**Export**: Model  
<a name="module_reduxpress.logger"></a>

### reduxpress.logger
Exports the logger object

**Kind**: static property of [<code>reduxpress</code>](#module_reduxpress)  
**Export**: logger  
<a name="module_reduxpress.setOptions"></a>

### reduxpress.setOptions(options)
Set options for the redux framework

**Kind**: static method of [<code>reduxpress</code>](#module_reduxpress)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> |  |
| options.saveTrace | <code>Boolean</code> | Whether the generated logs should be save |
| options.supressInitMessage | <code>Boolean</code> | Whether to suppress request entry message in the console {defaults to false} |
| options.ipHeader | <code>Boolean</code> | Which header to parse in order to get the IP address of user. Defaults to the express default. |
| options.mongooseInstance | <code>String</code> | The mongoose instance for saving the data when the storage engine is db |
| options.extendIpData | <code>Boolean</code> | Whether or not to extend the IP address data |
| options.engine | <code>String</code> | The storage engine to use. Either file or db. Defaults to db. |
| options.auth.external | <code>Boolean</code> | Is the authentication logic local or external |
| options.auth.apiUrl | <code>String</code> | API Url of the external authentication node |
| options.auth.method | <code>String</code> | The HTTP method to use {defaults to GET} |
| options.auth.oauthToken | <code>String</code> | The oauth token to be used for authentication |
| options.auth.scope | <code>String</code> | The scope for oauth |
| options.authCallback | <code>String</code> | Callback function to be executed once the token has been validated |
| options.onError | <code>String</code> | Callback function to be executed when an error is encountered |

**Example**  
```js
{
     reduxpress.setOptions({
         saveTrace : false
     });
}
```
<a name="module_reduxpress.mount"></a>

### reduxpress.mount(request, response, next)
**Kind**: static method of [<code>reduxpress</code>](#module_reduxpress)  

| Param |
| --- |
| request | 
| response | 
| next | 

<a name="module_reduxpress.startCronJobs"></a>

### reduxpress.startCronJobs()
**Kind**: static method of [<code>reduxpress</code>](#module_reduxpress)  
**Description-**: Starts the internal cron jobs  
<a name="module_reduxpress.router"></a>

### reduxpress.router() ⇒ <code>Routes</code>
**Kind**: static method of [<code>reduxpress</code>](#module_reduxpress)  
<a name="module_reduxpress.crud"></a>

### reduxpress.crud() ⇒ <code>Crud</code>
**Kind**: static method of [<code>reduxpress</code>](#module_reduxpress)  
<a name="module_reduxpress.getTestDouble"></a>

### reduxpress.getTestDouble(options)
**Kind**: static method of [<code>reduxpress</code>](#module_reduxpress)  

| Param |
| --- |
| options | 

<a name="module_reduxpress..tokenValidatorMiddleware"></a>

### reduxpress~tokenValidatorMiddleware(aclRules, debug)
**Kind**: inner method of [<code>reduxpress</code>](#module_reduxpress)  

| Param |
| --- |
| aclRules | 
| debug | 

<a name="Redux"></a>

## Redux
Redux

**Kind**: global class  

* [Redux](#Redux)
    * [new Redux(model, options)](#new_Redux_new)
    * [.logger()](#Redux+logger) ⇒ <code>Redux.logger</code> \| <code>\*</code>
    * [.printTrace()](#Redux+printTrace)
    * [.log(data, title)](#Redux+log)
    * [.err(data)](#Redux+err)
    * [.suppressInput()](#Redux+suppressInput) ⇒ [<code>Redux</code>](#Redux)
    * [.paramsValidator(request, params)](#Redux+paramsValidator)
    * [.bodyValidator(request, params)](#Redux+bodyValidator)
    * [.queryValidator(request, params)](#Redux+queryValidator)
    * [.utils()](#Redux+utils) ⇒
    * [.idValidator(data)](#Redux+idValidator)
    * [.response()](#Redux+response) ⇒
    * [.setExtra(key, value)](#Redux+setExtra) ⇒ [<code>Redux</code>](#Redux)
    * [.sendSuccess(response, data, key)](#Redux+sendSuccess)
    * [.sendJSON(response, data, status)](#Redux+sendJSON)
    * [.sendError(response, data, message)](#Redux+sendError)
    * [.auth()](#Redux+auth) ⇒ <code>exports.auth</code> \| <code>\*</code>
    * [.interceptor(request, params, findDataIn)](#Redux+interceptor)
    * [.putInterceptor(request, bodyData, params)](#Redux+putInterceptor)
    * [.invokeAcl(value, debug)](#Redux+invokeAcl) ⇒ [<code>Redux</code>](#Redux)
    * [.tokenValidator(request)](#Redux+tokenValidator)
    * [.setCurrentUser(user)](#Redux+setCurrentUser)
    * [.addTag(tags)](#Redux+addTag)
    * [.saveAuthDetails(data)](#Redux+saveAuthDetails)
    * [.verifyToken(token)](#Redux+verifyToken) ⇒ <code>Promise</code>
    * [.generateToken(user, accessTokenTime, refreshTokenTime, unit)](#Redux+generateToken) ⇒ <code>Promise</code>
    * [.generateOTP(secret, options)](#Redux+generateOTP) ⇒ <code>Promise</code>
    * [.verifyOTP(secret, OTP, options)](#Redux+verifyOTP) ⇒ <code>Promise</code>
    * [.generateError(code, message)](#Redux+generateError) ⇒ <code>\*</code>
    * [.sendSingleSMS(mobile, message)](#Redux+sendSingleSMS) ⇒ <code>bluebird</code>
    * [.setMetaData(data)](#Redux+setMetaData) ⇒ [<code>Redux</code>](#Redux)

<a name="new_Redux_new"></a>

### new Redux(model, options)

| Param |
| --- |
| model | 
| options | 

<a name="Redux+logger"></a>

### redux.logger() ⇒ <code>Redux.logger</code> \| <code>\*</code>
**Kind**: instance method of [<code>Redux</code>](#Redux)  
<a name="Redux+printTrace"></a>

### redux.printTrace()
**Kind**: instance method of [<code>Redux</code>](#Redux)  
<a name="Redux+log"></a>

### redux.log(data, title)
**Kind**: instance method of [<code>Redux</code>](#Redux)  

| Param |
| --- |
| data | 
| title | 

<a name="Redux+err"></a>

### redux.err(data)
**Kind**: instance method of [<code>Redux</code>](#Redux)  

| Param |
| --- |
| data | 

<a name="Redux+suppressInput"></a>

### redux.suppressInput() ⇒ [<code>Redux</code>](#Redux)
**Kind**: instance method of [<code>Redux</code>](#Redux)  
<a name="Redux+paramsValidator"></a>

### redux.paramsValidator(request, params)
**Kind**: instance method of [<code>Redux</code>](#Redux)  

| Param |
| --- |
| request | 
| params | 

<a name="Redux+bodyValidator"></a>

### redux.bodyValidator(request, params)
**Kind**: instance method of [<code>Redux</code>](#Redux)  

| Param |
| --- |
| request | 
| params | 

<a name="Redux+queryValidator"></a>

### redux.queryValidator(request, params)
**Kind**: instance method of [<code>Redux</code>](#Redux)  

| Param |
| --- |
| request | 
| params | 

<a name="Redux+utils"></a>

### redux.utils() ⇒
**Kind**: instance method of [<code>Redux</code>](#Redux)  
**Returns**: Utils  
<a name="Redux+idValidator"></a>

### redux.idValidator(data)
**Kind**: instance method of [<code>Redux</code>](#Redux)  

| Param |
| --- |
| data | 

<a name="Redux+response"></a>

### redux.response() ⇒
**Kind**: instance method of [<code>Redux</code>](#Redux)  
**Returns**: Response  
<a name="Redux+setExtra"></a>

### redux.setExtra(key, value) ⇒ [<code>Redux</code>](#Redux)
**Kind**: instance method of [<code>Redux</code>](#Redux)  

| Param |
| --- |
| key | 
| value | 

<a name="Redux+sendSuccess"></a>

### redux.sendSuccess(response, data, key)
Send back data to the client with the pre defined schema

**Kind**: instance method of [<code>Redux</code>](#Redux)  

| Param |
| --- |
| response | 
| data | 
| key | 

<a name="Redux+sendJSON"></a>

### redux.sendJSON(response, data, status)
Sends response as raw JSON passed as parameter to the client instead of enforcing a schema

**Kind**: instance method of [<code>Redux</code>](#Redux)  

| Param |
| --- |
| response | 
| data | 
| status | 

<a name="Redux+sendError"></a>

### redux.sendError(response, data, message)
Send back error to the client

**Kind**: instance method of [<code>Redux</code>](#Redux)  

| Param |
| --- |
| response | 
| data | 
| message | 

<a name="Redux+auth"></a>

### redux.auth() ⇒ <code>exports.auth</code> \| <code>\*</code>
**Kind**: instance method of [<code>Redux</code>](#Redux)  
<a name="Redux+interceptor"></a>

### redux.interceptor(request, params, findDataIn)
**Kind**: instance method of [<code>Redux</code>](#Redux)  

| Param |
| --- |
| request | 
| params | 
| findDataIn | 

<a name="Redux+putInterceptor"></a>

### redux.putInterceptor(request, bodyData, params)
**Kind**: instance method of [<code>Redux</code>](#Redux)  

| Param |
| --- |
| request | 
| bodyData | 
| params | 

<a name="Redux+invokeAcl"></a>

### redux.invokeAcl(value, debug) ⇒ [<code>Redux</code>](#Redux)
**Kind**: instance method of [<code>Redux</code>](#Redux)  

| Param |
| --- |
| value | 
| debug | 

<a name="Redux+tokenValidator"></a>

### redux.tokenValidator(request)
**Kind**: instance method of [<code>Redux</code>](#Redux)  

| Param |
| --- |
| request | 

<a name="Redux+setCurrentUser"></a>

### redux.setCurrentUser(user)
**Kind**: instance method of [<code>Redux</code>](#Redux)  

| Param |
| --- |
| user | 

<a name="Redux+addTag"></a>

### redux.addTag(tags)
**Kind**: instance method of [<code>Redux</code>](#Redux)  

| Param |
| --- |
| tags | 

<a name="Redux+saveAuthDetails"></a>

### redux.saveAuthDetails(data)
**Kind**: instance method of [<code>Redux</code>](#Redux)  

| Param |
| --- |
| data | 

<a name="Redux+verifyToken"></a>

### redux.verifyToken(token) ⇒ <code>Promise</code>
**Kind**: instance method of [<code>Redux</code>](#Redux)  

| Param |
| --- |
| token | 

<a name="Redux+generateToken"></a>

### redux.generateToken(user, accessTokenTime, refreshTokenTime, unit) ⇒ <code>Promise</code>
**Kind**: instance method of [<code>Redux</code>](#Redux)  

| Param |
| --- |
| user | 
| accessTokenTime | 
| refreshTokenTime | 
| unit | 

<a name="Redux+generateOTP"></a>

### redux.generateOTP(secret, options) ⇒ <code>Promise</code>
**Kind**: instance method of [<code>Redux</code>](#Redux)  

| Param |
| --- |
| secret | 
| options | 

<a name="Redux+verifyOTP"></a>

### redux.verifyOTP(secret, OTP, options) ⇒ <code>Promise</code>
**Kind**: instance method of [<code>Redux</code>](#Redux)  

| Param |
| --- |
| secret | 
| OTP | 
| options | 

<a name="Redux+generateError"></a>

### redux.generateError(code, message) ⇒ <code>\*</code>
**Kind**: instance method of [<code>Redux</code>](#Redux)  

| Param |
| --- |
| code | 
| message | 

<a name="Redux+sendSingleSMS"></a>

### redux.sendSingleSMS(mobile, message) ⇒ <code>bluebird</code>
**Kind**: instance method of [<code>Redux</code>](#Redux)  

| Param |
| --- |
| mobile | 
| message | 

<a name="Redux+setMetaData"></a>

### redux.setMetaData(data) ⇒ [<code>Redux</code>](#Redux)
**Kind**: instance method of [<code>Redux</code>](#Redux)  

| Param |
| --- |
| data | 

<a name="defaultOptions"></a>

## defaultOptions : <code>Object</code>
**Kind**: global variable  
**Default**: <code>Default Options</code>  
<a name="router"></a>

## router
Created by kumardivyarajat on 10/10/16.

**Kind**: global variable  

* * *

<h2>LICENSE</h2>
MIT License

Copyright (c) 2017-2018 Kumar DIvya Rajat

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


[expressJS]: (https://github.com/expressjs/express)
