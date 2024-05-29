const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Conectar ao MongoDB
mongoose.connect('mongodb+srv://andrezanaildesign:qPN9dt6ecTsdNfFI@cluster0.hxgqnbk.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const horarioSchema = new mongoose.Schema({
    data: String,
    hora: String,
    reservado: Boolean,
});

const Horario = mongoose.model('Horario', horarioSchema);


// Adicionar horário
app.post('/api/horarios/adicionar', async (req, res) => {
    const { data, hora } = req.body;
    try {
        const novoHorario = new Horario({ data, hora, reservado: false });
        await novoHorario.save();
        res.status(201).json(novoHorario);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao adicionar horário', error });
    }
});

// Remover horário
app.delete('/api/horarios/remover/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Horario.findByIdAndDelete(id);
        res.status(204).end();
    } catch (error) {
        res.status(400).json({ message: 'Erro ao remover horário', error });
    }
});

// Obter horários por data
app.get('/api/horarios/:data', async (req, res) => {
    const { data } = req.params;
    try {
        const horarios = await Horario.find({ data });
        res.status(200).json(horarios);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao obter horários', error });
    }
});

// Reservar horário
app.post('/api/horarios/reservar/:id', async (req, res) => {
  const { id } = req.params;
  try {
      const horario = await Horario.findById(id);
      if (!horario) {
          return res.status(404).json({ message: 'Horário não encontrado' });
      }
      if (horario.reservado) {
          return res.status(400).json({ message: 'Horário já está reservado' });
      }
      horario.reservado = true;
      await horario.save();
      res.status(200).json(horario);
  } catch (error) {
      res.status(500).json({ message: 'Erro ao reservar horário', error });
  }
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});