const express = require('express');
const router = express.Router();
const { getTickets, createTicket, updateTicket, getTicketById, addMessage } = require('../controllers/ticket.controller');
const auth = require('../middleware/auth.middleware');

router.use(auth());

router.get('/', getTickets);
router.post('/', createTicket);
router.get('/:id', getTicketById);
router.put('/:id', updateTicket);
router.post('/:id/messages', addMessage);
router.delete('/:id', require('../controllers/ticket.controller').deleteTicket);

module.exports = router;
