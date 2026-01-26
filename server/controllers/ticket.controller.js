const Ticket = require('../models/Ticket');
const Notification = require('../models/Notification');

exports.getTickets = async (req, res) => {
    try {
        const { status, priority, search } = req.query;
        let query = { companyId: req.user.companyId };

        if (status && status !== 'all') query.status = status;
        if (priority && priority !== 'all') query.priority = priority;
        if (search) {
            query.$or = [
                { subject: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { ticketId: { $regex: search, $options: 'i' } },
            ];
        }

        const tickets = await Ticket.find(query).sort({ createdAt: -1 }).populate('assignedAgent', 'name email');
        res.json(tickets);
    } catch (err) {
        console.error("Get Tickets Error:", err);
        res.status(500).json({ message: 'Error fetching tickets', error: err.message });
    }
};

exports.createTicket = async (req, res) => {
    try {
        const { subject, description, priority, customerName, customerEmail } = req.body;

        if (!req.user.companyId) {
            return res.status(400).json({ message: 'User company ID not found. Please log in again.' });
        }

        const ticket = new Ticket({
            companyId: req.user.companyId,
            subject,
            description: description || subject,
            priority: priority || 'medium',
            customerName,
            customerEmail,
            status: 'open',
            messages: [{
                sender: 'customer',
                message: description || subject,
                timestamp: new Date()
            }]
        });

        await ticket.save();

        // Create notification
        await new Notification({
            companyId: req.user.companyId,
            type: 'new_ticket',
            title: 'New Ticket Created',
            message: `Ticket #${ticket.ticketId}: ${subject}`,
            link: `/dashboard/tickets`
        }).save();

        res.status(201).json(ticket);
    } catch (err) {
        console.error("Create Ticket Error:", err);
        res.status(500).json({ message: 'Error creating ticket', error: err.message });
    }
};

exports.updateTicket = async (req, res) => {
    try {
        const { status, priority, assignedAgent } = req.body;
        const ticket = await Ticket.findOne({ _id: req.params.id, companyId: req.user.companyId });

        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

        const oldAgent = ticket.assignedAgent?.toString();

        if (status) ticket.status = status;
        if (priority) ticket.priority = priority;
        if (assignedAgent) ticket.assignedAgent = assignedAgent;

        await ticket.save();

        // If newly assigned an agent, notify them
        if (assignedAgent && assignedAgent !== oldAgent) {
            await new Notification({
                companyId: req.user.companyId,
                userId: assignedAgent,
                type: 'agent_assigned',
                title: 'New Ticket Assigned',
                message: `You've been assigned to Ticket #${ticket.ticketId}`,
                link: `/dashboard/tickets`
            }).save();
        }

        res.json(ticket);
    } catch (err) {
        console.error("Update Ticket Error:", err);
        res.status(500).json({ message: 'Error updating ticket', error: err.message });
    }
};

exports.getTicketById = async (req, res) => {
    try {
        const ticket = await Ticket.findOne({ _id: req.params.id, companyId: req.user.companyId }).populate('assignedAgent', 'name email');
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
        res.json(ticket);
    } catch (err) {
        console.error("Get Ticket Error:", err);
        res.status(500).json({ message: 'Error fetching ticket', error: err.message });
    }
};

exports.addMessage = async (req, res) => {
    try {
        const { message, isInternal } = req.body;
        const ticket = await Ticket.findOne({ _id: req.params.id, companyId: req.user.companyId });

        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

        ticket.messages.push({
            sender: 'agent',
            message,
            isInternal: !!isInternal,
            timestamp: new Date()
        });

        await ticket.save();
        res.json(ticket);
    } catch (err) {
        console.error("Add Message Error:", err);
        res.status(500).json({ message: 'Error adding message', error: err.message });
    }
};

exports.deleteTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findOneAndDelete({ _id: req.params.id, companyId: req.user.companyId });
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
        res.json({ message: 'Ticket removed' });
    } catch (err) {
        console.error("Delete Ticket Error:", err);
        res.status(500).json({ message: 'Error deleting ticket', error: err.message });
    }
};
