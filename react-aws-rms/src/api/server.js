const express = require('express')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')
const Subject = require('../database/subjectModel.js')
const Project = require('../database/projectModel.js')
const REGION = "ap-southeast-1";
const { fromIni } = require("@aws-sdk/credential-provider-ini");
const { EC2Client, DescribeInstancesCommand, StopInstancesCommand, DescribeSecurityGroupsCommand, DescribeVpcsCommand, TerminateInstancesCommand } = require('@aws-sdk/client-ec2')
const { S3Client, ListBucketsCommand, GetBucketTaggingCommand } = require("@aws-sdk/client-s3");
const { DescribeDBInstancesCommand, RDSClient } = require('@aws-sdk/client-rds')
const { CostExplorer, GetCostAndUsageCommand, GetDimensionValuesCommand } = require('@aws-sdk/client-cost-explorer')

mongoose.connect('mongodb+srv://admin:AWSadmin@cluster0.xasek.mongodb.net/aws-rms?retryWrites=true&w=majority', {
    useNewUrlParser: true
})

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Ahoy!' });
})

//Class

app.get('/api/subject', async (req, res) => {
    const subjects = await Subject.find({})
    res.json(subjects)
})

app.get('/api/subject/:id', async (req, res) => {
    const { id } = req.params
    const result = await subjects.find(subjects => subjects.id === id)
    res.json(result)
})

app.post('/api/subject', async (req, res) => {
    const payload = req.body
    const subject = new Subject(payload)
    await subject.save()
    res.status(201).end()
})

app.post('/api/subject/delete', async (req, res) => {
    const id = req.body.id
    await Subject.findByIdAndDelete(id)
    res.status(204).end()
    console.log('deleted' + id)
})

// Project

app.get('/api/project', async (req, res) => {
    const projects = await Project.find({})
    res.json(projects)
})

app.post('/api/project', async (req, res) => {
    const payload = req.body;
    const project = new Project(payload)
    await project.save()
    res.status(201).end()
})

app.post('/api/project/delete', async (req, res) => {
    const id = req.body.id
    await Project.findByIdAndDelete(id)
    res.status(204).end()
    console.log('deleted Project ' + id)
})

// EC2

app.get('/api/ec2/describe', async (req, res) => {
    const ec2client = new EC2Client({ region: REGION })

    try {
        const data = await ec2client.send(new DescribeInstancesCommand({}))
        res.json(data)
    } catch (error) {
        console.log('Error', error)
    }
})

app.get('/api/ec2/filter/by-tag-value/:subject', async (req, res) => {
    const { subject } = req.params
    let ec2client = new EC2Client({ region: 'us-east-1', credentials: fromIni({ profile: 'en-course' }) })
    // let ec2client = new EC2Client({ region: 'us-east-1', credentials: fromIni({ profile: 'prj_costexp' }) })

    try {
        let data = await ec2client.send(new DescribeInstancesCommand({}))
        let ec2 = data.Reservations.map((ec2) => ec2.Instances).map((el) => el)
        let new_array = ec2.map(element => element[0])
        let filter = new_array.filter(element => element.Tags.some(tag => tag.Value === subject))
        res.json(filter)

    } catch (error) {
        console.log('Error', error)
    }
})

app.post('/api/ec2/stop-all', async (req, res) => {
    const ec2client = new EC2Client({ region: REGION });
    const payload = req.body

    try {
        const data = await ec2client.send(new StopInstancesCommand({ InstanceIds: payload.instanceIds }));
        console.log("Success", data.StoppingInstances);
    } catch (err) {
        console.log("Error", err);
    }
})

app.post('/api/ec2/terminate-all', async (req, res) => {
    const ec2client = new EC2Client({ region: REGION });
    const payload = req.body

    try {
        const data = await ec2client.send(new TerminateInstancesCommand({ InstanceIds: payload.instanceIds }));
        console.log("Success", data.TerminatingInstances);
    } catch (err) {
        console.log("Error", err);
    }
})

// security group

app.get('/api/security-group/describe', async (req, res) => {
    const ec2client = new EC2Client({ region: REGION })

    try {
        const data = await ec2client.send(new DescribeSecurityGroupsCommand({}))
        res.json(data)
    } catch (error) {
        console.log('Error', error)
    }
})

// S3

app.get('/api/s3/list-buckets', async (req, res) => {
    const s3 = new S3Client({ region: REGION });
    let arr = []
    let bucket = ['']
    let tagObj

    let bucketLists = await s3.send(new ListBucketsCommand({}))
    buckets = bucketLists.Buckets
    let bucketWithTag = buckets.map(async bucket => {
        try {

            let tag = await s3.send(new GetBucketTaggingCommand({ Bucket: bucket.Name }))
            tagObj = tag.TagSet
            console.log('success ' + bucket.Name)

            arr.push({ Bucket: bucket.Name, Tags: tagObj })


        } catch (error) {
            console.log('Error ' + bucket.Name);
            tagObj = []

            arr.push({ Bucket: bucket.Name, Tags: tagObj })

        }
    })
    await Promise.all(bucketWithTag)
    console.log('test')
    res.json(arr)
})

