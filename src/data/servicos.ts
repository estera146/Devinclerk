import type { PorteVeiculo, Servico } from '../types';

export const SERVICOS: Servico[] = [
  { id: 'diagnostico', nome: 'Diagnóstico com scanner', descricao: 'Leitura de falhas da injeção e módulos.', maoDeObraMin: 80, maoDeObraMax: 150, duracaoHoras: 1 },
  { id: 'nao-liga', nome: 'Carro não liga / problema de partida', descricao: 'Verificação de bateria, motor de partida e chave.', maoDeObraMin: 100, maoDeObraMax: 250, duracaoHoras: 1 },
  { id: 'bateria', nome: 'Troca de bateria', descricao: 'Teste do sistema de carga e instalação.', maoDeObraMin: 0, maoDeObraMax: 40, duracaoHoras: 1 },
  { id: 'alternador', nome: 'Reparo de alternador', descricao: 'Bateria descarregando, luz de bateria acesa.', maoDeObraMin: 150, maoDeObraMax: 350, duracaoHoras: 2 },
  { id: 'iluminacao', nome: 'Faróis e lanternas', descricao: 'Lâmpadas queimadas, regulagem e chicote.', maoDeObraMin: 40, maoDeObraMax: 150, duracaoHoras: 1 },
  { id: 'vidros-travas', nome: 'Vidros e travas elétricas', descricao: 'Vidro não sobe/desce, trava não funciona.', maoDeObraMin: 120, maoDeObraMax: 300, duracaoHoras: 2 },
  { id: 'ar', nome: 'Elétrica do ar-condicionado', descricao: 'Ventilador, compressor e comandos.', maoDeObraMin: 150, maoDeObraMax: 400, duracaoHoras: 2 },
  { id: 'injecao', nome: 'Injeção eletrônica', descricao: 'Falhas, marcha lenta irregular, luz de injeção.', maoDeObraMin: 200, maoDeObraMax: 500, duracaoHoras: 3 },
  { id: 'som-alarme', nome: 'Som e alarme', descricao: 'Instalação ou reparo de som, alarme e acessórios.', maoDeObraMin: 100, maoDeObraMax: 300, duracaoHoras: 2 },
  { id: 'curto', nome: 'Curto-circuito / pane elétrica', descricao: 'Fusíveis queimando, chicote danificado.', maoDeObraMin: 150, maoDeObraMax: 450, duracaoHoras: 3 },
];

export const PORTES: Record<PorteVeiculo, { nome: string; fator: number }> = {
  popular: { nome: 'Popular (ex.: Gol, Onix, HB20)', fator: 1 },
  medio: { nome: 'Médio / SUV (ex.: Corolla, Compass)', fator: 1.25 },
  importado: { nome: 'Importado / Premium', fator: 1.6 },
};
