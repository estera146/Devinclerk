import { describe, expect, it } from 'vitest';
import { calcularOrcamento } from './orcamento';

describe('calcularOrcamento', () => {
  it('soma mão de obra dos serviços para veículo popular', () => {
    const o = calcularOrcamento(['diagnostico', 'alternador'], 'popular');
    expect(o.maoDeObraMin).toBe(230);
    expect(o.maoDeObraMax).toBe(500);
    expect(o.pecas).toBe(0);
    expect(o.duracaoHoras).toBe(3);
  });

  it('aplica o fator do porte do veículo apenas na mão de obra', () => {
    const o = calcularOrcamento(['diagnostico'], 'importado', [{ id: 'bat60', quantidade: 1 }]);
    expect(o.maoDeObraMin).toBe(128);
    expect(o.maoDeObraMax).toBe(240);
    expect(o.pecas).toBe(489.9);
    expect(o.totalMin).toBe(617.9);
    expect(o.totalMax).toBe(729.9);
  });

  it('retorna zero quando nada é selecionado, com duração mínima de 1h', () => {
    const o = calcularOrcamento([], 'medio');
    expect(o.totalMin).toBe(0);
    expect(o.totalMax).toBe(0);
    expect(o.duracaoHoras).toBe(1);
  });
});
