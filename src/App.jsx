import { useState, useEffect } from 'react';
import Redes from './pages/Redes';
import Telemetria from './pages/Telemetria';
import './pages/telemetria.css';

export default function App() {
  const [infra, setInfra] = useState([]);
  const [frota, setFrota] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [vsatOnline, setVsatOnline] = useState(true);

  const categoriasVeiculos = ["Ônibus", "Caminhão", "Moto", "Carro", "Caminhonete", "Van", "SUV", "Esportivo", "Trator", "Ambulância"];
  const ordemTelas = ["infra", ...categoriasVeiculos];
  
  const [indiceTela, setIndiceTela] = useState(0);
  const [tempoRestante, setTempoRestante] = useState(5);

  useEffect(() => {
    fetch('./dados.json')
      .then(res => res.json())
      .then(dados => {
        setInfra(dados.infraestrutura);
        setFrota(dados.frota);
        setCarregando(false);
      })
      .catch(err => console.error("Erro ao carregar dados: ", err));
  }, []);

  useEffect(() => {
    if (!carregando) {
      if (tempoRestante > 0) {
        const timer = setTimeout(() => setTempoRestante(tempoRestante - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setIndiceTela((prev) => (prev + 1) % ordemTelas.length);
        setTempoRestante(5);
      }
    }
  }, [tempoRestante, carregando]);

  if (carregando) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 text-info">
        <div className="spinner-border" style={{ width: '3rem', height: '3rem' }}></div>
      </div>
    );
  }

  const telaAtual = ordemTelas[indiceTela];

  return (
    <div>
      <nav className="navbar navbar-dark bg-black bg-opacity-75 shadow-lg border-bottom border-info">
        <div className="container-fluid flex-column align-items-start px-3 py-2">
          <div className="d-flex w-100 justify-content-between align-items-center mb-3">
            <span className="navbar-brand fw-bold text-info m-0">🌐 NOC COMMAND CENTER</span>
            <div className="d-flex align-items-center">
              <span className={`badge me-3 px-3 py-2 ${vsatOnline ? 'bg-success' : 'bg-danger'}`}>
                HUB VSAT: {vsatOnline ? 'OPERACIONAL' : 'FORA DO AR'}
              </span>
              <span className="badge bg-transparent border border-info text-info px-3 py-2">
                AUTO-SWAP: 00:0{tempoRestante}
              </span>
            </div>
          </div>
          <div className="nav-scroll w-100 gap-2">
            <button
              onClick={() => { setIndiceTela(0); setTempoRestante(5); }}
              className={`btn btn-sm text-nowrap px-4 py-2 ${telaAtual === 'infra' ? 'btn-info text-dark fw-bold shadow' : 'btn-outline-info text-white'}`}>
              📡 Painel Core/VSAT
            </button>
            {categoriasVeiculos.map((cat, idx) => (
              <button
                key={cat}
                onClick={() => { setIndiceTela(idx + 1); setTempoRestante(5); }}
                className={`btn btn-sm text-nowrap px-3 py-2 ${telaAtual === cat ? 'btn-light text-dark fw-bold shadow' : 'btn-outline-light text-white'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {telaAtual === 'infra' ? (
        <Redes dados={infra} vsatOnline={vsatOnline} setVsatOnline={setVsatOnline} />
      ) : (
        <Telemetria frota={frota} categoria={telaAtual} vsatOnline={vsatOnline} />
      )}
    </div>
  );
}