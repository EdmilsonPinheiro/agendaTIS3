const router = require('express').Router();
let Horario = require('../models/Horario');

// Listar horários
router.route('/:date').get((req, res) => {
  Horario.find({ date: req.params.date })
    .then(horarios => res.json(horarios))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Adicionar horário
router.route('/adicionar').post(async (req, res) => {
  const { date, time } = req.body;

  try {
    // Verificar se o horário já existe
    const horarioExistente = await Horario.findOne({ date, time });
    if (horarioExistente) {
      return res.status(400).json({ message: 'Horário já existe!' });
    }

    const newHorario = new Horario({ date, time });
    await newHorario.save();
    res.status(201).json(newHorario);
  } catch (error) {
    res.status(400).json('Error: ' + error);
  }
});

// Remover horário
router.route('/remover/:id').delete((req, res) => {
  Horario.findByIdAndDelete(req.params.id)
    .then(() => res.json('Horário deletado.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Reservar horário
router.route('/reservar/:id').post((req, res) => {
  Horario.findById(req.params.id)
    .then(horario => {
      horario.reserved = true;

      horario.save()
        .then(() => res.json('Horário reservado!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;