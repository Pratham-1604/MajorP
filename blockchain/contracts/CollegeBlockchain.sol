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

    event StudentRegistered(uint indexed studentId, string name);
    event GradesUpdated(
        uint indexed studentId,
        uint indexed semester,
        string subject,
        uint grade
    );

    function registerStudent(uint _studentId, string memory _name) public {
        require(students[_studentId].studentId == 0, "Student ID already exists");
        students[_studentId].studentId = _studentId;
        students[_studentId].name = _name;
        totalStudents++;
        emit StudentRegistered(_studentId, _name);
    }

    function updateGrades(
        uint _studentId,
        uint _semester,
        string memory _subject,
        uint _grade
    ) public {
        require(_semester > 0, "Invalid semester");

        students[_studentId].grades[_semester][_subject] = _grade;
        emit GradesUpdated(_studentId, _semester, _subject, _grade);
    }

    function getGrade(
        uint _studentId,
        uint _semester,
        string memory _subject
    ) public view returns (uint) {
        return students[_studentId].grades[_semester][_subject];
    }

    function getStudentInfo(uint _studentId) public view returns (uint, string memory) {
        require(_studentId > 0 && _studentId <= totalStudents, "Invalid student ID");
        return (students[_studentId].studentId, students[_studentId].name);
    }

    function getTotalStudents() public view returns (uint) {
        return totalStudents;
    }
}