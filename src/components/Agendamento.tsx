import { useMemo, useState, type FormEvent } from 'react';
import { DIAS_AGENDA, LOJA } from '../config';
import { ELETRICISTAS } from '../data/eletricistas';
import { PECAS } from '../data/pecas';
import { PORTES, SERVICOS } from '../data/servicos';
import { formatarData, proximosDias } from '../lib/datas';
import { horariosDisponiveis } from '../lib/disponibilidade';
import { formatarMoeda, linkWhatsApp } from '../lib/formato';
import { calcularOrcamento, type ItemPeca } from '../lib/orcamento';
import type { Agendamento as TAgendamento, PorteVeiculo } from '../types';
import { ResumoOrcamento } from './ResumoOrcamento';
import { SeletorServicos } from './SeletorServicos';

export interface PreSelecao {
  eletricistaId?: string;
  servicoIds?: string[];
  porte?: PorteVeiculo;
  pecas?: ItemPeca[];
}

interface Props {
  agendamentos: TAgendamento[];
  setAgendamentos: (a: TAgendamento[]) => void;
  preSelecao: PreSelecao;
}

const QUALQUER = 'qualquer';
const LIMITE_RESUMO = 500;

function descreverPecas(itens: ItemPeca[] = []): string[] {
  return itens.flatMap((i) => {
    const peca = PECAS.find((p) => p.id === i.id);
    return peca ? [`${i.quantidade}x ${peca.nome}`] : [];
  });
}

function mensagemAgendamento(a: TAgendamento): string {
  const eletricista = ELETRICISTAS.find((e) => e.id === a.eletricistaId);
  const servicos = SERVICOS.filter((s) => a.servicoIds.includes(s.id)).map((s) => s.nome);
  const pecas = descreverPecas(a.pecas);
  return [
    `Olá${eletricista ? `, ${eletricista.nome.split(' ')[0]}` : ''}! Agendamento pela ${LOJA.nome}:`,
    `📅 ${formatarData(a.data)} às ${a.hora}`,
    `👤 ${a.cliente} — ${a.telefone}`,
    `🚗 ${a.veiculo}${a.placa ? ` (placa ${a.placa})` : ''}`,
    servicos.length ? `🔧 Serviços: ${servicos.join(', ')}` : '',
    pecas.length ? `🔩 Peças: ${pecas.join(', ')}` : '',
    `📝 Problema: ${a.resumo}`,
    `💰 Estimativa: ${formatarMoeda(a.estimativaMin)} – ${formatarMoeda(a.estimativaMax)}`,
  ]
    .filter(Boolean)
    .join('\n');
}

function mensagemCancelamento(a: TAgendamento): string {
  return [
    `Olá! Preciso cancelar o agendamento feito pela ${LOJA.nome}:`,
    `📅 ${formatarData(a.data)} às ${a.hora}`,
    `👤 ${a.cliente} — ${a.telefone}`,
    `🚗 ${a.veiculo}${a.placa ? ` (placa ${a.placa})` : ''}`,
  ].join('\n');
}

