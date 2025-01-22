const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Path to the times.csv file
const csvFilePath = path.join(__dirname, 'times.csv');

// Middleware to parse JSON requests
app.use(bodyParser.json());
app.use(cors());

// Helper function to read and parse CSV
const readCSV = () => {
    if (!fs.existsSync(csvFilePath)) {
        fs.writeFileSync(csvFilePath, 'Position,Name,Time\n', 'utf8');
    }

    const data = fs.readFileSync(csvFilePath, 'utf8').trim();
    const lines = data.split('\n');
    const entries = lines.slice(1).map(line => {
        const [position, name, time] = line.split(',');
        return { position: parseInt(position, 10), name, time: parseFloat(time) };
    });

    return entries;
};

// Helper function to write entries back to CSV
const writeCSV = (entries) => {
    const sortedEntries = entries.sort((a, b) => a.time - b.time);
    sortedEntries.forEach((entry, index) => {
        entry.position = index + 1;
    });

    const csvContent = ['Position,Name,Time', ...sortedEntries.map(entry => `${entry.position},${entry.name},${entry.time}`)].join('\n');
    fs.writeFileSync(csvFilePath, csvContent, 'utf8');
};

// API to get the leaderboard
app.get('/leaderboard', (req, res) => {
    try {
        const entries = readCSV();
        res.json(entries);
    } catch (error) {
        console.error('Error reading leaderboard:', error);
        res.status(500).send('Failed to retrieve leaderboard.');
    }
});

// API to submit a new score
app.post('/submit', (req, res) => {
    const { name, time } = req.body;

    if (!name || typeof time !== 'number') {
        return res.status(400).send('Invalid input. Name and time are required.');
    }

    try {
        const entries = readCSV();
        entries.push({ position: entries.length + 1, name, time });
        writeCSV(entries);

        res.status(200).send('Score submitted successfully!');
    } catch (error) {
        console.error('Error writing leaderboard:', error);
        res.status(500).send('Failed to submit score.');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
