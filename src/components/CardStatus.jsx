import { useState } from 'react';

export function CardStatus({ protocolo, ip, statusInicial }) {
  // Estado para alterar o status e a interface do card
  const [status, setStatus] = useState(statusInicial);

  function alternarConexao() {
    setStatus(prevStatus => (prevStatus === 'UP' ? 'DOWN' : 'UP'));
  }

  const isUp = status === 'UP';

  return (
    <div className="card shadow-sm mb-3">
      <div className="card-body">
        <h5 className="card-title">{protocolo}</h5>
        <p className="card-text text-muted mb-2">Target: {ip}</p>

        {/* Badge dinâmica baseada no estado */}
        <span className={`badge mb-3 d-block py-2 ${isUp ? 'bg-success' : 'bg-danger'}`}>
          {status}
        </span>

        {/* Botão de ação */}
        <button
          className={`btn w-100 ${isUp ? 'btn-outline-danger' : 'btn-outline-success'}`}
          onClick={alternarConexao}
        >
          {isUp ? 'Simular Queda' : 'Restabelecer'}
        </button>
      </div>
    </div>
  );
}