export function Agendamento({ agendamentos, setAgendamentos, preSelecao }: Props) {
  const [cliente, setCliente] = useState('');
  const [telefone, setTelefone] = useState('');
  const [veiculo, setVeiculo] = useState('');
  const [placa, setPlaca] = useState('');
  const [porte, setPorte] = useState<PorteVeiculo>(preSelecao.porte ?? 'popular');
  const [servicoIds, setServicoIds] = useState<string[]>(preSelecao.servicoIds ?? []);
  const [pecas, setPecas] = useState<ItemPeca[]>(preSelecao.pecas ?? []);
  const [resumo, setResumo] = useState('');
  const [eletricistaId, setEletricistaId] = useState(preSelecao.eletricistaId ?? QUALQUER);
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [erro, setErro] = useState('');
  const [confirmado, setConfirmado] = useState<TAgendamento | null>(null);

  const agora = new Date();
  const orcamento = calcularOrcamento(servicoIds, porte, pecas);
  const dias = useMemo(() => proximosDias(new Date(), DIAS_AGENDA), []);
  const candidatos = eletricistaId === QUALQUER ? ELETRICISTAS : ELETRICISTAS.filter((e) => e.id === eletricistaId);

  const horariosPorEletricista = (dia: string) =>
    candidatos.map((e) => ({ eletricista: e, horarios: horariosDisponiveis(e, dia, agendamentos, agora, orcamento.duracaoHoras) }));

  const horariosDoDia = (dia: string) =>
    Array.from(new Set(horariosPorEletricista(dia).flatMap((h) => h.horarios))).sort();

  const horarios = data ? horariosDoDia(data) : [];

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    setErro('');
    if (!cliente.trim() || !telefone.trim() || !veiculo.trim()) return setErro('Preencha nome, telefone e veículo.');
    if (!resumo.trim()) return setErro('Descreva brevemente o problema do veículo.');
    if (!data || !hora) return setErro('Escolha um dia e horário disponível.');

    const responsavel = horariosPorEletricista(data).find((h) => h.horarios.includes(hora))?.eletricista;
    if (!responsavel) return setErro('Esse horário não está mais disponível. Escolha outro.');

    const novo: TAgendamento = {
      id: crypto.randomUUID(),
      criadoEm: new Date().toISOString(),
      cliente: cliente.trim(),
      telefone: telefone.trim(),
      veiculo: veiculo.trim(),
      placa: placa.trim().toUpperCase(),
      porte,
      servicoIds,
      resumo: resumo.trim(),
      eletricistaId: responsavel.id,
      data,
      hora,
      estimativaMin: orcamento.totalMin,
      estimativaMax: orcamento.totalMax,
      duracaoHoras: orcamento.duracaoHoras,
      pecas,
    };
    setAgendamentos([...agendamentos, novo]);
    setConfirmado(novo);
    setResumo('');
    setData('');
    setHora('');
  };

  const meus = [...agendamentos].sort((a, b) => `${a.data} ${a.hora}`.localeCompare(`${b.data} ${b.hora}`));

  return (
    <section>
      <h2>Agendar atendimento</h2>

      {confirmado && (
        <div className="cartao confirmacao">
          <h3>✅ Agendamento registrado!</h3>
          <p>
            {formatarData(confirmado.data)} às {confirmado.hora} com{' '}
            <strong>{ELETRICISTAS.find((e) => e.id === confirmado.eletricistaId)?.nome}</strong>.
          </p>
          <p>Envie o resumo pelo WhatsApp para confirmar com o eletricista:</p>
          <a
            className="btn btn-destaque"
            href={linkWhatsApp(ELETRICISTAS.find((e) => e.id === confirmado.eletricistaId)?.whatsapp ?? LOJA.whatsapp, mensagemAgendamento(confirmado))}
            target="_blank"
            rel="noreferrer"
          >
            Enviar resumo pelo WhatsApp
          </a>
          <button className="btn btn-link" onClick={() => setConfirmado(null)}>
            Fechar
          </button>
        </div>
      )}

      <form className="layout-orcamento" onSubmit={enviar}>
        <div className="cartao">
          <h3>1. Seus dados e do veículo</h3>
          <div className="grade-campos">
            <label>
              Nome*
              <input value={cliente} onChange={(e) => setCliente(e.target.value)} />
            </label>
            <label>
              Telefone / WhatsApp*
              <input type="tel" value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(11) 90000-0000" />
            </label>
            <label>
              Veículo (marca, modelo e ano)*
              <input value={veiculo} onChange={(e) => setVeiculo(e.target.value)} placeholder="Ex.: Fiat Uno 2015" />
            </label>
            <label>
              Placa
              <input value={placa} onChange={(e) => setPlaca(e.target.value)} placeholder="ABC1D23" maxLength={8} />
            </label>
            <label>
              Tipo de veículo
              <select value={porte} onChange={(e) => setPorte(e.target.value as PorteVeiculo)}>
                {(Object.keys(PORTES) as PorteVeiculo[]).map((p) => (
                  <option key={p} value={p}>
                    {PORTES[p].nome}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <h3>2. Qual é o problema?</h3>
          <label className="campo-bloco">
            Breve resumo do problema*
            <textarea
              rows={4}
              maxLength={LIMITE_RESUMO}
              value={resumo}
              onChange={(e) => setResumo(e.target.value)}
              placeholder="Ex.: O carro não pega de manhã, a luz da bateria fica acesa no painel..."
            />
            <small className="texto-suave">
              {resumo.length}/{LIMITE_RESUMO}
            </small>
          </label>
          <p className="texto-suave">Se souber, marque o tipo de serviço para receber uma estimativa:</p>
          <SeletorServicos selecionados={servicoIds} onChange={setServicoIds} />

          <h3>3. Eletricista, dia e horário</h3>
          <label className="campo-bloco">
            Eletricista
            <select
              value={eletricistaId}
              onChange={(e) => {
                setEletricistaId(e.target.value);
                setHora('');
              }}
            >
              <option value={QUALQUER}>Qualquer eletricista disponível</option>
              {ELETRICISTAS.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nome} — {e.especialidades[0]}
                </option>
              ))}
            </select>
          </label>

          <div className="dias">
            {dias.map((d) => {
              const livres = horariosDoDia(d).length;
              return (
                <button
                  type="button"
                  key={d}
                  disabled={livres === 0}
                  className={d === data ? 'dia selecionado' : 'dia'}
                  onClick={() => {
                    setData(d);
                    setHora('');
                  }}
                >
                  <span>{formatarData(d)}</span>
                  <small>{livres === 0 ? 'Indisponível' : `${livres} horário${livres > 1 ? 's' : ''}`}</small>
                </button>
              );
            })}
          </div>

          {data && (
            <div className="horarios">
              {horarios.map((h) => (
                <button type="button" key={h} className={h === hora ? 'horario selecionado' : 'horario'} onClick={() => setHora(h)}>
                  {h}
                </button>
              ))}
            </div>
          )}
        </div>

        <aside className="cartao">
          <h3>Resumo</h3>
          {data && hora ? (
            <p>
              📅 {formatarData(data)} às <strong>{hora}</strong>
            </p>
          ) : (
            <p className="texto-suave">Escolha um dia e horário.</p>
          )}
          {pecas.length > 0 && (
            <ul className="lista-pecas-orcamento">
              {pecas.map((item) => {
                const peca = PECAS.find((p) => p.id === item.id);
                if (!peca) return null;
                return (
                  <li key={item.id}>
                    <span>
                      {item.quantidade}x {peca.nome}
                    </span>
                    <button type="button" className="btn btn-link" onClick={() => setPecas(pecas.filter((p) => p.id !== item.id))}>
                      remover
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          {servicoIds.length > 0 || pecas.length > 0 ? (
            <ResumoOrcamento orcamento={orcamento} />
          ) : (
            <p className="texto-suave">Selecione um serviço para ver o orçamento prévio, ou deixe o eletricista avaliar.</p>
          )}
          {erro && <p className="erro">{erro}</p>}
          <button type="submit" className="btn btn-destaque largura-total">
            Confirmar agendamento
          </button>
        </aside>
      </form>

      <h2>Meus agendamentos</h2>
      {meus.length === 0 ? (
        <p className="texto-suave">Nenhum agendamento ainda.</p>
      ) : (
        <div className="lista-agendamentos">
          {meus.map((a) => {
            const e = ELETRICISTAS.find((x) => x.id === a.eletricistaId);
            return (
              <article key={a.id} className="cartao agendamento">
                <div>
                  <strong>
                    {formatarData(a.data)} às {a.hora}
                  </strong>
                  <p>
                    {a.veiculo} {a.placa && `· ${a.placa}`} — com {e?.nome}
                  </p>
                  <p className="texto-suave">{a.resumo}</p>
                  {a.estimativaMax > 0 && (
                    <p className="texto-suave">
                      Estimativa: {formatarMoeda(a.estimativaMin)} – {formatarMoeda(a.estimativaMax)}
                    </p>
                  )}
                </div>
                <div className="acoes">
                  <a className="btn btn-claro" href={linkWhatsApp(e?.whatsapp ?? LOJA.whatsapp, mensagemAgendamento(a))} target="_blank" rel="noreferrer">
                    WhatsApp
                  </a>
                  <a
                    className="btn btn-perigo"
                    href={linkWhatsApp(e?.whatsapp ?? LOJA.whatsapp, mensagemCancelamento(a))}
                    target="_blank"
                    rel="noreferrer"
                    title="Cancela o agendamento e avisa o eletricista pelo WhatsApp"
                    onClick={() => setAgendamentos(agendamentos.filter((x) => x.id !== a.id))}
                  >
                    Cancelar e avisar
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
