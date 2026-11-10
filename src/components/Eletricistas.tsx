import { ELETRICISTAS } from '../data/eletricistas';
import { NOMES_DIAS } from '../lib/datas';
import { estaTrabalhando } from '../lib/disponibilidade';
import { linkTelefone, linkWhatsApp } from '../lib/formato';
import type { DiaSemana, Eletricista } from '../types';

interface Props {
  agendarCom: (eletricistaId: string) => void;
}

const ORDEM_DIAS: DiaSemana[] = [1, 2, 3, 4, 5, 6, 0];

function textoExpediente(e: Eletricista, dia: DiaSemana) {
  const intervalos = e.expediente[dia];
  if (!intervalos?.length) return 'Folga';
  return intervalos.map((i) => `${i.inicio}–${i.fim}`).join(' · ');
}

export function Eletricistas({ agendarCom }: Props) {
  const agora = new Date();
  return (
    <section>
      <h2>Nossos eletricistas</h2>
      <div className="grade-eletricistas">
        {ELETRICISTAS.map((e) => {
          const ativo = estaTrabalhando(e, agora);
          return (
            <article key={e.id} className="cartao eletricista">
              <div className="eletricista-topo">
                <div className="avatar">{e.nome.split(' ').map((n) => n[0]).join('').slice(0, 2)}</div>
                <div>
                  <h3>{e.nome}</h3>
                  <span className={ativo ? 'status ativo' : 'status'}>{ativo ? '● Atendendo agora' : '● Fora do expediente'}</span>
                </div>
              </div>
              <div className="especialidades">
                {e.especialidades.map((s) => (
                  <span key={s} className="etiqueta">
                    {s}
                  </span>
                ))}
              </div>
              <table className="tabela-horarios">
                <tbody>
                  {ORDEM_DIAS.map((d) => (
                    <tr key={d} className={d === agora.getDay() ? 'hoje' : ''}>
                      <td>{NOMES_DIAS[d]}</td>
                      <td>{textoExpediente(e, d)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="acoes">
                <a className="btn btn-claro" href={linkTelefone(e.telefone)}>
                  📞 {e.telefone}
                </a>
                <a className="btn btn-claro" href={linkWhatsApp(e.whatsapp, `Olá, ${e.nome.split(' ')[0]}!`)} target="_blank" rel="noreferrer">
                  WhatsApp
                </a>
                <button className="btn" onClick={() => agendarCom(e.id)}>
                  Agendar com {e.nome.split(' ')[0]}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
