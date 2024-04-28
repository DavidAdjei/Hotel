const express = require("express");
const router = express.Router();
const { signUp, signin, allEmployees, makeAdmin, removeAdmin, logout, getEmployeeLogs, viewOrders } = require("../Controllers/employee");
const { addItems, allItems, editItem, deleteItem } = require("../Controllers/items");
const { addClient, checkIn, checkOut, allClients, updateDaysRemaining, updateHoursRemaining, getDishes, addDish, placeOrder, feedbacks } = require('../Controllers/client');
const {loginMiddleware, logoutMiddleware} = require("../helpers/middleware")

router.post("/signup", signUp);
router.post("/signin", loginMiddleware, signin);
router.get("/allEmployees", allEmployees);
router.post("/addItems", addItems);
router.get("/items", allItems);
router.put("/editItem/:id", editItem);
router.delete("/deleteItem/:id", deleteItem);
router.post("/checkIn/:department", checkIn);
router.post("/checkOut/:department", checkOut);
router.post("/addClient/:department", addClient);
router.get("/allClients/:department", allClients);
router.put("/makeAdmin/:id", makeAdmin);
router.put("/removeAdmin/:id", removeAdmin);
router.post("/updateDaysRemaining", updateDaysRemaining);
router.post("/updateHoursRemaining/:department", updateHoursRemaining);
router.get('/dishes', getDishes);
router.post('/addDish', addDish);
router.post('/placeOrder', placeOrder);
router.get('/viewOrders', viewOrders);
router.get("/getLogs/:id", getEmployeeLogs);
router.get("/feedbacks", feedbacks);
router.post("/logout/:userId", logoutMiddleware, logout);

module.exports = router;
