import { useEffect, useState } from 'react';
import { Agendamento, type PreSelecao } from './components/Agendamento';
import { Autopecas } from './components/Autopecas';
import { Eletricistas } from './components/Eletricistas';
import { Inicio } from './components/Inicio';
import { OrcamentoPrevio } from './components/OrcamentoPrevio';
import { LOJA } from './config';
import type { ItemPeca } from './lib/orcamento';
import { useArmazenamento } from './lib/useArmazenamento';
import type { Agendamento as TAgendamento } from './types';

export type Aba = 'inicio' | 'pecas' | 'eletricistas' | 'agendar' | 'orcamento';

const ABAS: { id: Aba; rotulo: string }[] = [
  { id: 'inicio', rotulo: 'Início' },
  { id: 'pecas', rotulo: 'Autopeças' },
  { id: 'eletricistas', rotulo: 'Eletricistas' },
  { id: 'agendar', rotulo: 'Agendar' },
  { id: 'orcamento', rotulo: 'Orçamento' },
];

const abaDoHash = (): Aba => {
  const h = window.location.hash.replace('#', '') as Aba;
  return ABAS.some((a) => a.id === h) ? h : 'inicio';
};

export default function App() {
  const [aba, setAba] = useState<Aba>(abaDoHash);
  const [carrinho, setCarrinho] = useArmazenamento<ItemPeca[]>('ae-sj:carrinho', []);
  const [agendamentos, setAgendamentos] = useArmazenamento<TAgendamento[]>('ae-sj:agendamentos', []);
  const [preSelecao, setPreSelecao] = useState<PreSelecao>({});
  const [chaveAgendamento, setChaveAgendamento] = useState(0);

  useEffect(() => {
    const aoMudar = () => setAba(abaDoHash());
    window.addEventListener('hashchange', aoMudar);
    return () => window.removeEventListener('hashchange', aoMudar);
  }, []);

  const irPara = (nova: Aba) => {
    window.location.hash = nova;
    setAba(nova);
    window.scrollTo({ top: 0 });
  };

  const agendarCom = (sel: PreSelecao) => {
    setPreSelecao(sel);
    setChaveAgendamento((k) => k + 1);
    irPara('agendar');
  };

  const itensCarrinho = carrinho.reduce((t, i) => t + i.quantidade, 0);

  return (
    <>
      <header className="cabecalho">
        <div className="marca" onClick={() => irPara('inicio')}>
          <span className="logo">⚡</span>
          <div>
            <h1>{LOJA.nome}</h1>
            <small>{LOJA.slogan}</small>
          </div>
        </div>
        <nav>
          {ABAS.map((a) => (
            <button key={a.id} className={a.id === aba ? 'ativa' : ''} onClick={() => irPara(a.id)}>
              {a.rotulo}
              {a.id === 'pecas' && itensCarrinho > 0 && <span className="badge">{itensCarrinho}</span>}
            </button>
          ))}
        </nav>
      </header>

      <main>
        {aba === 'inicio' && <Inicio irPara={irPara} />}
        {aba === 'pecas' && <Autopecas carrinho={carrinho} setCarrinho={setCarrinho} />}
        {aba === 'eletricistas' && <Eletricistas agendarCom={(eletricistaId) => agendarCom({ eletricistaId })} />}
        {aba === 'agendar' && (
          <Agendamento key={chaveAgendamento} agendamentos={agendamentos} setAgendamentos={setAgendamentos} preSelecao={preSelecao} />
        )}
        {aba === 'orcamento' && <OrcamentoPrevio agendar={(servicoIds, porte) => agendarCom({ servicoIds, porte })} />}
      </main>

      <footer className="rodape">
        {LOJA.nome} · {LOJA.endereco} · {LOJA.telefone}
      </footer>
    </>
  );
}
