export default function Telemetria({ frota, categoria, vsatOnline }) {
  const veiculosExibidos = frota.filter(v => v.tipo === categoria);

  return (
    <div className="container-fluid px-4 mt-4">
      <div className="d-flex justify-content-between align-items-center border-bottom border-secondary pb-2 mb-4">
        <h4 className="fw-light text-info m-0">Frota: <span className="fw-bold text-white">{categoria}</span></h4>
        {!vsatOnline && <span className="badge bg-danger fs-6">⚠ SEM COMUNICAÇÃO COM O HUB</span>}
      </div>
      <div className="row">
        {veiculosExibidos.length === 0 ? (
          <p className="text-secondary">Nenhum ativo operando nesta categoria.</p>
        ) : (
          veiculosExibidos.map(veiculo => {
            const veiculoAtivo = vsatOnline && veiculo.vel !== "0";
            return (
              <div key={veiculo.id} className="col-12 col-sm-6 col-lg-4 col-xl-3 mb-4">
                <div className={`card glass-card h-100 ${!vsatOnline ? 'offline-mode border-danger' : ''}`}>
                  <div className="cenario">
                    <div className="grid-overlay"></div>
                    <div className="estrada" style={{ animation: veiculoAtivo ? `passarEstrada ${veiculo.anim} linear infinite` : 'none' }}></div>
                    <div className="veiculo" style={{ animationPlayState: veiculoAtivo ? 'running' : 'paused' }}>{veiculo.modelo}</div>
                  </div>
                  <div className="card-body">
                    <div className="d-flex justify-content-between mb-3 align-items-center">
                      <h6 className="fw-bold text-info m-0 fs-5">{veiculo.id}</h6>
                      <span className={`badge ${vsatOnline ? (veiculo.vel === "0" ? 'bg-secondary' : 'bg-success') : 'bg-danger'}`}>
                        {vsatOnline ? 'ONLINE' : 'LINK PERDIDO'}
                      </span>
                    </div>
                    <div className="row text-secondary small">
                      <div className="col-6 mb-2">
                        <strong className="text-white">Velocidade:</strong><br/>
                        {vsatOnline ? `${veiculo.vel} km/h` : '-- km/h'}
                      </div>
                      <div className="col-6 mb-2">
                        <strong className="text-white">Uptime:</strong><br/>
                        {vsatOnline ? veiculo.uptime : 'DESCONECTADO'}
                      </div>
                      <div className="col-12 mt-2">
                        <strong className="text-white">Último GPS Conhecido:</strong><br/>
                        <span className={`font-monospace ${vsatOnline ? 'text-warning' : 'text-danger'}`}>{veiculo.gps}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}