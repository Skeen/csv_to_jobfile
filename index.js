var ls = require('list-directory-contents');
var Converter = require("csvtojson").Converter;
var json2csv = require('json2csv');
var crypto = require('crypto');

// All files will be contained within this object
var files = {};
// Read all csv files in subdirectory
ls(process.argv[2], function(err, tree)
{
    if(err)
    {
        console.error(err);
        process.exit(-1);
    }

    // Fill all csv files into single object as JSON
    var next = function(file, tree, callback)
    {
        var converter = new Converter({});
        converter.fromFile(file, function(err, result)
        {
            if(err)
            {
                console.error(err);
                process.exit(-1);
            }
            files[file] = result;

            if(tree.length > 0)
                next(tree.shift(), tree, callback);
            else
                callback();
        });
    }

    var getSHA1 = function(input){
        return crypto.createHash('sha1').update(input).digest('hex');
    }

    //console.log(tree);
    next(tree.shift(), tree, function()
    {
        var master_object = {};

        for(var file_name in files)
        {
            // Find the first _ and .
            var first_underscore = file_name.indexOf('_');
            var last_dot = file_name.lastIndexOf('.');

            first_underscore = (first_underscore == -1 ? Number.POSITIVE_INFINITY : first_underscore);
            last_dot = (last_dot == -1 ? Number.POSITIVE_INFINITY : last_dot);
            var first_seperator = Math.min(first_underscore, last_dot);
            if(first_seperator == Number.POSITIVE_INFINITY)
            {
                console.error("Fatal Error: No seperator found!");
                process.exit(-1);
            }

            var ground_truth = file_name.substring(process.argv[2].length+1, first_seperator);
            console.log(ground_truth, getSHA1(ground_truth));

            var ret_time = [];
            var abs_time = [];

            var file = files[file_name];
            for(var id in file)
            {
                var object = file[id];

                ret_time.push(Math.round(object.Value * 100) / 100);
                abs_time.push(object.Time);
                //console.log(short_file_name);
                //console.log(object.Time, ":", object.Value);
            }
            console.log(ret_time.join(' '));
            console.log(abs_time.join(' '));
            //console.log(files[file_name]);
            //console.log(file);
        }
    });
});
