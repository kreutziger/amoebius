var connect = require('./config/db');
var db = require('./config/user');
var mongoose = require('mongoose');

module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        mochaTest: {
            test: {
                options: {
                    //reporter: 'nyan'
                    reporter: 'spec'
                },
            src: ['test/**/*.js']
            }
        }
    });

  grunt.registerTask('resetapp', 'reset db and upload folder and create ' + 
                     'new users', function() {
    grunt.task.run('dbdrop');
    grunt.task.run('rmupload');
    grunt.task.run('dbseed');
  });

  grunt.registerTask('dbseed', 'seed the database', function() {
    grunt.task.run('adduser:admin:admin@example.com:secret:true');
    grunt.task.run('adduser:bob:bob@example.com:secret:false');
    grunt.task.run('adduser:bob2:bob2@example.com:secret:false');
  });

  grunt.registerTask('adduser', 'add a user to the database', function(usr, 
    emailaddress, pass, adm) {
    // convert adm string to bool
    adm = (adm === "true");

    var user = new db({ name: usr, email: emailaddress, 
        salted_pass: pass, admin: adm });
    
    // save call is async, put grunt into async mode to work
    var done = this.async();

    user.save(function(err) {
      if(err) {
        console.log('Error: ' + err);
        done(false);
      } else {
        console.log('saved user: ' + user.name);
        done();
      }
    });
  });

    grunt.registerTask('dbdrop', 'drop the database', function() {
        // async mode
        var done = this.async();

        mongoose.connection.on('open', function() {
            mongoose.connection.db.dropDatabase(function(err) {
                if (err) {
                    console.log('Error: ' + err);
                    done(false);
                } else {
                    console.log('Successfully dropped db');
                    done();
                }
            });
        });
    });

    grunt.registerTask('rmupload', 'remove uploads', function() {
        var done = this.async();
        var exec = require('child_process').exec,
        child;
        child = exec('rm -rf uploads/*', function(err, stdout, stderr) {
            console.log('stdout: ', stdout);
            console.log('sdterr: ', stderr);
            if (err !== null) {
                console.log('err: ', err);
                done(false);
            }               
            done();
        });
    });
//    grunt.registerTask('default', 'mochaTest');
};
