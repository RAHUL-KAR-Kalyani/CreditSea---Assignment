const express = require('express');
const multer = require('multer');
const fs = require('fs/promises');
const path = require('path');
const { parseXmlString, extractFromParsed } = require('../utils/xmlParser');
const Report = require('../models/Report');

const router = express.Router();
const uploadDir = path.join(__dirname, '..', 'uploads');
const upload = multer({ dest: uploadDir, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

// POST /api/upload
router.post('/upload', upload.single('file'), async (req, res, next) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        // basic client-side style validation: extension
        if (!req.file.originalname.toLowerCase().endsWith('.xml')) {
            await fs.unlink(req.file.path).catch(() => { });
            return res.status(400).json({ error: 'Only .xml files allowed' });
        }

        const xml = await fs.readFile(req.file.path, 'utf8');
        let parsed;
        try {
            parsed = await parseXmlString(xml);
        } catch (e) {
            await fs.unlink(req.file.path).catch(() => { });
            return res.status(400).json({ error: 'Invalid XML: parse error' });
        }

        const extracted = extractFromParsed(parsed);
        // attach raw xml for traceability
        extracted.rawXml = xml;
        const doc = await Report.create(extracted);

        // cleanup uploaded temp file
        await fs.unlink(req.file.path).catch(() => { });

        res.json({ id: doc._id, message: 'Parsed and saved', summary: { totalAccounts: doc.totalAccounts, score: doc.score } });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
