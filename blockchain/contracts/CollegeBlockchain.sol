// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CollegeBlockchain {
    struct Student {
        string name;
        mapping(uint => uint) grades; 
        mapping(uint => string) subjName; 
        uint currentSemester; 
        uint currentSubjectIndex;
    }

    uint public totalStudents;
    uint public constant MAX_GRADES_PER_SEMESTER = 5;

    mapping(uint => Student) public students;

    event CreditsIssued(
        uint studentId,
        uint semester,
        string subject,
        uint grade
    );
    event StudentCreated(uint studentId, string name);

    function createStudent(string memory _name) public returns (uint) {
        totalStudents++;
        students[totalStudents].name = _name;
        students[totalStudents].currentSemester = 1;
        students[totalStudents].currentSubjectIndex = 0;
        emit StudentCreated(totalStudents, _name);
        return totalStudents;
    }

    function issueCredits(
        uint _studentId,
        string memory _subject,
        uint _grade
    ) public {
        require(
            students[_studentId].currentSemester < 8,
            "All semesters are completed"
        );

        uint currentSemester = students[_studentId].currentSemester;
        uint currentSubjectIndex = students[_studentId].currentSubjectIndex;

        students[_studentId].grades[currentSubjectIndex] = _grade;
        students[_studentId].subjName[currentSubjectIndex] = _subject;

        emit CreditsIssued(_studentId, currentSemester, _subject, _grade);

        currentSubjectIndex++;

        if (currentSubjectIndex % MAX_GRADES_PER_SEMESTER == 0) {
            currentSemester++;
            students[_studentId].currentSemester = currentSemester;
        }

        students[_studentId].currentSubjectIndex = currentSubjectIndex;
    }

    function getStudentDetails(
        uint _studentId
    ) public view returns (string memory, uint, uint) {
        return (
            students[_studentId].name,
            students[_studentId].currentSemester,
            students[_studentId].currentSubjectIndex
        );
    }

    function getGrades(
        uint _studentId
    ) public view returns (uint[] memory, string[] memory) {
        Student storage student = students[_studentId];

        uint[] memory grades = new uint[](student.currentSubjectIndex);
        string[] memory subjects = new string[](student.currentSubjectIndex);

        for (uint i = 0; i < student.currentSubjectIndex; i++) {
            uint grade = student.grades[i];
            string memory subject = student.subjName[i];
            grades[i] = grade;
            subjects[i] = subject;
        }

        return (grades, subjects);
    }

    function getCurrentSemester(uint _studentId) public view returns (uint) {
        return students[_studentId].currentSemester;
    }

    function getTotalStudents() public view returns (uint) {
        return totalStudents;
    }
}
