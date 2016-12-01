#!/usr/bin/env node
'use strict';

var path        = require('path');
var Converter   = require("csvtojson").Converter;

var output_header = function(file_name)
{
    // Get basename
    var name = path.basename(file_name);
    // Find the first '_' and last '.'
    var first_underscore = name.indexOf('_');
    var last_dot = name.lastIndexOf('.');
    // Figure out which one comes first
    first_underscore = (first_underscore == -1 ? Number.POSITIVE_INFINITY : first_underscore);
    last_dot = (last_dot == -1 ? Number.POSITIVE_INFINITY : last_dot);
    var first_seperator = Math.min(first_underscore, last_dot);
    // If no seperator is found, throw an error
    if(first_seperator == Number.POSITIVE_INFINITY)
    {
        console.error("Fatal Error: No seperator found!");
        process.exit(-1);
    }
    // Split name to only contain up to first seperator
    var ground_truth = name.substring(0, first_seperator);
    console.log(ground_truth, file_name);
}

var ret_time = [];
var abs_time = [];

var output_csv_data = function()
{
    var converter = new Converter({constructResult:false});

    converter.on("record_parsed", function(object) {
        ret_time.push(Math.round(object.Value * 100) / 100);
        abs_time.push(object.Time);
    });

    converter.on("end_parsed", function(result) {
        console.log(ret_time.join(' '));
        console.log(abs_time.join(' '));
    });

    process.stdin.pipe(converter); 
}

output_header(process.argv[2]);
output_csv_data();
