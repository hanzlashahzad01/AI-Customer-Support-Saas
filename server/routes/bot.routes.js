const express = require('express');
const router = express.Router();
const { createOrUpdateBot, getBot, trainBot } = require('../controllers/bot.controller');
const auth = require('../middleware/auth.middleware');

router.post('/', auth(['company_admin', 'super_admin']), createOrUpdateBot);
router.get('/:companyId', getBot); // Public access for the widget to load the bot
router.post('/train', auth(['company_admin', 'super_admin']), trainBot);

module.exports = router;
