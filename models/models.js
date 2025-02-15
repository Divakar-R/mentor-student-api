const mongoose = require("mongoose");

// Mentor Schema
const mentorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
});

// Student Schema
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor" },
});

const Mentor = mongoose.model("Mentor", mentorSchema);
const Student = mongoose.model("Student", studentSchema);

module.exports = { Mentor, Student };
