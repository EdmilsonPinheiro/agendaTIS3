const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const horarioSchema = new Schema({
  date: { type: String, required: true },
  time: { type: String, required: true },
  reserved: { type: Boolean, default: false }
}, {
  timestamps: true,
});

const Horario = mongoose.model('Horario', horarioSchema);

module.exports = Horario;
