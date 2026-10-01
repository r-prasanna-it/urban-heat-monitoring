const express = require('express');
const router = express.Router();
const {
  getCoolingInitiatives,
  getCoolingInitiativeById,
  createCoolingInitiative,
  updateCoolingInitiative,
  deleteCoolingInitiative,
} = require('../controllers/coolingInitiativeController');

router.route('/')
  .get(getCoolingInitiatives)
  .post(createCoolingInitiative);

router.route('/:id')
  .get(getCoolingInitiativeById)
  .put(updateCoolingInitiative)
  .delete(deleteCoolingInitiative);

module.exports = router;
