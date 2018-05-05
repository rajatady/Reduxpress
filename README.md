## Classes

<dl>
<dt><a href="#Redux">Redux</a></dt>
<dd></dd>
</dl>

## Members

<dl>
<dt><a href="#Promise">Promise</a></dt>
<dd><p>Created by kumardivyarajat on 23/09/16.</p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#defaultOptions">defaultOptions</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="Redux"></a>

## Redux
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
    * [.sendSuccess(response, data, key)](#Redux+sendSuccess)
    * [.sendError(response, data, message)](#Redux+sendError)
    * [.auth()](#Redux+auth) ⇒ <code>exports.auth</code> \| <code>\*</code>
    * [.interceptor(request, params, findDataIn)](#Redux+interceptor)
    * [.tokenValidator(request)](#Redux+tokenValidator)
    * [.setCurrentUser(user)](#Redux+setCurrentUser)
    * [.addTag(tags)](#Redux+addTag)
    * [.saveAuthDetails(data)](#Redux+saveAuthDetails)
    * [.verifyToken(token)](#Redux+verifyToken) ⇒ [<code>Promise</code>](#Promise)
    * [.generateToken(user, accessTokenTime, refreshTokenTime, unit)](#Redux+generateToken) ⇒ [<code>Promise</code>](#Promise)
    * [.generateOTP(secret, options)](#Redux+generateOTP) ⇒ [<code>Promise</code>](#Promise)
    * [.verifyOTP(secret, OTP, options)](#Redux+verifyOTP) ⇒ [<code>Promise</code>](#Promise)
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

<a name="Redux+sendSuccess"></a>

### redux.sendSuccess(response, data, key)
**Kind**: instance method of [<code>Redux</code>](#Redux)  

| Param |
| --- |
| response | 
| data | 
| key | 

<a name="Redux+sendError"></a>

### redux.sendError(response, data, message)
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

### redux.verifyToken(token) ⇒ [<code>Promise</code>](#Promise)
**Kind**: instance method of [<code>Redux</code>](#Redux)  

| Param |
| --- |
| token | 

<a name="Redux+generateToken"></a>

### redux.generateToken(user, accessTokenTime, refreshTokenTime, unit) ⇒ [<code>Promise</code>](#Promise)
**Kind**: instance method of [<code>Redux</code>](#Redux)  

| Param |
| --- |
| user | 
| accessTokenTime | 
| refreshTokenTime | 
| unit | 

<a name="Redux+generateOTP"></a>

### redux.generateOTP(secret, options) ⇒ [<code>Promise</code>](#Promise)
**Kind**: instance method of [<code>Redux</code>](#Redux)  

| Param |
| --- |
| secret | 
| options | 

<a name="Redux+verifyOTP"></a>

### redux.verifyOTP(secret, OTP, options) ⇒ [<code>Promise</code>](#Promise)
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

<a name="Promise"></a>

## Promise
Created by kumardivyarajat on 23/09/16.

**Kind**: global variable  
<a name="defaultOptions"></a>

## defaultOptions : <code>Object</code>
**Kind**: global constant  
**Default**: <code>Default Options</code>  
