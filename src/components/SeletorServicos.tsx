import { SERVICOS } from '../data/servicos';
import { formatarMoeda } from '../lib/formato';

interface Props {
  selecionados: string[];
  onChange: (ids: string[]) => void;
}

export function SeletorServicos({ selecionados, onChange }: Props) {
  const alternar = (id: string) =>
    onChange(selecionados.includes(id) ? selecionados.filter((s) => s !== id) : [...selecionados, id]);

  return (
    <div className="lista-servicos">
      {SERVICOS.map((s) => (
        <label key={s.id} className={selecionados.includes(s.id) ? 'servico selecionado' : 'servico'}>
          <input type="checkbox" checked={selecionados.includes(s.id)} onChange={() => alternar(s.id)} />
          <span>
            <strong>{s.nome}</strong>
            <small className="texto-suave">{s.descricao}</small>
          </span>
          <small className="faixa">
            {formatarMoeda(s.maoDeObraMin)}–{formatarMoeda(s.maoDeObraMax)}
          </small>
        </label>
      ))}
    </div>
  );
}
