const express = require("express");
const router = express.Router();
const { Mentor, Student } = require("../models/models");

// Create Mentor
router.post("/mentors", async (req, res) => {
  try {
    const mentor = new Mentor({ name: req.body.name });
    await mentor.save();
    res.status(201).json(mentor);
  } catch (err) {
    res.status(400).json({ error: "Failed to create mentor" });
  }
});

// Create Student
router.post("/students", async (req, res) => {
  try {
    const student = new Student({ name: req.body.name });
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ error: "Failed to create student" });
  }
});

// Assign Multiple Students to a Mentor
router.post("/mentors/:mentorId/students", async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.mentorId);
    if (!mentor) return res.status(404).json({ error: "Mentor not found" });

    const studentIds = req.body.studentIds;
    for (const studentId of studentIds) {
      const student = await Student.findById(studentId);
      if (student) {
        student.mentor = mentor._id;
        await student.save();
        mentor.students.push(student._id);
      }
    }
    await mentor.save();
    res.json(mentor);
  } catch (err) {
    res.status(400).json({ error: "Failed to assign students to mentor" });
  }
});

//Change Mentor for a Student
router.put("/students/:studentId/mentor", async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);
    if (!student) return res.status(404).json({ error: "Student not found" });

    const newMentorId = req.body.mentorId;
    student.mentor = newMentorId;
    await student.save();

    res.json(student);
  } catch (err) {
    res.status(400).json({ error: "Failed to assign mentor to student" });
  }
});

// Show All Students for a Particular Mentor
router.get("/mentors/:mentorId/students", async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.mentorId).populate(
      "students"
    );
    if (!mentor) return res.status(404).json({ error: "Mentor not found" });

    res.json(mentor.students);
  } catch (err) {
    res.status(400).json({ error: "Failed to retrieve students for mentor" });
  }
});

// Show Previously Assigned Mentor for a Particular Student
router.get("/students/:studentId/mentor", async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId).populate(
      "mentor"
    );
    if (!student) return res.status(404).json({ error: "Student not found" });

    res.json(student.mentor);
  } catch (err) {
    res.status(400).json({ error: "Failed to retrieve mentor for student" });
  }
});

module.exports = router;
