// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./CollegeBlockchain.sol";

contract PublicBlockchain {
    struct Course {
        uint courseId;
        string name;
        uint credits;
        address collegeAddress;
        bool available;
    }

    mapping(uint => Course) public courses;
    uint public totalCourses;
    mapping(address => bool) public authorizedColleges;

    event CourseAdded(
        uint indexed courseId,
        string name,
        uint credits,
        address indexed collegeAddress
    );
    event StudentEnrolled(address indexed student, uint indexed courseId);
    event CreditsIssued(
        uint uid,
        uint semester,
        string courseName,
        uint grades
    );

    modifier onlyCollege() {
        require(
            authorizedColleges[msg.sender],
            "Only authorized college can perform this action"
        );
        _;
    }

    constructor() {
        // Initialize with an empty set of authorized colleges
    }

    function addCourse(string memory _name, uint _credits) public onlyCollege {
        totalCourses++;
        courses[totalCourses] = Course(
            totalCourses,
            _name,
            _credits,
            msg.sender,
            true
        );
        emit CourseAdded(totalCourses, _name, _credits, msg.sender);
    }

    function enrollStudent(uint _courseId) public {
        require(courses[_courseId].available, "Course is not available");
        emit StudentEnrolled(msg.sender, _courseId);
    }

    function issueCredits(
        uint _uid,
        string memory _courseName,
        uint _semester,
        uint _credits
    ) public {
        // require(
        //     courses[_courseId].collegeAddress == msg.sender,
        //     "Only college offering the course can issue credits"
        // );
        emit CreditsIssued(_uid, _semester, _courseName, _credits);

        // Call updateGrades function in the CollegeBlockchain contract
        CollegeBlockchain collegeBlockchain = CollegeBlockchain(0x5FbDB2315678afecb367f032d93F642f64180aa3); // Assuming collegeBlockchainAddress is the address of the CollegeBlockchain contract
        collegeBlockchain.updateGrades(_uid, _semester, _courseName, _credits);
    }

    function authorizeCollege(address _collegeAddress) public {
        authorizedColleges[_collegeAddress] = true;
    }
}
