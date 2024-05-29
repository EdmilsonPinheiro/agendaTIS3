import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles.css';

const AgendaProprietaria = () => {
    const [dataSelecionada, setDataSelecionada] = useState('');
    const [horaSelecionada, setHoraSelecionada] = useState('');
    const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
    const [mensagemErro, setMensagemErro] = useState('');

    useEffect(() => {
        if (dataSelecionada) {
            axios.get(`http://localhost:5000/api/horarios/${dataSelecionada}`)
                .then(response => {
                    setHorariosDisponiveis(response.data);
                })
                .catch(error => {
                    console.error("Houve um erro ao buscar os dados!", error);
                });
        }
    }, [dataSelecionada]);

    const handleAddTime = (e) => {
        e.preventDefault();

        // Verificar se o horário já existe
        const horarioExistente = horariosDisponiveis.some(horario =>
            horario.data === dataSelecionada && horario.hora === horaSelecionada
        );

        if (horarioExistente) {
            setMensagemErro('Já existe um horário neste dia e hora.');
            return;
        }

        axios.post('http://localhost:5000/api/horarios/adicionar', { data: dataSelecionada, hora: horaSelecionada })
            .then((response) => {
                setHorariosDisponiveis([...horariosDisponiveis, response.data]);
                setHoraSelecionada('');
                setMensagemErro('');
            })
            .catch(error => {
                console.error("Houve um erro ao adicionar o horário!", error);
            });
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:5000/api/horarios/remover/${id}`)
            .then(() => {
                setHorariosDisponiveis(horariosDisponiveis.filter(horario => horario._id !== id));
            })
            .catch(error => {
                console.error("Houve um erro ao excluir o horário!", error);
            });
    };

    // Função para obter a data atual no formato 'YYYY-MM-DD'
    const getDataAtual = () => {
        const hoje = new Date();
        const dia = String(hoje.getDate()).padStart(2, '0');
        const mes = String(hoje.getMonth() + 1).padStart(2, '0'); // Janeiro é 0
        const ano = hoje.getFullYear();
        return `${ano}-${mes}-${dia}`;
    };

    return (
        <div className="container">
            <h1>Andreza Nail Designer</h1>
            <div className="agenda">
                <h2>Gerenciar Agenda</h2>
                <form onSubmit={handleAddTime} className="form-agenda">
                    <div className="form-group">
                        <label htmlFor="date">Data:</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            required
                            value={dataSelecionada}
                            min={getDataAtual()} // Desativa datas anteriores ao dia atual
                            onChange={(e) => setDataSelecionada(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="time">Horário:</label>
                        <input
                            type="time"
                            id="time"
                            name="time"
                            required
                            value={horaSelecionada}
                            onChange={(e) => setHoraSelecionada(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn-add">Adicionar</button>
                </form>
                {mensagemErro && <p className="erro">{mensagemErro}</p>}
                <h2>Horários Disponíveis</h2>
                <div className="agenda-list">
                    {horariosDisponiveis.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Horário</th>
                                    <th>Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {horariosDisponiveis.map(time => (
                                    <tr key={time._id}>
                                        <td>{time.hora}</td>
                                        <td>
                                            <button onClick={() => handleDelete(time._id)} className="btn-delete">Remover</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>Você não reservou horários para a data escolhida.</p>
                    )}
                </div>
            </div>
            <br /><br />
            <Link to="/" className="btn-link">Ir para Reservar Horário</Link>
        </div>
    );
}

export default AgendaProprietaria;