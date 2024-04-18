// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CollegeBlockchain {
    struct Student {
        uint studentId;
        string name;
        mapping(uint => mapping(string => uint)) grades; // Map semester to subject grades
    }

    mapping(uint => Student) public students;
    uint public totalStudents;

    // event StudentRegistered(uint indexed studentId, string name);
    event GradesUpdated(
        address indexed student,
        uint indexed semester,
        string subject,
        uint grade
    );

    // function registerStudent(string memory _name) public {
    //     totalStudents++;
    //     students[msg.sender].studentId = totalStudents;
    //     students[msg.sender].name = _name;
    //     emit StudentRegistered(totalStudents, _name);
    // }

    function updateGrades(
        uint _uid,
        uint _semester,
        string memory _subject,
        uint _grade
    ) public {
        require(_semester > 0, "Invalid semester");

        students[_uid].grades[_semester][_subject] = _grade;
        emit GradesUpdated(msg.sender, _semester, _subject, _grade);
    }

    // Function to return grades of a student by their unique identifier (_uid)
    // function getGradesByUid(
    //     uint _uid
    // ) public view returns (mapping(string => uint8) memory) {
    //     require(_uid > 0 && _uid <= totalStudents, "Invalid student ID");
    //     return students[_uid].grades;
    // }
}
