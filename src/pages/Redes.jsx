export default function Redes({ dados, vsatOnline, setVsatOnline }) {
  return (
    <div className="container-fluid px-4 mt-4">
      <h4 className="fw-light text-info border-bottom border-secondary pb-2 mb-4">Core de Redes e Hub Satelital</h4>
      <div className="row">
        {dados.map(item => {
          const isHub = item.id === 1;
          const statusAtual = isHub ? (vsatOnline ? 'UP' : 'DOWN') : item.status;
          const latenciaAtual = isHub ? (vsatOnline ? item.latencia : 'TIMEOUT') : item.latencia;

          return (
            <div key={item.id} className="col-12 col-sm-6 col-lg-4 col-xl-3 mb-4">
              <div className={`card glass-card h-100 ${!vsatOnline && isHub ? 'border-danger' : ''}`}>
                <div className="card-body d-flex flex-column justify-content-between">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h6 className="mb-0 fw-bold">{item.tipo || item.protocolo}</h6>
                      <small className="text-secondary d-block">Alvo: {item.target}</small>
                      <span className={`badge mt-2 ${statusAtual === 'UP' ? 'bg-success' : statusAtual === 'STANDBY' ? 'bg-warning text-dark' : 'bg-danger'}`}>
                        {statusAtual}
                      </span>
                    </div>
                    <div className="text-end">
                      <small className="text-secondary d-block">Latência</small>
                      <strong className={latenciaAtual === 'TIMEOUT' ? "text-danger" : parseInt(latenciaAtual) > 500 ? "text-warning" : "text-success"}>
                        {latenciaAtual}
                      </strong>
                    </div>
                  </div>
                  {isHub && (
                    <button
                      onClick={() => setVsatOnline(!vsatOnline)}
                      className={`btn btn-sm w-100 mt-2 fw-bold shadow-sm ${vsatOnline ? 'btn-outline-danger' : 'btn-success'}`}>
                      {vsatOnline ? '⚠ Simular Queda VSAT' : '🔄 Restaurar Conexão'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}