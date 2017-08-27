/**
 * Created by kumardivyarajat on 27/11/16.
 */
var QuickBooks = require('node-quickbooks')

var qbo = new QuickBooks(consumerKey,
    consumerSecret,
    oauthToken,
    oauthTokenSecret,
    realmId,
    false, // don't use the sandbox (i.e. for testing)
    true); // turn debugging on

