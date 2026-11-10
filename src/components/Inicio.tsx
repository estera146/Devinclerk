import { LOJA } from '../config';
import type { Aba } from '../App';
import { linkTelefone, linkWhatsApp } from '../lib/formato';

interface Props {
  irPara: (aba: Aba) => void;
}

const ATALHOS: { aba: Aba; icone: string; titulo: string; texto: string }[] = [
  { aba: 'pecas', icone: '🔋', titulo: 'Autopeças', texto: 'Baterias, alternadores, lâmpadas e mais.' },
  { aba: 'eletricistas', icone: '👨‍🔧', titulo: 'Eletricistas', texto: 'Conheça a equipe, horários e contatos.' },
  { aba: 'agendar', icone: '📅', titulo: 'Agendar atendimento', texto: 'Conte o problema e escolha o horário.' },
  { aba: 'orcamento', icone: '🧮', titulo: 'Orçamento prévio', texto: 'Simule o valor estimado do conserto.' },
];

export function Inicio({ irPara }: Props) {
  return (
    <section>
      <div className="hero">
        <h2>Bem-vindo à {LOJA.nome}</h2>
        <p>{LOJA.slogan}</p>
        <div className="hero-acoes">
          <button className="btn btn-destaque" onClick={() => irPara('agendar')}>
            Agendar atendimento
          </button>
          <a className="btn btn-claro" href={linkWhatsApp(LOJA.whatsapp, `Olá, ${LOJA.nome}!`)} target="_blank" rel="noreferrer">
            Falar no WhatsApp
          </a>
        </div>
      </div>

      <div className="grade-atalhos">
        {ATALHOS.map((a) => (
          <button key={a.aba} className="cartao atalho" onClick={() => irPara(a.aba)}>
            <span className="atalho-icone">{a.icone}</span>
            <strong>{a.titulo}</strong>
            <span className="texto-suave">{a.texto}</span>
          </button>
        ))}
      </div>

      <div className="cartao info-loja">
        <p>📍 {LOJA.endereco}</p>
        <p>🕒 {LOJA.horario}</p>
        <p>
          📞 <a href={linkTelefone(LOJA.telefone)}>{LOJA.telefone}</a>
        </p>
      </div>
    </section>
  );
}
