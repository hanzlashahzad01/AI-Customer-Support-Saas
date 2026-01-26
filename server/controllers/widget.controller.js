const Bot = require('../models/Bot');
const Ticket = require('../models/Ticket');
const Notification = require('../models/Notification');
const { generateResponse } = require('../services/ai.service');

exports.getWidgetScript = async (req, res) => {
    const { id } = req.query;

    if (!id) {
        return res.status(400).send('// PerfectPick: Company ID missing');
    }

    const bot = await Bot.findOne({ companyId: id }) || {};
    const position = bot.widgetPosition === 'bottom-left' ? 'left: 25px;' : 'right: 25px;';
    const transformOrigin = bot.widgetPosition === 'bottom-left' ? 'bottom left' : 'bottom right';

    const script = `
        (function() {
            const companyId = "${id}";
            const backendUrl = "${process.env.BACKEND_URL || 'http://localhost:5000'}";

            // Create styles
            const style = document.createElement('style');
            style.innerHTML = \`
                #pp-widget-container {
                    position: fixed;
                    bottom: 25px;
                    ${position}
                    z-index: 999999;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                }
                #pp-widget-bubble {
                    width: 65px;
                    height: 65px;
                    border-radius: 22px;
                    background: linear-gradient(135deg, ${bot.primaryColor || '#6366f1'} 0%, #a855f7 100%);
                    box-shadow: 0 12px 24px rgba(99, 102, 241, 0.4);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    border: 2px solid rgba(255,255,255,0.2);
                }
                #pp-widget-bubble:hover {
                    transform: scale(1.08) translateY(-5px);
                    box-shadow: 0 15px 30px rgba(99, 102, 241, 0.5);
                }
                #pp-widget-bubble svg {
                    width: 32px;
                    height: 32px;
                    fill: white;
                    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
                }
                #pp-chat-window {
                    position: absolute;
                    bottom: 85px;
                    ${bot.widgetPosition === 'bottom-left' ? 'left: 0;' : 'right: 0;'}
                    width: 400px;
                    height: 650px;
                    background: #ffffff;
                    border-radius: 30px;
                    box-shadow: 0 25px 60px rgba(0,0,0,0.2), 0 0 1px rgba(0,0,0,0.1);
                    display: none;
                    flex-direction: column;
                    overflow: hidden;
                    border: 1px solid rgba(0,0,0,0.05);
                    animation: pp-slide-up 0.5s cubic-bezier(0.19, 1, 0.22, 1);
                    transform-origin: ${transformOrigin};
                }
                @keyframes pp-slide-up {
                    from { transform: translateY(30px) scale(0.95); opacity: 0; }
                    to { transform: translateY(0) scale(1); opacity: 1; }
                }
                @media (max-width: 450px) {
                    #pp-chat-window {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        width: 100%;
                        height: 100%;
                        border-radius: 0;
                    }
                }
                ${bot.widgetCss || ''}
            \`;
            document.head.appendChild(style);

            // Create container
            const container = document.createElement('div');
            container.id = 'pp-widget-container';
            
            const bubble = document.createElement('div');
            bubble.id = 'pp-widget-bubble';
            bubble.innerHTML = '<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
            
            const chatWindow = document.createElement('div');
            chatWindow.id = 'pp-chat-window';
            chatWindow.innerHTML = \`
                <div style="padding: 24px; background: linear-gradient(135deg, ${bot.primaryColor || '#6366f1'} 0%, #8b5cf6 100%); color: white; display: flex; align-items: center; justify-content: space-between;">
                    <div>
                        <div style="font-weight: 900; font-size: 20px; letter-spacing: -0.5px;">PerfectPick AI</div>
                        <div style="font-size: 13px; opacity: 0.9; font-weight: 500; display: flex; align-items: center; gap: 6px; margin-top: 4px;">
                            <span style="width: 8px; height: 8px; background: #22c55e; border-radius: 50%; display: inline-block; border: 2px solid rgba(255,255,255,0.3);"></span>
                            AI Assistant is Online
                        </div>
                    </div>
                    <div id="pp-close-btn" style="cursor: pointer; opacity: 0.8; padding: 5px;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </div>
                </div>
                <iframe 
                    id="pp-iframe"
                    src="\${backendUrl}/widget?id=\${companyId}" 
                    style="flex: 1; border: none; width: 100%; height: 100%; background: #f8fafc;"
                ></iframe>
            \`;

            const toggleChat = () => {
                const isVisible = chatWindow.style.display === 'flex';
                chatWindow.style.display = isVisible ? 'none' : 'flex';
                bubble.style.display = isVisible ? 'flex' : 'none';
            };

            bubble.onclick = toggleChat;
            chatWindow.querySelector('#pp-close-btn').onclick = toggleChat;

            container.appendChild(chatWindow);
            container.appendChild(bubble);
            document.body.appendChild(container);
        })();
    `;

    res.setHeader('Content-Type', 'application/javascript');
    res.send(script);
};

