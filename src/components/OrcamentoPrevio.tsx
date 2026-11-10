import { useState } from 'react';
import { PECAS } from '../data/pecas';
import { PORTES } from '../data/servicos';
import { formatarMoeda } from '../lib/formato';
import { calcularOrcamento, type ItemPeca } from '../lib/orcamento';
import type { PorteVeiculo } from '../types';
import { ResumoOrcamento } from './ResumoOrcamento';
import { SeletorServicos } from './SeletorServicos';

interface Props {
  agendar: (servicoIds: string[], porte: PorteVeiculo, pecas: ItemPeca[]) => void;
}

export function OrcamentoPrevio({ agendar }: Props) {
  const [servicos, setServicos] = useState<string[]>([]);
  const [porte, setPorte] = useState<PorteVeiculo>('popular');
  const [pecas, setPecas] = useState<ItemPeca[]>([]);
  const [pecaEscolhida, setPecaEscolhida] = useState('');

  const orcamento = calcularOrcamento(servicos, porte, pecas);

  const adicionarPeca = () => {
    if (!pecaEscolhida) return;
    const existente = pecas.find((p) => p.id === pecaEscolhida);
    setPecas(
      existente
        ? pecas.map((p) => (p.id === pecaEscolhida ? { ...p, quantidade: p.quantidade + 1 } : p))
        : [...pecas, { id: pecaEscolhida, quantidade: 1 }],
    );
    setPecaEscolhida('');
  };

  return (
    <section>
      <h2>Orçamento prévio</h2>
      <p className="texto-suave">Selecione os serviços e o tipo de veículo para ver uma estimativa do valor do conserto.</p>

      <div className="layout-orcamento">
        <div className="cartao">
          <h3>1. Tipo de veículo</h3>
          <div className="opcoes-porte">
            {(Object.keys(PORTES) as PorteVeiculo[]).map((p) => (
              <label key={p} className={porte === p ? 'porte selecionado' : 'porte'}>
                <input type="radio" name="porte" checked={porte === p} onChange={() => setPorte(p)} />
                {PORTES[p].nome}
              </label>
            ))}
          </div>

          <h3>2. Serviços necessários</h3>
          <SeletorServicos selecionados={servicos} onChange={setServicos} />

          <h3>3. Peças (opcional)</h3>
          <div className="filtros">
            <select value={pecaEscolhida} onChange={(e) => setPecaEscolhida(e.target.value)}>
              <option value="">Selecione uma peça...</option>
              {PECAS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome} — {formatarMoeda(p.preco)}
                </option>
              ))}
            </select>
            <button className="btn" onClick={adicionarPeca} disabled={!pecaEscolhida}>
              Adicionar
            </button>
          </div>
          {pecas.length > 0 && (
            <ul className="lista-pecas-orcamento">
              {pecas.map((item) => {
                const peca = PECAS.find((p) => p.id === item.id)!;
                return (
                  <li key={item.id}>
                    <span>
                      {item.quantidade}x {peca.nome}
                    </span>
                    <span>{formatarMoeda(peca.preco * item.quantidade)}</span>
                    <button className="btn btn-link" onClick={() => setPecas(pecas.filter((p) => p.id !== item.id))}>
                      remover
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <aside className="cartao">
          <h3>Estimativa</h3>
          <ResumoOrcamento orcamento={orcamento} />
          <button className="btn btn-destaque largura-total" disabled={servicos.length === 0 && pecas.length === 0} onClick={() => agendar(servicos, porte, pecas)}>
            Agendar com este orçamento
          </button>
        </aside>
      </div>
    </section>
  );
}
