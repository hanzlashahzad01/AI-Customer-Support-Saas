const express = require('express');
const router = express.Router();
const { getAgents, createAgent, updateMe } = require('../controllers/user.controller');
const auth = require('../middleware/auth.middleware');

router.get('/agents', auth(), getAgents);
router.post('/agents', auth(['company_admin']), createAgent);
router.put('/agents/:id', auth(['company_admin']), require('../controllers/user.controller').updateAgent);
router.delete('/agents/:id', auth(['company_admin']), require('../controllers/user.controller').deleteAgent);
router.put('/me', auth(), updateMe);

module.exports = router;
