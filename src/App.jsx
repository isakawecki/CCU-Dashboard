import { useState, useEffect } from 'react';
import Redes from './pages/Redes';
import Telemetria from './pages/Telemetria';
import './pages/telemetria.css';

const dadosIniciais = {
  infraestrutura: [
    { id: 1, tipo: "Link VSAT (Hub Principal)", target: "Satélite Star One D2", latencia: "580ms" },
    { id: 2, tipo: "Link VSAT (BGAN Backup)", target: "Satélite Inmarsat", latencia: "850ms" },
    { id: 3, tipo: "Roteamento OSPF", target: "Core Interno (10.0.0.1)", latencia: "2ms" },
    { id: 4, tipo: "Sessão BGP", target: "Operadora AS-1042", latencia: "12ms" },
    { id: 5, tipo: "Link LTE-Móvel", target: "Antena Celular ERB", latencia: "45ms" }
  ],
  frota: [
    { id: "V-01", modelo: "🚌", tipo: "Ônibus", vel: "85", gps: "-23.55, -46.63" },
    { id: "V-02", modelo: "🚚", tipo: "Caminhão", vel: "70", gps: "-22.90, -43.20" },
    { id: "V-03", modelo: "🏍", tipo: "Moto", vel: "110", gps: "-19.92, -43.93" },
    { id: "V-04", modelo: "🚗", tipo: "Carro", vel: "110", gps: "-25.42, -49.27" },
    { id: "V-05", modelo: "🛻", tipo: "Caminhonete", vel: "80", gps: "-30.03, -51.23" },
    { id: "V-06", modelo: "🚐", tipo: "Van", vel: "75", gps: "-15.79, -47.88" },
    { id: "V-07", modelo: "🚙", tipo: "SUV", vel: "100", gps: "-12.97, -38.50" },
    { id: "V-08", modelo: "🏎", tipo: "Esportivo", vel: "140", gps: "-03.11, -60.02" },
    { id: "V-09", modelo: "🚜", tipo: "Trator", vel: "30", gps: "-16.68, -49.25" },
    { id: "V-10", modelo: "🚑", tipo: "Ambulância", vel: "120", gps: "-20.31, -40.31" }
  ]
};

export default function App() {
  const [statusLinks, setStatusLinks] = useState({ 1: true, 2: true, 3: true, 4: true, 5: true });
  
  const toggleLink = (id) => { 
    setStatusLinks(prev => ({ ...prev, [id]: !prev[id] })); 
  };

  const categoriasVeiculos = ["Ônibus", "Caminhão", "Moto", "Carro", "Caminhonete", "Van", "SUV", "Esportivo", "Trator", "Ambulância"];
  const ordemTelas = ["links", ...categoriasVeiculos];
  
  const [indiceTela, setIndiceTela] = useState(0);
  const [tempoRestante, setTempoRestante] = useState(5);

  useEffect(() => {
    if (tempoRestante > 0) {
      const timer = setTimeout(() => setTempoRestante(tempoRestante - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIndiceTela((prev) => (prev + 1) % ordemTelas.length);
      setTempoRestante(5);
    }
  }, [tempoRestante]);

  const telaAtual = ordemTelas[indiceTela];

  return (
    <div>
      <nav className="navbar navbar-dark bg-black bg-opacity-75 shadow-lg border-bottom border-info sticky-top">
        <div className="container-fluid flex-column align-items-start px-3 py-2">
          <div className="d-flex w-100 justify-content-between align-items-center mb-3">
            <span className="navbar-brand fw-bold text-info m-0 d-flex align-items-center">
              <a 
                href="https://www.google.com/maps" 
                target="_blank" 
                rel="noopener noreferrer" 
                title="Abrir Google Maps" 
                className="spinning-globe">
              </a>
              NOC COMMAND CENTER
            </span>
            <span className="badge bg-transparent border border-info text-info px-3 py-2">
              AUTO-SWAP: 00:0{tempoRestante}
            </span>
          </div>

          <div className="nav-scroll w-100 gap-2">
            <button
              onClick={() => { setIndiceTela(0); setTempoRestante(5); }}
              className={`btn btn-sm text-nowrap px-4 py-2 ${telaAtual === 'links' ? 'btn-info text-dark fw-bold shadow' : 'btn-outline-info text-white'}`}>
              📡 Links Comunicação
            </button>
            {categoriasVeiculos.map((cat, idx) => {
              let iconeBotao = "🚚";
              if (cat === "Moto") iconeBotao = "🏍";
              else if (cat === "Carro" || cat === "SUV" || cat === "Esportivo") iconeBotao = "🚗";
              else if (cat === "Ônibus" || cat === "Van") iconeBotao = "🚌";
              else if (cat === "Ambulância") iconeBotao = "🚑";
              else if (cat === "Trator") iconeBotao = "🚜";

              return (
                <button
                  key={cat}
                  onClick={() => { setIndiceTela(idx + 1); setTempoRestante(5); }}
                  className={`btn btn-sm text-nowrap px-3 py-2 ${telaAtual === cat ? 'btn-light text-dark fw-bold shadow' : 'btn-outline-light text-white'}`}>
                  {iconeBotao} {cat}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <main>
        {telaAtual === 'links' ? (
          <Redes dados={dadosIniciais.infraestrutura} statusLinks={statusLinks} toggleLink={toggleLink} />
        ) : (
          <Telemetria frota={dadosIniciais.frota} categoria={telaAtual} statusLinks={statusLinks} />
        )}
      </main>
    </div>
  );
}