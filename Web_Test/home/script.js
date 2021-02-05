 function createEC2(){
    var AWS = require("aws-sdk");

    AWS.config.update({region: 'ap-southeast-1'});
    AWS.config.getCredentials(function(err) {
        if (err) console.log(err.stack);
        // credentials not loaded
        else {
        console.log("Access key:", AWS.config.credentials.accessKeyId);
        }
    });

    console.log("Region: ", AWS.config.region);

    // Create EC2 service object
    var ec2 = new AWS.EC2({apiVersion: '2016-11-15'});

    // AMI is amzn-ami-2011.09.1.x86_64-ebs
    var instanceParams = {
        ImageId: 'ami-0cd31be676780afa7', 
        InstanceType: 't2.micro',
        KeyName: 'ec2-keypair',
        MinCount: 1,
        MaxCount: 1,
        TagSpecifications: [
                {
                    ResourceType:'instance',
                    Tags: [
                        {
                            Key: 'StudentID',
                            Value: '60070059'
                        }
                    ]
                }
            ]
        };

    // Create a promise on an EC2 service object
    var instancePromise = new AWS.EC2({apiVersion: '2016-11-15'}).runInstances(instanceParams).promise();
}