const validationPipeline = require('../services/validationPipeline');

/**
 * Controller for title verification endpoint
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
exports.verifyTitle = async (req, res) => {
    try {
        const { title } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Title field is required' });
        }

        // Run the title through the validation orchestrator
        const result = await validationPipeline.process(title);

        res.status(200).json(result);
    } catch (error) {
        console.error('Error verifying title:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
