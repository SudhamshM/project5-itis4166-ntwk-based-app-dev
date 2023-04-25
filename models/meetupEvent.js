const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const meetupSchema = new Schema(
    {
        category: {type: String, enum: ['Action', 'Romance', 'Comedy', 'Horror', 'Other'], default: 'Other', required: [true, "Category is required"]},
        title: {type: String, required: [true, "Title is required"], minLength: [2, "Title should be at least 2 characters"], maxLength: [65, "Title should not exceed 50 characters."]},
        details: {type: String, required: [true, "Details are required"], minLength: [10, "Description should be at least 10 characters"], maxLength: [100, "Description cannot exceed 100 characters."]},
        location: {type: String, required: [true, "Location is required"], minLength: [3, "Location should be at least 3 characters"], maxLength: [60, "Location name cannot exceed 60 characters"]},
        hostName: {type: Schema.Types.ObjectId, ref: 'User'},
        startTime: {type: Date, required: [true, "Start date is required"]},
        endTime: {type: Date, required: [true, "End date is required"]},
        image: {type: String, required: [true, "Image is required"]},
    },
    {timestamps: true}
)

// collection name in db is meetups
module.exports = mongoose.model('Meetup', meetupSchema);
