import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';  // Importing QRCodeCanvas for QR generation
import './GradeCard.css';  // External CSS for styles

const GradeCard = () => {
  return (
    <div className="grade-card">
      <div className="header">
        <div className="title">
          <h2 className="institute-name">SARDAR PATEL INSTITUTE OF TECHNOLOGY</h2>
          <h3 className="institute-subtitle">Bharatiya Vidya Bhavan's</h3>
          <h4 className="semester-info">Semester Grade Card</h4>
        </div>
      </div>

      {/* Details and QR code inline */}
      <div className="details-qr-container">
        <div className="details">
          <p><strong>Name:</strong> Mundada Prathamesh Mangesh Rakh</p>
          <p><strong>Examination:</strong> April 2022 (Regular)</p>
          <p><strong>Seat Number (UID):</strong> 2021600047</p>
          <p><strong>Semester:</strong> I</p>
          <p><strong>Program:</strong> B.Tech Computer Science and Engineering (Artificial Intelligence and Machine Learning)</p>
        </div>

        {/* QR Code aligned to the right of the details */}
        <div className="qr-code-inline">
          <QRCodeCanvas value="https://example.com/verify/2021600047" size={80} />
        </div>
      </div>

      {/* Grade table */}
      <table className="grade-table">
        <thead>
          <tr>
            <th>Course Code</th>
            <th>Course Name</th>
            <th>Course Credits</th>
            <th>Grade</th>
            <th>Credits Earned</th>
            <th>Grade Points</th>
            <th>C * GP</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>MA101</td>
            <td>Engineering Calculus</td>
            <td>4</td>
            <td>AA</td>
            <td>4</td>
            <td>10</td>
            <td>40</td>
          </tr>
          <tr>
            <td>AS102</td>
            <td>Engineering Chemistry</td>
            <td>3</td>
            <td>AB</td>
            <td>3</td>
            <td>9</td>
            <td>27</td>
          </tr>
          <tr>
            <td>AS103</td>
            <td>Biology for Engineers</td>
            <td>2</td>
            <td>BC</td>
            <td>2</td>
            <td>7</td>
            <td>14</td>
          </tr>
          <tr>
            <td>AS105</td>
            <td>Engineering Mechanics</td>
            <td>3</td>
            <td>AB</td>
            <td>3</td>
            <td>9</td>
            <td>27</td>
          </tr>
          <tr>
            <td>CS101</td>
            <td>Problem Solving Using Imperative Programming</td>
            <td>4</td>
            <td>AA</td>
            <td>4</td>
            <td>10</td>
            <td>40</td>
          </tr>
          <tr>
            <td>EC101</td>
            <td>Digital Systems and Microprocessor</td>
            <td>4</td>
            <td>AA</td>
            <td>4</td>
            <td>10</td>
            <td>40</td>
          </tr>
          <tr>
            <td>AS107</td>
            <td>Communication Skills</td>
            <td>2</td>
            <td>AB</td>
            <td>2</td>
            <td>9</td>
            <td>18</td>
          </tr>
        </tbody>
      </table>

      {/* Total section */}
      <div className="total-section">
        <p><strong>Total:</strong> 22 Credits, 206 Points</p>
      </div>

      {/* Performance boxes */}
      <div className="performance-box">
        <h4>Semester Performance (SGPA)</h4>
        <div className="semester-boxes">
          <div className="semester-box">
            <span>I</span>
            <p>9.36</p>
          </div>
          <div className="semester-box">
            <span>II</span>
            <p>--</p>
          </div>
          <div className="semester-box">
            <span>III</span>
            <p>--</p>
          </div>
          <div className="semester-box">
            <span>IV</span>
            <p>--</p>
          </div>
          <div className="semester-box">
            <span>V</span>
            <p>--</p>
          </div>
          <div className="semester-box">
            <span>VI</span>
            <p>--</p>
          </div>
          <div className="semester-box">
            <span>VII</span>
            <p>--</p>
          </div>
          <div className="semester-box">
            <span>VIII</span>
            <p>--</p>
          </div>
        </div>
        <p><strong>CGPA:</strong> 9.36</p>
      </div>

      {/* Footer */}
      <div className="footer">
        <p>Checked By: ________ &nbsp; Verified By: ________ &nbsp; Controller of Examinations: ________</p>
        <p>Result Declared On: 15th May 2022</p>
      </div>
    </div>
  );
};

export default GradeCard;
