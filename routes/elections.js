const express = require('express');
const Election = require('../models/Election');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Forbidden' });
  const election = new Election(req.body);
  await election.save();
  res.json(election);
});

router.get('/', auth, async (req, res) => {
  const elections = await Election.find();
  res.json(elections);
});

router.post('/:id/vote', auth, async (req, res) => {
  const { candidateIndex } = req.body;
  const election = await Election.findById(req.params.id);
  if (election.voters.includes(req.user.id)) {
    return res.status(400).json({ msg: 'Already voted' });
  }
  election.candidates[candidateIndex].votes += 1;
  election.voters.push(req.user.id);
  await election.save();
  res.json({ msg: 'Vote recorded' });
});

module.exports = router;
