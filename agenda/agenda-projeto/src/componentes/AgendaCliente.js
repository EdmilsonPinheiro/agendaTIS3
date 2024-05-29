import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles.css';

const AgendaCliente = () => {
    const [dataSelecionada, setDataSelecionada] = useState('');
    const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (dataSelecionada) {
            setLoading(true);
            axios.get(`http://localhost:5000/api/horarios/${dataSelecionada}`)
                .then(response => {
                    setHorariosDisponiveis(response.data);
                    setLoading(false);
                    setError(null);
                })
                .catch(error => {
                    setError("Houve um erro ao buscar os dados!");
                    setLoading(false);
                    console.error("Houve um erro ao buscar os dados!", error);
                });
        }
    }, [dataSelecionada]);

    const handleReserve = (id) => {
        axios.post(`http://localhost:5000/api/horarios/reservar/${id}`)
            .then(() => {
                setHorariosDisponiveis(horariosDisponiveis.map(horario =>
                    horario._id === id ? { ...horario, reservado: true } : horario
                ));
                setError(null);
            })
            .catch(error => {
                setError("Houve um erro ao reservar o horário!");
                console.error("Houve um erro ao reservar o horário!", error);
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
                <h2>Reservar Horário</h2>
                <form className="form-agenda">
                    <div className="form-group">
                        <label htmlFor="datePicker">Selecione uma Data:</label>
                        <input
                            type="date"
                            id="datePicker"
                            min={getDataAtual()} // Desativa datas anteriores ao dia atual
                            onChange={(e) => setDataSelecionada(e.target.value)}
                        />
                    </div>
                </form>
                <div id="horariosDisponiveis" className="agenda-list">
                    {loading ? (
                        <p>Carregando horários...</p>
                    ) : error ? (
                        <p>{error}</p>
                    ) : horariosDisponiveis.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Horário</th>
                                    <th>Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {horariosDisponiveis.map(horario => (
                                    <tr key={horario._id}>
                                        <td>{horario.hora}</td>
                                        <td>
                                            <button
                                                className={horario.reservado ? 'btn-reservado' : 'btn-reserve'}
                                                disabled={horario.reservado}
                                                onClick={() => handleReserve(horario._id)}
                                            >
                                                {horario.reservado ? 'Reservado' : 'Reservar'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>Não temos horários disponíveis para hoje.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AgendaCliente;