app.get('/api/s3/filter/by-tag-value/:tagVal', async (req, res) => {
    const { tagVal } = req.params
    const s3 = new S3Client({ region: 'us-east-1', credentials: fromIni({ profile: 'en-course' }) })
    let arr = []
    let bucket = ['']
    let tagObj

    let bucketLists = await s3.send(new ListBucketsCommand({}))
    buckets = bucketLists.Buckets
    let bucketWithTag = buckets.map(async bucket => {
        try {

            let tag = await s3.send(new GetBucketTaggingCommand({ Bucket: bucket.Name }))
            tagObj = tag.TagSet
            console.log('success ' + bucket.Name)

            arr.push({ Bucket: bucket.Name, Tags: tagObj })


        } catch (error) {
            console.log('Error ' + bucket.Name);
            tagObj = []

            arr.push({ Bucket: bucket.Name, Tags: tagObj })

        }
    })
    await Promise.all(bucketWithTag)

    try {
        let filter = arr.filter(element => element.Tags.some(tag => tag.Value === tagVal))
        res.json(filter)

    } catch (error) {
        console.log('Error', error)
    }

})

// RDS

app.get('/api/rds/filter/by-tag-value/:subject', async (req, res) => {
    const { subject } = req.params
    const rds = new RDSClient({ region: 'us-east-1', credentials: fromIni({ profile: 'en-course' }) })

    try {
        let data = await rds.send(new DescribeDBInstancesCommand({}))
        let dbInstances = data.DBInstances.map((el) => el)
        let filter = dbInstances.filter(element => element.TagList.some(tag => tag.Value === subject))
        res.json(filter)
    } catch (error) {
        console.log('error', error)
    }
})

// Cost Explorer

app.get('/api/dimension', async (req, res) => {
    const costExp = new CostExplorer({ region: 'us-east-1', credentials: fromIni({ profile: 'default' }) })
    const response = await costExp.send(new GetDimensionValuesCommand({
        Context: 'COST_AND_USAGE',
        Dimension: 'RECORD_TYPE',
        // Filter: {
        //     Dimensions: {
        //         Key: 'REGION',
        //         Values: ['us-east-1']
        //     }
        // },
        TimePeriod: {
            End: '2021-05-20',
            Start: '2021-04-01'
        }
    }))
    res.json(response)
})

app.post('/api/cost', async (req, res) => {
    const costExp = new CostExplorer({ region: 'us-east-1', credentials: fromIni({ profile: 'prj_costexp' }) })
    const payload = req.body
    let arr = []
    let costarr = ['']
    let service = payload.service
    let granularity = payload.granularity
    let start_date = payload.start_date
    let end_date = payload.end_date
    let aws_tag_value = payload.aws_tag_value

    try {
        let data = await costExp.send(new GetCostAndUsageCommand({
            Filter: {
                And: [
                    {
                        Dimensions: {
                            Key: 'SERVICE',
                            Values: [service]
                        }
                    },
                    {
                        Dimensions: {
                            Key: 'RECORD_TYPE',
                            Values: ['Usage'],

                        }
                    }
                ],
            },
            Metrics: ['UnblendedCost'],
            Granularity: granularity,
            TimePeriod: {
                Start: start_date,
                End: end_date
            },
            GroupBy: [
                // {
                //     Type: "DIMENSION",
                //     Key: "SERVICE"
                // }
                {
                    Type: 'TAG',
                    Key: `Owner$${aws_tag_value}`
                }
            ]
        }))
        data.ResultsByTime.map(data => {
            let amount = parseFloat(data.Groups[0].Metrics.UnblendedCost.Amount).toFixed(2)
            let start = data.TimePeriod.Start
            let end = data.TimePeriod.End
            arr.push({ Amount: amount, Start: start, End: end })
        })
        res.json(arr)
    } catch (error) {
        console.log(error)
    }


})

// VPC
app.post('/api/ec2/vpc', async (req, res) => {
    const vpc = new EC2Client({ region: 'us-east-1', credentials: fromIni({ profile: 'prj_costexp' }) })
    const payload = req.body
    console.log('payload', payload)
    try {
        let data = await vpc.send(new DescribeVpcsCommand({
            Filters: [
                {
                    Name: 'tag-key',
                    Values: ['Name']
                }
            ],
            VpcIds: payload.VpcIds
        }))
        res.json(data)
    } catch (error) {
        console.log('vpc ', error)
    }
})

app.listen(9000, () => {
    console.log('Application is running on port 9000')
})