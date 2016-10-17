var ls = require('list-directory-contents');
var Converter = require("csvtojson").Converter;
var json2csv = require('json2csv');
var crypto = require('crypto');

// All files will be contained within this object
var files = {};
// Read all csv files in subdirectory
ls('data/', function(err, tree)
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
            var ground_truth = file_name.substring(5, file_name.indexOf('_'));
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
