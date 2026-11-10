import { PECAS } from '../data/pecas';
import { PORTES, SERVICOS } from '../data/servicos';
import type { PorteVeiculo } from '../types';

export interface ItemPeca {
  id: string;
  quantidade: number;
}

export interface Orcamento {
  maoDeObraMin: number;
  maoDeObraMax: number;
  pecas: number;
  totalMin: number;
  totalMax: number;
  duracaoHoras: number;
}

const arredondar = (v: number) => Math.round(v * 100) / 100;

export function calcularOrcamento(servicoIds: string[], porte: PorteVeiculo, pecas: ItemPeca[] = []): Orcamento {
  const fator = PORTES[porte].fator;
  const servicos = SERVICOS.filter((s) => servicoIds.includes(s.id));
  const maoDeObraMin = arredondar(servicos.reduce((t, s) => t + s.maoDeObraMin, 0) * fator);
  const maoDeObraMax = arredondar(servicos.reduce((t, s) => t + s.maoDeObraMax, 0) * fator);
  const totalPecas = arredondar(
    pecas.reduce((t, item) => {
      const peca = PECAS.find((p) => p.id === item.id);
      return peca ? t + peca.preco * item.quantidade : t;
    }, 0),
  );
  const duracaoHoras = Math.max(1, servicos.reduce((t, s) => t + s.duracaoHoras, 0));
  return {
    maoDeObraMin,
    maoDeObraMax,
    pecas: totalPecas,
    totalMin: arredondar(maoDeObraMin + totalPecas),
    totalMax: arredondar(maoDeObraMax + totalPecas),
    duracaoHoras,
  };
}
