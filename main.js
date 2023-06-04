const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/files', (req, res) => {
  const files = fs.readdirSync('uploads');
  res.json(files);
});

app.post('/upload', upload.single('file'), (req, res) => {
  const uploadedFile = req.file;
  const originalFilename = uploadedFile.originalname;
  const tempPath = uploadedFile.path;
  const targetPath = path.join(__dirname, 'uploads', originalFilename);

  fs.renameSync(tempPath, targetPath);
  res.redirect('/');
});

app.get('/download/:filename', (req, res) => {
  const { filename } = req.params;
  const file = path.join(__dirname, 'uploads', filename);
  res.download(file);
});

app.delete('/delete/:filename', (req, res) => {
  const { filename } = req.params;
  const file = path.join(__dirname, 'uploads', filename);
  fs.unlinkSync(file);
  res.redirect('/');
});

app.put('/rename/:filename', (req, res) => {
  const { filename } = req.params;
  const { newFilename } = req.body;
  const oldPath = path.join(__dirname, 'uploads', filename);
  const newPath = path.join(__dirname, 'uploads', newFilename);
  fs.renameSync(oldPath, newPath);
  res.redirect('/');
});

app.listen(3000, () => {
  console.log('Uygulama çalışıyor: http://localhost:3000');
});
