const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const User = require('../models/User');
router.get('/', auth, role(['admin']), async (req,res)=>{ try{ const users = await User.find().select('-password'); res.json(users); }catch(err){ console.error(err); res.status(500).send('Server error'); } });
module.exports = router;
