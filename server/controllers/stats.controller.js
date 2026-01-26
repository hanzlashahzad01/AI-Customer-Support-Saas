const Ticket = require('../models/Ticket');
const User = require('../models/User');
const Bot = require('../models/Bot');
const mongoose = require('mongoose');

exports.getDashboardStats = async (req, res) => {
    try {
        const companyId = new mongoose.Types.ObjectId(req.user.companyId);

        // 1. Ticket status counts
        const ticketStats = await Ticket.aggregate([
            { $match: { companyId } },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        const stats = {
            totalTickets: 0,
            openTickets: 0,
            resolvedTickets: 0,
            urgentTickets: await Ticket.countDocuments({ companyId, priority: 'urgent', status: { $ne: 'resolved' } }),
        };

        ticketStats.forEach(s => {
            stats.totalTickets += s.count;
            if (s._id === 'open' || s._id === 'in_progress') stats.openTickets += s.count;
            if (s._id === 'resolved' || s._id === 'closed') stats.resolvedTickets += s.count;
        });

        // Simplified for now: just count total tickets as "chats" handled
        // In a real app, you'd aggregate separate 'Chat' model sessions
        stats.totalChats = stats.totalTickets * 3.5; // Mocking activity factor

        // 2. Weekly Activity (7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const weeklyStats = await Ticket.aggregate([
            { $match: { companyId, createdAt: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    tickets: { $sum: 1 },
                    resolved: { $sum: { $cond: [{ $in: ["$status", ["resolved", "closed"]] }, 1, 0] } }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // 3. Agent Count
        const agentCount = await User.countDocuments({ companyId, role: 'support_agent' });

        res.json({
            stats: {
                totalTickets: stats.totalTickets,
                openTickets: await Ticket.countDocuments({ companyId, status: 'open' }),
                resolvedTickets: await Ticket.countDocuments({ companyId, status: { $in: ['resolved', 'closed'] } }),
                urgentTickets: stats.urgentTickets,
                activeAgents: agentCount
            },
            chartData: weeklyStats.map(w => ({
                name: new Date(w._id).toLocaleDateString('en-US', { weekday: 'short' }),
                tickets: w.tickets,
                resolved: w.resolved
            }))
        });

    } catch (err) {
        console.error("Dashboard Stats Error:", err);
        res.status(500).json({ message: 'Error fetching stats' });
    }
};
