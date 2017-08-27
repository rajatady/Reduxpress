/**
 * Created by M-Rayees on 9/26/2016.
 */

const fs = require('fs');

const path = require('path');

const Agenda = require('agenda');

const crypto = require('crypto');

const Setting = require(path.resolve('./modules/config/config')).database.dev;

const dbase = Setting.host + Setting.name;

var secret = "";

function AuthCron() {
    this.TimeUnits = {
        "sec": 'seconds',
        "min": 'minutes',
        "hrs": "hours",
        "day": "days",
        "wek": "weeks",
        "mon": "months",
        "yrs": "years"
    };
    this.agenda = new Agenda({
        db: {
            address: dbase,
            collection: 'cronjobs',
            options: {server: {auto_reconnect: true}}
        }
    });
}

AuthCron.prototype.runCron = function (name, time, units) {
    var self = this;
    var runtime = time + units;
    this.agenda.on('ready', function () {
        self.agenda.every(runtime, name);
        self.agenda.start();
    })
};

AuthCron.prototype.createSecret = function (size) {
    return new Promise(function (resolve, reject) {
        crypto.randomBytes(size, function (error, buffer) {
            if (!error) {
                secret = buffer.toString('hex');
                resolve(secret);
            }
            else
                reject(error);
        });
    });
};

AuthCron.prototype.createJob = function (name) {
    const cron = this;
    this.agenda.define(name, function (job, done) {
        cron.createSecret(40)
            .then(function () {
                done();
            })
    });
};

exports.run = function () {
    var Cron = new AuthCron();

    var stopGracefully = function () {
        Cron.agenda.stop(function () {
            Logger.warn("graceful nodemonstop");
            process.exit(0);
        })
    };

    var createSec = 'generate secret';
    process.on('SIGTERM', stopGracefully);
    process.on('SIGINT', stopGracefully);
    
    Cron.createJob(createSec, function (job, done) {
        crypto.randomBytes(30, function (error, buffer) {
            secret = buffer.toString('hex');
            done();
        });
    });
    Cron.runCron(30, Cron.TimeUnits.min, createSec)
};   


exports.secret = function () {
    return new Promise(function (resolve) {
        resolve("rayees");
    });
    // return new Promise(function (resolve, reject) {
    //     if (!secret) {
    //         new AuthCron().createSecret(40)
    //             .then(function (secret) {
    //                 resolve(secret);
    //             })
    //             .catch(function (error) {
    //                 reject(error);
    //             });
    //     }
    //     else {
    //         return resolve(secret);
    //     }
    // });
};
