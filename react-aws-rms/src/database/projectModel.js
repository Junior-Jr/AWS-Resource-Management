const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const projectSchema = new Schema({
    group_name: String,
    group_type: String,
    advisor: String,
    aws_tag_value: String
},
    {
        timestamps: true,
        versionKey: false
    }
);

const projectModel = mongoose.model('project', projectSchema);

module.exports = projectModel