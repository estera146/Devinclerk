export type DiaSemana = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface Intervalo {
  inicio: string;
  fim: string;
}

export type Expediente = Partial<Record<DiaSemana, Intervalo[]>>;

export interface Eletricista {
  id: string;
  nome: string;
  especialidades: string[];
  telefone: string;
  whatsapp: string;
  expediente: Expediente;
}

export interface Peca {
  id: string;
  nome: string;
  categoria: string;
  preco: number;
  estoque: number;
  descricao: string;
}

export interface Servico {
  id: string;
  nome: string;
  descricao: string;
  maoDeObraMin: number;
  maoDeObraMax: number;
  duracaoHoras: number;
  pecas?: { id: string; quantidade: number }[];
}

export type PorteVeiculo = 'popular' | 'medio' | 'importado';

export interface Agendamento {
  id: string;
  criadoEm: string;
  cliente: string;
  telefone: string;
  veiculo: string;
  placa: string;
  porte: PorteVeiculo;
  servicoIds: string[];
  resumo: string;
  eletricistaId: string;
  data: string;
  hora: string;
  estimativaMin: number;
  estimativaMax: number;
  duracaoHoras: number;
  pecas?: { id: string; quantidade: number }[];
}
