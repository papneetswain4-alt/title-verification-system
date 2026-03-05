const express = require('express');
const cors = require('cors');
const titleRoutes = require('./src/routes/titleRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Main Title Verification Routing
app.use('/api/v1/titles', titleRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Title Verification Service is running' });
});

const indexService = require('./src/services/indexService');

(async () => {
    // Intitialize the title indexing cache
    await indexService.loadTitles();

    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
})();

module.exports = app;
