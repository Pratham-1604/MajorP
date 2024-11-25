const mongoose = require("mongoose");

const SubjectDetailSchema = new mongoose.Schema({
  subjectCode: { type: String, required: true },
  subjectName: { type: String, required: true },
  credits: { type: Number, required: true },
  grade: { type: Number, default: null },
  semester: { type: Number, required: true },
});

const StudentSchema = new mongoose.Schema(
  {
    // General Details
    generalDetails: {
      firstName: {
        type: String,
        trim: true,
      },
      lastName: {
        type: String,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },
      dateOfBirth: {
        type: Date,
      },
      contactNumber: {
        type: String,
      },
    },

    // Unique Identifier
    uid: {
      type: String,
      unique: true,
    },

    // Academic Details
    academicDetails: {
      batch: {
        startYear: {
          type: Number,
          required: true,
        },
        endYear: {
          type: Number,
          required: true,
        },
      },
      currentSemester: {
        type: Number,
        default: 1,
        min: 1,
        max: 8,
      },
      courseEnrolled: {
        type: String,
        enum: ["CSE", "EXTC", "MCA"],
        // required: true,
      },
      eligibleCourses: [
        {
          type: String,
          required: true,
          enum: ["CSE", "EXTC", "MCA"],
        },
      ],
      cgpa: {
        type: Number,
        default: 0,
        min: 0,
        max: 10,
      },
      totalCreditsEarned: {
        type: Number,
        default: 0,
      },
    },

    // Subject Details
    subjectDetails: [SubjectDetailSchema],
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware for UID generation
// In Student Schema
StudentSchema.pre("save", async function (next) {
  if (!this.uid) {
    try {
      // Find the last student and get the last UID
      const lastStudent = await this.constructor
        .findOne({}, { uid: 1 })
        .sort({ _id: -1 })
        .limit(1);

      // Generate new UID
      let newUid = "000001"; // Default first student

      if (lastStudent && lastStudent.uid) {
        // Increment the last UID
        const lastUidNumber = parseInt(lastStudent.uid);
        newUid = (lastUidNumber + 1).toString().padStart(6, "0");
      }

      this.uid = newUid;
    } catch (error) {
      console.error("UID generation error:", error);
      return next(error);
    }
  }
  next();
});

// Method to calculate CGPA
StudentSchema.methods.calculateCGPA = function () {
  const subjects = this.subjectDetails || [];

  if (subjects.length === 0) return 0;

  const totalCredits = subjects.reduce(
    (sum, subject) => sum + (subject.credits || 0),
    0
  );

  const totalGradePoints = subjects.reduce(
    (sum, subject) => sum + (subject.grade || 0) * (subject.credits || 0),
    0
  );

  return totalCredits > 0
    ? Number((totalGradePoints / totalCredits).toFixed(2))
    : 0;
};
// Add a method for login verification
StudentSchema.methods.verifyUid = function (inputUid) {
  return this.uid === inputUid;
};

module.exports = mongoose.model("Student", StudentSchema);
