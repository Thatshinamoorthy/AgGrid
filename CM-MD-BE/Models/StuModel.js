const mongoose = require('mongoose');

const StudentSchema = mongoose.Schema({
  student_id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  std: {
    type: String,
    required: true,
    // enum: ['09', '10', '11', '12']
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female']
  },
  attendance_percentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  club: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model("Students",StudentSchema);