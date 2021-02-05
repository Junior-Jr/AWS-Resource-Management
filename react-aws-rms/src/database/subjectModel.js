const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const subjectSchema = new Schema({
  subject: String,
  lecturer: String,
  section: String
},
{   timestamps: true, 
    versionKey: false
}
);

const subjectModel = mongoose.model('subject', subjectSchema);

module.exports = subjectModel