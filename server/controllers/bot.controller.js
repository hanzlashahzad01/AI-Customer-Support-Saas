const Bot = require('../models/Bot');

exports.createOrUpdateBot = async (req, res) => {
    try {
        const {
            name,
            welcomeMessage,
            tone,
            language,
            faqs,
            trainingData,
            productDescriptions,
            confidenceThreshold,
            primaryColor,
            widgetPosition,
            widgetCss,
            isActive
        } = req.body;

        // Default to user's companyId if not provided (safety)
        const companyId = req.body.companyId || req.user.companyId;

        if (!companyId) {
            return res.status(400).json({ message: 'Company ID is required' });
        }

        // Security check
        if (req.user.companyId && req.user.companyId !== companyId && req.user.role !== 'super_admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        let bot = await Bot.findOne({ companyId });
        if (bot) {
            if (name !== undefined) bot.name = name;
            if (welcomeMessage !== undefined) bot.welcomeMessage = welcomeMessage;
            if (tone !== undefined) bot.tone = tone;
            if (language !== undefined) bot.language = language;
            if (faqs !== undefined) bot.faqs = faqs;
            if (trainingData !== undefined) bot.trainingData = trainingData;
            if (productDescriptions !== undefined) bot.productDescriptions = productDescriptions;
            if (confidenceThreshold !== undefined) bot.confidenceThreshold = confidenceThreshold;
            if (primaryColor !== undefined) bot.primaryColor = primaryColor;
            if (widgetPosition !== undefined) bot.widgetPosition = widgetPosition;
            if (widgetCss !== undefined) bot.widgetCss = widgetCss;
            if (isActive !== undefined) bot.isActive = isActive;
        } else {
            bot = new Bot({
                companyId,
                name,
                welcomeMessage,
                tone,
                language,
                faqs: faqs || [],
                trainingData,
                productDescriptions,
                confidenceThreshold,
                primaryColor,
                widgetPosition,
                widgetCss,
                isActive
            });
        }
        await bot.save();
        res.json(bot);
    } catch (err) {
        console.error("Bot Controller Error:", err);
        res.status(500).json({ message: 'Server error while managing bot', error: err.message });
    }
};

exports.getBot = async (req, res) => {
    const { companyId } = req.params;
    try {
        const bot = await Bot.findOne({ companyId });
        if (!bot) {
            return res.json({
                name: 'Support Bot',
                welcomeMessage: 'Hello! How can I help you today?',
                tone: 'professional',
                widgetPosition: 'bottom-right',
                widgetCss: '',
                faqs: []
            });
        }
        res.json(bot);
    } catch (err) {
        console.error("Bot Controller Get Error:", err);
        res.status(500).json({ message: 'Error fetching bot settings', error: err.message });
    }
};

exports.trainBot = async (req, res) => {
    // Legacy support, or for specific training actions. 
    // For now we can rely on createOrUpdateBot for simple FAQ management.
    exports.createOrUpdateBot(req, res);
};
