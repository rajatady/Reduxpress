# Getting Started

## 1. Install reduxpress
`npm install reduxpress`

## 2. Set options
```
// es6
import reduxpress from 'reduxpress'

//es5 
const reduxpress = require('reduxpress')

...


reduxpress.setOptions({
    secret : process.env.JWT_SECRET, // sets up the JWT secret for authentication'
    saveTrace : false, // set the 
})
```



