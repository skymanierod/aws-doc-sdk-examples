//snippet-sourceauthor: [daviddeyo]

//snippet-sourcedescription:[Description]

//snippet-service:[AWSService]

//snippet-sourcetype:[full example]

//snippet-sourcedate:[5/25/18]

// Copyright 2010-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Licensed under the Apache-2.0 License on an "AS IS" BASIS, WITHOUT WARRANTIES OF ANY KIND.   

// ABOUT THIS NODE.JS SAMPLE: This sample is part of the SDK for JavaScript Developer Guide topic at
// https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/ec2-example-security-groups.html
// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Load credentials and set region from JSON file
AWS.config.loadFromPath('./config.json');

// Create EC2 service object
var ec2 = new AWS.EC2({apiVersion: '2016-11-15'});

// Variable to hold a ID of a VPC
var vpc = null;

// Retrieve the ID of a VPC
ec2.describeVpcs(function(err, data) {
   if (err) {
     console.log("Cannot retrieve a VPC", err);
   } else {
     vpc = data.Vpcs[0].VpcId;
     var paramsSecurityGroup = {
        Description: 'Node.js SDK Example',
        GroupName: 'sdk-example',
        VpcId: vpc
     };
     // Create the instance
     ec2.createSecurityGroup(paramsSecurityGroup, function(err, data) {
        if (err) {
           console.log("Error", err);
        } else {
           var SecurityGroupId = data.GroupId;
           console.log("Success", SecurityGroupId);
           var paramsIngress = {
             GroupName: 'sdk-example',
             IpPermissions:[
                {
                   IpProtocol: "tcp",
                   FromPort: 80,
                   ToPort: 80,
                   IpRanges: [{"CidrIp":"0.0.0.0/0"}]
               },
               {
                   IpProtocol: "tcp",
                   FromPort: 22,
                   ToPort: 22,
                   IpRanges: [{"CidrIp":"0.0.0.0/0"}]
               }
             ]
           };
           ec2.authorizeSecurityGroupIngress(paramsIngress, function(err, data) {
             if (err) {
               console.log("Error", err);
             } else {
               console.log("Ingress Successfully Set", data);
             }
          });
        }
     });

   }
});
