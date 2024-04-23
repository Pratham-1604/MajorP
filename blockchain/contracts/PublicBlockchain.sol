// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./CollegeBlockchain.sol";

contract PublicBlockchain {
    struct Course {
        uint courseId;
        string name;
        uint credits;
        uint collegeUid;
        bool available;
    }

    mapping(uint => Course) public courses;
    uint public totalCourses;
    mapping(uint => bool) public authorizedColleges;
    mapping(uint => mapping(uint => bool)) public enrolledStudents;

    event CourseAdded(
        uint indexed courseId,
        string name,
        uint credits,
        uint indexed collegeUid
    );
    event StudentEnrolled(uint indexed studentUid, uint indexed courseId);
    event CreditsIssued(
        uint studentUid,
        uint semester,
        string courseName,
        uint grades
    );

    modifier onlyCollege(uint _collegeUid) {
        require(
            authorizedColleges[_collegeUid],
            "Only authorized college can perform this action"
        );
        _;
    }

    constructor() {
        // Initialize with an empty set of authorized colleges
    }

    function addCourse(uint _collegeUid, string memory _name, uint _credits) public onlyCollege(_collegeUid) {
        totalCourses++;
        Course storage newCourse = courses[totalCourses];
        newCourse.courseId = totalCourses;
        newCourse.name = _name;
        newCourse.credits = _credits;
        newCourse.collegeUid = _collegeUid;
        newCourse.available = true;
        emit CourseAdded(totalCourses, _name, _credits, _collegeUid);
    }

    function enrollStudent(uint _studentUid, uint _courseId) public {
        require(courses[_courseId].available, "Course is not available");
        require(!enrolledStudents[_courseId][_studentUid], "Student is already enrolled");
        enrolledStudents[_courseId][_studentUid] = true;
        emit StudentEnrolled(_studentUid, _courseId);
    }

    function issueCredits(
        uint _studentUid,
        string memory _courseName,
        uint _semester,
        uint _credits
    ) public {
        emit CreditsIssued(_studentUid, _semester, _courseName, _credits);

        // Call updateGrades function in the CollegeBlockchain contract
        CollegeBlockchain collegeBlockchain = CollegeBlockchain(0x0165878A594ca255338adfa4d48449f69242Eb8F); // Assuming collegeBlockchainAddress is the address of the CollegeBlockchain contract
        collegeBlockchain.updateGrades(_studentUid, _semester, _courseName, _credits);
    }

    function authorizeCollege(uint _collegeUid) public {
        authorizedColleges[_collegeUid] = true;
    }

    function getNumberOfStudents(uint _courseId) public view returns (uint) {
        uint count = 0;
        for (uint i = 0; i < totalCourses; i++) {
            if (enrolledStudents[_courseId][i]) {
                count++;
            }
        }
        return count;
    }

    function getEnrolledStudents(uint _courseId) public view returns (uint[] memory) {
        uint[] memory studentsList = new uint[](totalCourses);
        uint count = 0;
        for (uint i = 0; i < totalCourses; i++) {
            if (enrolledStudents[_courseId][i]) {
                studentsList[count] = i;
                count++;
            }
        }
        return studentsList;
    }

    function getStudentInfo(uint _courseId, uint _studentUid) public view returns (uint, string memory) {
        require(enrolledStudents[_courseId][_studentUid], "Student is not enrolled in the course");
        CollegeBlockchain collegeBlockchain = CollegeBlockchain(0x0165878A594ca255338adfa4d48449f69242Eb8F); // Assuming collegeBlockchainAddress is the address of the CollegeBlockchain contract
        return collegeBlockchain.getStudentInfo(_studentUid);
    }
}
