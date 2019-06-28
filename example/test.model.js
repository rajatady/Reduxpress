var mongoose = require('mongoose')


var schema = new mongoose.Schema({
    cachedUser: {
        type: Object,
        required: true
    }
});

module.exports = mongoose.model('Users', schema);
