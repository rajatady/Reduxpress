**Usage Examples**

First require the module as a dependency. 





    
    
     var MSG91 = require('msg91-rdx');
     .....
     ...
     ...
     ...
      
     var msg91 = new MSG91(options);
     
     
     // Look at options below
     var options = {
        authKey : '24characterauthkey',
        sender : 'SNDERD' // Your sender ID,
        route : 1 or 4 // 1 - Promotional, 4 - Transactional
        logging : true or false //Optional - Whether to log data
      }
     
     
     
**Send to a single number**
     
     
     
        var data = {
            mobiles: request.body.mobile,
            message: '....'
        };
                        
        msg91.send(data)
            .then(function (success) {
                ....
            })
            .catch(function (err) {
              ...
    
            });
            
                 
**Send to multiple numbers**     
     
     
        var data = {
            mobiles: [], // Notice it is an array now
            message: '....'
        };
       
        msg91.mutiple(data)
            .then(function (success) {
                // ....
            })
            .catch(function (err) {
              //  ...
    
            });
            
            
**Send to numbers from any user array directly**

    // In most cases, the data will either be fetched from the database or from any other source. Its easy to pass in the entire dataset to function. 
    // 
    var users = [
        {
            name: "SAdgf",
            mobile: 98738678445
        },
        {
            name: "SAdgf",
            mobile: 98565474455
        },
        {
            name: "SAdgf",
            mobile: 98767654745
        },
        {
            name: "SAdgf",
            mobile: 9873867845
        }
    ];
   
    msg91.forAllIn( users, 'mobile', params)
            .then(function (data) {
                // ...
            })
            .catch(function (err) {
                // ...
            });
                
           
    
    
            
**Check Balance**

    msg91.checkBalance()
        .then(function (data) {
            // ...
        })
        .catch(function (err) {
            console.log(err);
            // ....
        })