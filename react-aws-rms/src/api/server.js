const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const Subject = require('../database/subjectModel.js');

mongoose.connect('mongodb+srv://admin:AWSadmin@cluster0.xasek.mongodb.net/aws-rms?retryWrites=true&w=majority', {
    useNewUrlParser: true
});

app.use(cors());
app.use(express.json());

// const subjects = {
    
//         'subjects': [{
//             'id': '0001',
//             'subject': 'Introduction to Cloud Technology',
//             'lecturer': 'Lapas Pradittassanee'
//         },
//         {
//             'id': '0002',
//             'subject': 'Marketing 101',
//             'lecturer': 'The Disruptor'
//         },
//         {
//             'id': '0002',
//             'subject': 'Marketing 101',
//             'lecturer': 'The Disruptor'
//         },
//         {
//             'id': '0002',
//             'subject': 'Marketing 101',
//             'lecturer': 'The Disruptor'
//         },]
    
//     }  


app.get('/', (req, res) => {
    res.json({ message: 'Ahoy!' });
})

app.get('/api/subject', async (req, res) => {
    const subjects = await Subject.find({})
    res.json(subjects);
})

app.get('/api/subject/:id', (req, res) => {
    const { id } = req.params;
    const result = subjects.find(subjects => subjects.id === id);
    res.json(result);
})

app.post('/api/subject', async (req, res) => {
    const payload = req.body;
    const subject = new Subject(payload)
    await subject.save()
    res.status(201).end()
})

app.listen(9000, () => {
    console.log('Application is running on port 9000')
})