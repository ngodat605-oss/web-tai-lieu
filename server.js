const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.static('public'));
app.use(fileUpload());

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Upload file
app.post('/upload', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) return res.send('No files');
    let file = req.files.file;
    file.mv(path.join(uploadDir, file.name), (err) => {
        if (err) return res.send('error');
        res.send('ok');
    });
});

// List files
app.get('/files', (req, res) => {
    fs.readdir(uploadDir, (err, files) => {
        res.json(files || []);
    });
});

// Download
app.get('/files/:name', (req, res) => {
    res.download(path.join(uploadDir, req.params.name));
});

// Xóa file (MỚI)
app.delete('/delete/:name', (req, res) => {
    const filePath = path.join(uploadDir, req.params.name);
    fs.unlink(filePath, (err) => {
        if (err) return res.status(500).send('error');
        res.send('ok');
    });
});

app.listen(process.env.PORT || 3000, '0.0.0.0', () => {
    console.log("Server running");
});