const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const examSchema = new Schema({
    exam_name: String,
    lecturer: String,
    section: String
},
    {
        timestamps: true,
        versionKey: false
    }
);

const subjectModel = mongoose.model('exam', examSchema);

module.exports = subjectModel