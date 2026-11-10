import { describe, expect, it } from 'vitest';
import type { Agendamento, Eletricista } from '../types';
import { estaTrabalhando, horariosDisponiveis, trabalhaNoDia } from './disponibilidade';

const eletricista: Eletricista = {
  id: 'e1',
  nome: 'Teste',
  especialidades: [],
  telefone: '',
  whatsapp: '',
  expediente: {
    1: [
      { inicio: '08:00', fim: '12:00' },
      { inicio: '13:00', fim: '15:00' },
    ],
  },
};

const agendamento = (hora: string, duracaoHoras = 1): Agendamento => ({
  id: hora,
  criadoEm: '',
  cliente: '',
  telefone: '',
  veiculo: '',
  placa: '',
  porte: 'popular',
  servicoIds: [],
  resumo: '',
  eletricistaId: 'e1',
  data: '2026-11-16',
  hora,
  estimativaMin: 0,
  estimativaMax: 0,
  duracaoHoras,
});

// 2026-11-16 é segunda-feira
const domingoAnterior = new Date(2026, 10, 15, 10, 0);

describe('horariosDisponiveis', () => {
  it('lista os horários do expediente', () => {
    expect(horariosDisponiveis(eletricista, '2026-11-16', [], domingoAnterior)).toEqual([
      '08:00', '09:00', '10:00', '11:00', '13:00', '14:00',
    ]);
  });

  it('não retorna horários em dias sem expediente', () => {
    expect(horariosDisponiveis(eletricista, '2026-11-17', [], domingoAnterior)).toEqual([]);
    expect(trabalhaNoDia(eletricista, '2026-11-17')).toBe(false);
  });

  it('remove horários já agendados, considerando a duração', () => {
    const livres = horariosDisponiveis(eletricista, '2026-11-16', [agendamento('09:00', 2)], domingoAnterior);
    expect(livres).toEqual(['08:00', '11:00', '13:00', '14:00']);
  });

  it('remove horários que conflitariam com a duração do novo serviço', () => {
    const livres = horariosDisponiveis(eletricista, '2026-11-16', [agendamento('11:00')], domingoAnterior, 2);
    expect(livres).toEqual(['08:00', '09:00', '13:00']);
  });

  it('ignora horários que já passaram no dia de hoje', () => {
    const agora = new Date(2026, 10, 16, 10, 30);
    expect(horariosDisponiveis(eletricista, '2026-11-16', [], agora)).toEqual(['11:00', '13:00', '14:00']);
  });

  it('não retorna horários para datas passadas', () => {
    const agora = new Date(2026, 10, 17, 8, 0);
    expect(horariosDisponiveis(eletricista, '2026-11-16', [], agora)).toEqual([]);
  });
});

describe('estaTrabalhando', () => {
  it('indica se o eletricista está no expediente', () => {
    expect(estaTrabalhando(eletricista, new Date(2026, 10, 16, 9, 0))).toBe(true);
    expect(estaTrabalhando(eletricista, new Date(2026, 10, 16, 12, 30))).toBe(false);
    expect(estaTrabalhando(eletricista, new Date(2026, 10, 17, 9, 0))).toBe(false);
  });
});
