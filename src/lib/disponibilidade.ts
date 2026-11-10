import { DURACAO_SLOT_MIN } from '../config';
import type { Agendamento, Eletricista } from '../types';
import { dataISO, deMinutos, diaSemana, paraMinutos } from './datas';

export function estaTrabalhando(eletricista: Eletricista, agora: Date): boolean {
  const intervalos = eletricista.expediente[diaSemana(dataISO(agora))] ?? [];
  const minutos = agora.getHours() * 60 + agora.getMinutes();
  return intervalos.some((i) => minutos >= paraMinutos(i.inicio) && minutos < paraMinutos(i.fim));
}

export function trabalhaNoDia(eletricista: Eletricista, iso: string): boolean {
  return (eletricista.expediente[diaSemana(iso)] ?? []).length > 0;
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
      return [inicio, inicio + Math.max(1, a.duracaoHoras) * 60] as const;
    });

  const fimDoDia = Math.max(0, ...intervalos.map((i) => paraMinutos(i.fim)));
  const livres: string[] = [];
  for (const intervalo of intervalos) {
    const fim = paraMinutos(intervalo.fim);
    for (let t = paraMinutos(intervalo.inicio); t + DURACAO_SLOT_MIN <= fim; t += DURACAO_SLOT_MIN) {
      if (t <= minutoAtual) continue;
      // Serviços longos podem continuar após o intervalo de almoço, mas devem terminar no mesmo dia.
      const terminoEstimado = t + duracao;
      if (terminoEstimado > fimDoDia) continue;
      const conflito = ocupados.some(([ini, fimOcup]) => t < fimOcup && terminoEstimado > ini);
      if (!conflito) livres.push(deMinutos(t));
    }
  }
  return livres;
}
