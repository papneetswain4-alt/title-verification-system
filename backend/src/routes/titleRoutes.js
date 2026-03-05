const express = require('express');
const router = express.Router();
const titleController = require('../controllers/titleController');

/**
 * @route POST /api/v1/titles/verify
 * @desc Verify a new title submission against rules and similarity
 */
router.post('/verify', titleController.verifyTitle);

module.exports = router;
