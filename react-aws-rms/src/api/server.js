const express = require('express')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')
const Subject = require('../database/subjectModel.js')
const Exam = require('../database/examModel.js')
const { EC2Client, DescribeInstancesCommand, StopInstancesCommand } = require('@aws-sdk/client-ec2')

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
    console.log(id)
})

// Exam

app.get('/api/exam', async (req, res) => {
    const exams = await Exam.find({})
    res.json(exams)
})

app.post('/api/exam', async (req, res) => {
    const payload = req.body;
    const subject = new Exam(payload)
    await subject.save()
    res.status(201).end()
})

app.post('/api/exam/delete', async (req, res) => {
    const id = req.body.id
    await Exam.findByIdAndDelete(id)
    res.status(204).end()
    console.log(id)
})

app.post('/api/exam/delete', async (req, res) => {
    const id = req.body.id
    await Exam.findByIdAndDelete(id)
    res.status(204).end()
    console.log(id)
})

// EC2

app.get('/api/ec2/describe', async (req, res) => {
    const ec2client = new EC2Client({ region: 'ap-southeast-1' })

    try {
        const data = await ec2client.send(new DescribeInstancesCommand({}))
        res.json(data)
    } catch (error) {
        console.log('Error', error)
    }
})

app.get('/api/ec2/filter/by-tag-value/:subject', async (req, res) => {
    const { subject } = req.params
    let ec2client = new EC2Client({ region: 'ap-southeast-1' })

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

app.get('/api/ec2/stop-all', async (req, res) => {
    const ec2client = new EC2Client({ region: 'ap-southeast-1' });
    const params = { InstanceIds: "i-04c4835f124e88ce0" };

    try {
        const data = await ec2client.send(new StopInstancesCommand(params));
        console.log("Success", data.StoppingInstances);
    } catch (err) {
        console.log("Error", err);
    }
})

app.listen(9000, () => {
    console.log('Application is running on port 9000')
})