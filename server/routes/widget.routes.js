const express = require('express');
const router = express.Router();
const widgetController = require('../controllers/widget.controller');

// Public routes for the widget (no auth needed for customers)
router.get('/script.js', widgetController.getWidgetScript);
router.get('/', widgetController.getWidgetPage);
router.post('/message', widgetController.handleWidgetMessage);

module.exports = router;
