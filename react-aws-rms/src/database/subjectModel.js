const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const subjectSchema = new Schema({
  subject: String,
  lecturer: String,
  section: String,
  budget: Number,
  aws_tag_value: String
},
  {
    timestamps: true,
    versionKey: false
  }
);

const subjectModel = mongoose.model('subject', subjectSchema);

module.exports = subjectModel