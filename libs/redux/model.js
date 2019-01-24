/**
 * Created by kumardivyarajat on 22/09/16.
 */

module.exports = function (mongoose) {
    var Schema = mongoose.Schema;

    var reduxSchema = new Schema({
        route: {type: String, index: true},
        ipAddress: String,
        ipDetails: {},
        metaData: {},
        version: String,
        trace: [],
        sessionId: {type: String, index: true},
        method: String,
        userAgent: String,
        appAgent: String,
        accessToken: String,
        accessTokenHash: String,
        refreshToken: String,
        resolved: {type: Boolean, default: false, index: true},
        ttr: {type: Number},
        userId: {type: String, index: true},
        user: {type: Object},
        query: {type: Object},
        body: {type: Object},
        params: {type: Object},
        tags: [],
        path: {type: String, index: true},
        originalUrl: {type: String}
    }, {timestamps: true});
    if (reduxSchema.index)
        reduxSchema.index({createdAt: 1});

    return mongoose.model('ReduxTrace', reduxSchema);
};
