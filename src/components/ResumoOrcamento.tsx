import { formatarMoeda } from '../lib/formato';
import type { Orcamento } from '../lib/orcamento';

export function ResumoOrcamento({ orcamento }: { orcamento: Orcamento }) {
  return (
    <div className="resumo-orcamento">
      <div>
        <span>Mão de obra</span>
        <span>
          {formatarMoeda(orcamento.maoDeObraMin)} – {formatarMoeda(orcamento.maoDeObraMax)}
        </span>
      </div>
      <div>
        <span>Peças</span>
        <span>{formatarMoeda(orcamento.pecas)}</span>
      </div>
      <div className="resumo-total">
        <span>Total estimado</span>
        <strong>
          {formatarMoeda(orcamento.totalMin)} – {formatarMoeda(orcamento.totalMax)}
        </strong>
      </div>
      <div>
        <span>Tempo estimado</span>
        <span>{orcamento.duracaoHoras}h</span>
      </div>
      <p className="aviso">
        * Valores aproximados. O preço final é confirmado após a avaliação do veículo pelo eletricista.
      </p>
    </div>
  );
}
