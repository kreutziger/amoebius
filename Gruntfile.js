var db = require('./config/db');

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

  grunt.registerTask('dbseed', 'seed the database', function() {
    grunt.task.run('adduser:admin:admin@example.com:secret:true');
    grunt.task.run('adduser:bob:bob@example.com:secret:false');
  });

  grunt.registerTask('adduser', 'add a user to the database', function(usr, 
    emailaddress, pass, adm) {
    // convert adm string to bool
    adm = (adm === "true");

    var user = new db.userModel({ name: usr, email: emailaddress, 
        salted_pass: pass, admin: adm });
    
    // save call is async, put grunt into async mode to work
    var done = this.async();

    user.save(function(err) {
      if(err) {
        console.log('Error: ' + err);
        done(false);
      } else {
        console.log('saved user: ' + user.username);
        done();
      }
    });
  });

    grunt.registerTask('dbdrop', 'drop the database', function() {
        // async mode
        var done = this.async();

        db.mongoose.connection.on('open', function() {
            db.mongoose.connection.db.dropDatabase(function(err) {
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

//    grunt.registerTask('default', 'mochaTest');
};