exports.getWidgetPage = async (req, res) => {
    const { id } = req.query;
    const bot = await Bot.findOne({ companyId: id }) || {};

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                * { box-sizing: border-box; }
                body { 
                    margin: 0; 
                    font-family: 'Inter', sans-serif; 
                    background: #f8fafc; 
                    display: flex; 
                    flex-direction: column; 
                    height: 100vh;
                    color: #1e293b;
                }
                #chat { 
                    flex: 1; 
                    overflow-y: auto; 
                    padding: 24px; 
                    display: flex; 
                    flex-direction: column; 
                    gap: 16px;
                    scroll-behavior: smooth;
                }
                .msg { 
                    max-width: 85%; 
                    padding: 12px 18px; 
                    border-radius: 20px; 
                    font-size: 14.5px; 
                    line-height: 1.5;
                    font-weight: 500;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                }
                .bot { 
                    background: white; 
                    align-self: flex-start; 
                    border: 1px solid #e2e8f0; 
                    border-bottom-left-radius: 4px;
                    color: #334155;
                }
                .user { 
                    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); 
                    color: white; 
                    align-self: flex-end; 
                    border-bottom-right-radius: 4px;
                    box-shadow: 0 8px 20px rgba(99, 102, 241, 0.2);
                }
                .typing {
                    font-style: italic;
                    font-size: 12px;
                    color: #94a3b8;
                    margin-bottom: 4px;
                    display: none;
                }
                #input-area { 
                    padding: 20px 24px; 
                    background: white; 
                    border-top: 1px solid #e2e8f0; 
                    display: flex; 
                    gap: 12px;
                    align-items: center;
                }
                input { 
                    flex: 1; 
                    border: 1px solid #e2e8f0; 
                    border-radius: 14px; 
                    padding: 12px 16px; 
                    outline: none; 
                    font-family: inherit;
                    font-size: 14px;
                    background: #f1f5f9;
                    transition: all 0.2s;
                }
                input:focus {
                    background: white;
                    border-color: #6366f1;
                    box-shadow: 0 0 0 4px rgba(99,102,241,0.1);
                }
                button { 
                    background: #6366f1; 
                    color: white; 
                    border: none; 
                    width: 42px;
                    height: 42px;
                    border-radius: 12px; 
                    cursor: pointer; 
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
                }
                button:hover { transform: scale(1.05); background: #4f46e5; }
                button:active { transform: scale(0.95); }
                button svg { width: 20px; height: 20px; }
            </style>
        </head>
        <body>
            <div id="chat">
                <div class="msg bot">${bot.welcomeMessage || 'Hello! How can I help you today?'}</div>
            </div>
            <div id="typing" class="typing" style="padding: 0 24px;">AI is typing...</div>
            <div id="input-area">
                <input type="text" id="msgInput" placeholder="How can we help?">
                <button onclick="send()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
            </div>
            <script>
                const chat = document.getElementById('chat');
                const input = document.getElementById('msgInput');
                const typing = document.getElementById('typing');
                const companyId = "${id}";
                
                async function send() {
                    const text = input.value.trim();
                    if(!text) return;
                    
                    addMsg(text, 'user');
                    input.value = '';
                    typing.style.display = 'block';

                    try {
                        const res = await fetch('/widget/message', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ companyId, message: text })
                        });
                        const data = await res.json();
                        typing.style.display = 'none';
                        addMsg(data.text, 'bot');
                    } catch (err) {
                        typing.style.display = 'none';
                        addMsg("I'm sorry, I'm having trouble connecting. Please try again later.", 'bot');
                    }
                }

                function addMsg(text, type) {
                    const div = document.createElement('div');
                    div.className = 'msg ' + type;
                    div.textContent = text;
                    chat.appendChild(div);
                    chat.scrollTop = chat.scrollHeight;
                }

                input.onkeypress = (e) => { if(e.key === 'Enter') send(); }
            </script>
        </body>
        </html>
    `);
};

exports.handleWidgetMessage = async (req, res) => {
    try {
        const { companyId, message } = req.body;

        if (!companyId || !message) {
            return res.status(400).json({ message: 'Missing fields' });
        }

        // 1. Fetch Bot Config
        const bot = await Bot.findOne({ companyId });

        // 2. Generate Response
        const aiResponse = await generateResponse(message, [], bot || {});

        // 3. Logic: If confidence is low, create a ticket
        if (aiResponse.confidence < (bot?.confidenceThreshold || 0.7)) {
            const ticket = new Ticket({
                companyId,
                subject: `AI Escalation: "${message.substring(0, 30)}..."`,
                description: `Customer Query: ${message}\nAI Response: ${aiResponse.text}`,
                customerName: 'Guest User',
                status: 'open',
                messages: [{ sender: 'customer', message, timestamp: new Date() }]
            });
            await ticket.save();

            // Notify Company
            await new Notification({
                companyId,
                type: 'new_ticket',
                title: '⚠️ Human Help Requested',
                message: `AI escalated a query: "${message.substring(0, 25)}..."`,
                link: '/dashboard/tickets'
            }).save();

            // Append escalation message to AI response
            aiResponse.text += " (I've created a ticket for our support team to look into this more deeply for you.)";
        }

        res.json({ text: aiResponse.text });
    } catch (err) {
        console.error("Widget Message Error:", err);
        res.status(500).json({ text: "I encountered an error. Please try again later." });
    }
};

