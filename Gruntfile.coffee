module.exports = (grunt) ->

  grunt.initConfig
    pkg: grunt.file.readJSON "package.json"
    coffee:
      compileWithMaps:
        expand: true
        cwd: "src"
        src: ["**/*.coffee"]
        dest: "src"
        rename: (dest, src) -> dest + "/" + (src.replace /\.coffee$/, ".js")
        options:
          sourceMap: true
    watch:
      scripts:
        files: ["src/*.coffee"]
        tasks: ["coffee"]
        options:
          spawn: false

  grunt.loadNpmTasks("grunt-contrib-coffee");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.registerTask("default", ["coffee"]);
