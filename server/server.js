const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { generateResponse } = require('./services/ai.service');
const Ticket = require('./models/Ticket');
const Company = require('./models/Company');
const Notification = require('./models/Notification');
const rateLimit = require('express-rate-limit');



const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window`
    standardHeaders: true,
    legacyHeaders: false,
});

// app.use('/api/', limiter);
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/bot', require('./routes/bot.routes'));
app.use('/api/tickets', require('./routes/ticket.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/notifications', require('./routes/notification.routes'));
app.use('/api/stats', require('./routes/stats.routes'));
app.use('/widget', require('./routes/widget.routes'));

const Bot = require('./models/Bot');

// Socket.io Connection
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('join_company', (companyId) => {
        socket.join(companyId);
        console.log(`Socket ${socket.id} joined company ${companyId}`);
    });

    // Track which companies have "Agent Takeover" active (paused AI)
    const pausedCompanies = new Set();

    socket.on('toggle_ai', ({ companyId, isPaused }) => {
        if (isPaused) {
            pausedCompanies.add(companyId);
            io.to(companyId).emit('ai_status_change', { isPaused: true });
        } else {
            pausedCompanies.delete(companyId);
            io.to(companyId).emit('ai_status_change', { isPaused: false });
        }
    });

    socket.on('send_message', async (data) => {
        const { companyId, message, sender } = data;

        // Broadcast to room (so agents see it)
        io.to(companyId).emit('receive_message', { message, sender, timestamp: new Date() });

        if (sender === 'user') {
            // Check if Agent has taken over
            if (pausedCompanies.has(companyId)) {
                console.log(`Skipping AI response for ${companyId} (Agent Takeover Active)`);
                return;
            }

            try {
                // 1. Fetch Bot Config
                const bot = await Bot.findOne({ companyId });

                // 2. Generate AI Response with full bot context
                const aiResponse = await generateResponse(message, [], bot || {});

                // 3. Smart Ticket Check (Confidence or specific trigger words)
                if (aiResponse.confidence < (bot?.confidenceThreshold || 0.7)) {
                    const ticket = new Ticket({
                        companyId,
                        subject: `AI Escalation: Low Confidence (${Math.round(aiResponse.confidence * 100)}%)`,
                        description: `User: ${message}\nAI: ${aiResponse.text}`,
                        messages: [{ sender: 'customer', message: message }]
                    });
                    await ticket.save();

                    // Create Notification
                    await new Notification({
                        companyId,
                        type: 'new_ticket',
                        title: '⚠️ AI Help Requested',
                        message: `Bot escalating to human for: "${message.substring(0, 30)}..."`,
                        link: `/dashboard/tickets`
                    }).save();

                    setTimeout(() => {
                        io.to(companyId).emit('receive_message', {
                            message: aiResponse.text + " (I've created a ticket and an agent will join soon.)",
                            sender: 'bot',
                            isDiagnostic: aiResponse.confidence < 0.8,
                            timestamp: new Date()
                        });
                    }, 1000);
                } else {
                    // Regular Bot Response
                    setTimeout(() => {
                        io.to(companyId).emit('receive_message', {
                            message: aiResponse.text,
                            sender: 'bot',
                            timestamp: new Date()
                        });
                    }, 1000);
                }
            } catch (err) {
                console.error("Socket send_message error:", err);
            }
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/perfect-pick-saas';

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('MongoDB Connected');
        httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => console.log('MongoDB Connection Error:', err));
