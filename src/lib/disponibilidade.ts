import { DURACAO_SLOT_MIN } from '../config';
import type { Agendamento, Eletricista, Intervalo } from '../types';
import { dataISO, deMinutos, diaSemana, paraMinutos } from './datas';

export function estaTrabalhando(eletricista: Eletricista, agora: Date): boolean {
  const intervalos = eletricista.expediente[diaSemana(dataISO(agora))] ?? [];
  const minutos = agora.getHours() * 60 + agora.getMinutes();
  return intervalos.some((i) => minutos >= paraMinutos(i.inicio) && minutos < paraMinutos(i.fim));
}

export function trabalhaNoDia(eletricista: Eletricista, iso: string): boolean {
  return (eletricista.expediente[diaSemana(iso)] ?? []).length > 0;
}

// Horário (em minutos) em que um serviço iniciado em `inicio` termina, contando só o tempo de expediente
// (o intervalo de almoço não conta). Retorna null se o serviço não couber no expediente do dia.
export function terminoNoExpediente(intervalos: Intervalo[], inicio: number, duracaoMin: number): number | null {
  let restante = duracaoMin;
  for (const intervalo of intervalos) {
    const fim = paraMinutos(intervalo.fim);
    const ini = Math.max(inicio, paraMinutos(intervalo.inicio));
    if (ini >= fim) continue;
    if (ini + restante <= fim) return ini + restante;
    restante -= fim - ini;
  }
  return null;
}

export function horariosDisponiveis(
  eletricista: Eletricista,
  iso: string,
  agendamentos: Agendamento[],
  agora: Date,
  duracaoHoras = 1,
): string[] {
  const intervalos = eletricista.expediente[diaSemana(iso)] ?? [];
  const duracao = Math.max(1, duracaoHoras) * 60;
  const hoje = dataISO(agora);
  if (iso < hoje) return [];
  const minutoAtual = iso === hoje ? agora.getHours() * 60 + agora.getMinutes() : -1;

  const ocupados = agendamentos
    .filter((a) => a.eletricistaId === eletricista.id && a.data === iso)
    .map((a) => {
      const inicio = paraMinutos(a.hora);
      const duracaoOcupada = Math.max(1, a.duracaoHoras) * 60;
      return [inicio, terminoNoExpediente(intervalos, inicio, duracaoOcupada) ?? inicio + duracaoOcupada] as const;
    });

  const livres: string[] = [];
  for (const intervalo of intervalos) {
    const fim = paraMinutos(intervalo.fim);
    for (let t = paraMinutos(intervalo.inicio); t + DURACAO_SLOT_MIN <= fim; t += DURACAO_SLOT_MIN) {
      if (t <= minutoAtual) continue;
      const terminoEstimado = terminoNoExpediente(intervalos, t, duracao);
      if (terminoEstimado === null) continue;
      const conflito = ocupados.some(([ini, fimOcup]) => t < fimOcup && terminoEstimado > ini);
      if (!conflito) livres.push(deMinutos(t));
    }
  }
  return livres;
}
