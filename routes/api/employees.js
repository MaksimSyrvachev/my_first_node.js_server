const express = require('express');
const router = express.Router();
const employeeController = require('../../controllers/employeesController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')//chain methods
    //.get(verifyJWT, employeeController.getAllEmployees)//first goes through middleware (verifyJWT) and than to the controller
    .get(employeeController.getAllEmployees)
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeeController.createNewEmployee)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeeController.updateEmployee)
    .delete(verifyRoles(ROLES_LIST.Admin), employeeController.deleteEmployee)

router.route('/:id')//parameter inside the url
    .get(employeeController.getEmployee);



module.exports = router;