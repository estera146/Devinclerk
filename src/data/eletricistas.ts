import type { Eletricista } from '../types';

const manhaTarde = [
  { inicio: '08:00', fim: '12:00' },
  { inicio: '13:00', fim: '18:00' },
];

export const ELETRICISTAS: Eletricista[] = [
  {
    id: 'joao',
    nome: 'João Silva',
    especialidades: ['Injeção eletrônica', 'Diagnóstico por scanner', 'Partida e alternador'],
    telefone: '(11) 98888-1111',
    whatsapp: '5511988881111',
    expediente: {
      1: manhaTarde,
      2: manhaTarde,
      3: manhaTarde,
      4: manhaTarde,
      5: manhaTarde,
      6: [{ inicio: '08:00', fim: '12:00' }],
    },
  },
  {
    id: 'carlos',
    nome: 'Carlos Pereira',
    especialidades: ['Ar-condicionado', 'Vidros e travas elétricas', 'Som e alarme'],
    telefone: '(11) 98888-2222',
    whatsapp: '5511988882222',
    expediente: {
      1: manhaTarde,
      2: manhaTarde,
      3: manhaTarde,
      4: manhaTarde,
      5: manhaTarde,
    },
  },
  {
    id: 'marcos',
    nome: 'Marcos Oliveira',
    especialidades: ['Baterias', 'Iluminação e faróis', 'Painel e chicotes'],
    telefone: '(11) 98888-3333',
    whatsapp: '5511988883333',
    expediente: {
      2: [{ inicio: '10:00', fim: '19:00' }],
      3: [{ inicio: '10:00', fim: '19:00' }],
      4: [{ inicio: '10:00', fim: '19:00' }],
      5: [{ inicio: '10:00', fim: '19:00' }],
      6: [{ inicio: '08:00', fim: '14:00' }],
    },
  },
];
