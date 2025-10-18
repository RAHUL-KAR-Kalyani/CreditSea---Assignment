const express = require('express');
const Report = require('../models/Report');

const router = express.Router();

// GET /api/reports?page=0&limit=20
router.get('/reports', async (req, res, next) => {
    try {
        const page = Math.max(0, parseInt(req.query.page || 0));
        const limit = Math.min(50, parseInt(req.query.limit || 20));
        const docs = await Report.find()
            .sort({ createdAt: -1 })
            .skip(page * limit)
            .limit(limit)
            .select('name score totalAccounts createdAt');
        res.json(docs);
    } catch (err) {
        next(err);
    }
});

// GET /api/reports/:id
router.get('/reports/:id', async (req, res, next) => {
    try {
        const r = await Report.findById(req.params.id);
        if (!r) return res.status(404).json({ error: 'Not found' });
        res.json(r);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
