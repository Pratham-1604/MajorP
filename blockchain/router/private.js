const router = require("express").Router();
const {
  newComplaint,
  getComplaintDetail,
  updateToAComplaint,
} = require("../controllers/blockchain_crud");

// Endpoint to create a new complaint
router.post("/newComplaints", newComplaint);

// Endpoint to get details of a specific complaint
router.get("/getComplaintDetail/:id", getComplaintDetail);

// Endpoint to update a complaint
router.put("/updateToAComplaints/:id", updateToAComplaint);

module.exports = router;
