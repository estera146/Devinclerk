import type { Peca } from '../types';

export const PECAS: Peca[] = [
  { id: 'bat60', nome: 'Bateria 60Ah', categoria: 'Baterias', preco: 489.9, estoque: 8, descricao: 'Bateria selada livre de manutenção, 18 meses de garantia.' },
  { id: 'bat45', nome: 'Bateria 45Ah', categoria: 'Baterias', preco: 399.9, estoque: 5, descricao: 'Ideal para carros populares, 12 meses de garantia.' },
  { id: 'alt90', nome: 'Alternador 90A (recondicionado)', categoria: 'Partida e carga', preco: 650, estoque: 3, descricao: 'Alternador recondicionado com garantia de 6 meses.' },
  { id: 'mot-part', nome: 'Motor de partida', categoria: 'Partida e carga', preco: 720, estoque: 2, descricao: 'Motor de partida para linha VW/Fiat/GM.' },
  { id: 'reg-volt', nome: 'Regulador de voltagem', categoria: 'Partida e carga', preco: 95, estoque: 10, descricao: 'Regulador para alternadores Bosch e Valeo.' },
  { id: 'vela', nome: 'Jogo de velas de ignição (4 un.)', categoria: 'Ignição', preco: 120, estoque: 15, descricao: 'Velas de níquel para motores 1.0 a 2.0.' },
  { id: 'bobina', nome: 'Bobina de ignição', categoria: 'Ignição', preco: 210, estoque: 6, descricao: 'Bobina compatível com diversos modelos.' },
  { id: 'cabo-vela', nome: 'Cabos de vela', categoria: 'Ignição', preco: 89.9, estoque: 9, descricao: 'Jogo de cabos de vela de silicone.' },
  { id: 'lamp-h4', nome: 'Lâmpada H4 (par)', categoria: 'Iluminação', preco: 45, estoque: 30, descricao: 'Lâmpadas halógenas 60/55W.' },
  { id: 'led-h7', nome: 'Kit LED H7', categoria: 'Iluminação', preco: 159.9, estoque: 12, descricao: 'Kit LED 6000K com reator.' },
  { id: 'farol', nome: 'Farol dianteiro', categoria: 'Iluminação', preco: 380, estoque: 4, descricao: 'Farol dianteiro (consultar modelo).' },
  { id: 'fusiveis', nome: 'Kit de fusíveis sortidos', categoria: 'Elétrica geral', preco: 25, estoque: 40, descricao: 'Kit com 50 fusíveis lâmina.' },
  { id: 'rele', nome: 'Relé auxiliar 12V', categoria: 'Elétrica geral', preco: 18, estoque: 25, descricao: 'Relé 4 terminais 40A.' },
  { id: 'motor-vidro', nome: 'Motor de vidro elétrico', categoria: 'Conforto', preco: 240, estoque: 5, descricao: 'Motor de máquina de vidro (consultar lado e modelo).' },
  { id: 'trava', nome: 'Atuador de trava elétrica', categoria: 'Conforto', preco: 75, estoque: 10, descricao: 'Atuador universal de 2 fios.' },
  { id: 'sensor-temp', nome: 'Sensor de temperatura', categoria: 'Sensores', preco: 65, estoque: 7, descricao: 'Sensor de temperatura do motor.' },
  { id: 'sonda', nome: 'Sonda lambda', categoria: 'Sensores', preco: 290, estoque: 3, descricao: 'Sensor de oxigênio 4 fios.' },
];
