// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PublicBlockchain {
    struct Course {
        uint courseUid;
        string name;
        uint credits;
        uint collegeUid;
        bool available;
    }

    struct Student {
        string name;
        uint[] courseUids;
        mapping(uint => uint) grades;
    }

    struct College {
        uint collegeUid;
        string name;
        uint[] coursesOffered;
    }

    mapping(uint => Course) public courses;
    uint public totalCourses;
    mapping(uint => mapping(uint => bool)) public enrolledStudents;

    mapping(uint => Student) public students;
    uint public totalStudents;

    mapping(uint => College) public colleges;
    uint public totalColleges;

    event CourseAdded(
        uint indexed courseUid,
        string name,
        uint credits,
        uint indexed collegeUid
    );
    event StudentEnrolled(
        uint indexed studentId,
        uint indexed courseUid,
        string name
    );
    event CreditsIssued(uint studentId, string courseName, uint grades);
    event CollegeCreated(uint indexed collegeUid, string name);
    event StudentCreated(uint studentId, string name);

    function addCourse(
        uint _collegeUid,
        string memory _name,
        uint _credits
    ) public returns (uint) {
        totalCourses++;
        Course storage newCourse = courses[totalCourses];
        newCourse.courseUid = totalCourses;
        newCourse.name = _name;
        newCourse.credits = _credits;
        newCourse.collegeUid = _collegeUid;
        newCourse.available = true;
        colleges[_collegeUid].coursesOffered.push(totalCourses);
        emit CourseAdded(totalCourses, _name, _credits, _collegeUid);
        return totalCourses;
    }

    function createStudent(string memory _name) public returns (uint) {
        totalStudents++;
        students[totalStudents].name = _name;
        emit StudentCreated(totalStudents, _name);
        return totalStudents;
    }

    function enrollStudent(uint _studentId, uint _courseUid) public {
        require(courses[_courseUid].available, "Course is not available");
        require(
            !enrolledStudents[_courseUid][_studentId],
            "Student is already enrolled"
        );
        students[_studentId].courseUids.push(_courseUid);
        enrolledStudents[_courseUid][_studentId] = true;
        emit StudentEnrolled(_studentId, _courseUid, students[_studentId].name);
    }

    function issueCredits(
        uint _studentId,
        string memory _courseName,
        uint _grades
    ) public {
        uint courseUid = 0;
        for (uint i = 0; i < students[_studentId].courseUids.length; i++) {
            if (
                keccak256(
                    abi.encodePacked(
                        courses[students[_studentId].courseUids[i]].name
                    )
                ) == keccak256(abi.encodePacked(_courseName))
            ) {
                courseUid = students[_studentId].courseUids[i];
                break;
            }
        }
        require(courseUid != 0, "Course not found");
        students[_studentId].grades[courseUid] = _grades;
        emit CreditsIssued(_studentId, _courseName, _grades);
    }

    function getCourseDetails(
        uint _courseUid
    ) public view returns (string memory, uint, uint) {
        Course storage course = courses[_courseUid];
        return (course.name, course.credits, course.collegeUid);
    }

    function getNumberOfStudentsEnrolled(
        uint _courseUid
    ) public view returns (uint) {
        uint count = 0;
        for (uint i = 1; i <= totalStudents; i++) {
            if (enrolledStudents[_courseUid][i]) {
                count++;
            }
        }
        return count;
    }

    function getStudentDetails(
        uint _studentId
    ) public view returns (string memory, uint[] memory) {
        return (students[_studentId].name, students[_studentId].courseUids);
    }

    function getNumberOfCoursesByInstitute(
        uint _collegeUid
    ) public view returns (uint) {
        return colleges[_collegeUid].coursesOffered.length;
    }

    function getInstituteDetails(
        uint _collegeUid
    ) public view returns (string memory, uint[] memory) {
        return (
            colleges[_collegeUid].name,
            colleges[_collegeUid].coursesOffered
        );
    }

    function getStudentGrades(
        uint _studentId
    ) public view returns (string[] memory, uint[] memory) {
        uint[] memory courseUids = students[_studentId].courseUids;
        string[] memory courseNames = new string[](courseUids.length);
        uint[] memory gradesList = new uint[](courseUids.length);

        for (uint i = 0; i < courseUids.length; i++) {
            uint courseUid = courseUids[i];
            courseNames[i] = courses[courseUid].name;
            gradesList[i] = students[_studentId].grades[courseUid];
        }

        return (courseNames, gradesList);
    }

    function getAllStudentDetails()
        public
        view
        returns (string[] memory, uint[][] memory)
    {
        string[] memory names = new string[](totalStudents);
        uint[][] memory courseUids = new uint[][](totalStudents);
        for (uint i = 1; i <= totalStudents; i++) {
            names[i - 1] = students[i].name;
            courseUids[i - 1] = students[i].courseUids;
        }
        return (names, courseUids);
    }

    function addCollege(string memory _name) public returns (uint) {
        totalColleges++;
        colleges[totalColleges] = College(totalColleges, _name, new uint[](0));
        emit CollegeCreated(totalColleges, _name);
        return totalColleges;
    }

    // Function to get details of a college
    function getCollegeDetails(
        uint _collegeUid
    ) public view returns (string memory, uint[] memory) {
        return (
            colleges[_collegeUid].name,
            colleges[_collegeUid].coursesOffered
        );
    }

    // Function to get number of courses offered by a college
    function getNumberOfCoursesByCollege(
        uint _collegeUid
    ) public view returns (uint) {
        return colleges[_collegeUid].coursesOffered.length;
    }

    function getNumberOfColleges() public view returns (uint) {
        return totalColleges;
    }

    function getTotalStudents() public view returns (uint) {
        return totalStudents;
    }
}
