import { useMemo, useState } from 'react';
import { LOJA } from '../config';
import { PECAS } from '../data/pecas';
import { formatarMoeda, linkWhatsApp } from '../lib/formato';
import type { ItemPeca } from '../lib/orcamento';

interface Props {
  carrinho: ItemPeca[];
  setCarrinho: (itens: ItemPeca[]) => void;
}

const CATEGORIAS = ['Todas', ...Array.from(new Set(PECAS.map((p) => p.categoria)))];

export function Autopecas({ carrinho, setCarrinho }: Props) {
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState('Todas');
  const [nome, setNome] = useState('');

  const filtradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return PECAS.filter(
      (p) =>
        (categoria === 'Todas' || p.categoria === categoria) &&
        (!termo || p.nome.toLowerCase().includes(termo) || p.descricao.toLowerCase().includes(termo)),
    );
  }, [busca, categoria]);

  const quantidade = (id: string) => carrinho.find((i) => i.id === id)?.quantidade ?? 0;

  const alterar = (id: string, delta: number) => {
    const peca = PECAS.find((p) => p.id === id);
    if (!peca) return;
    const nova = Math.min(peca.estoque, Math.max(0, quantidade(id) + delta));
    const resto = carrinho.filter((i) => i.id !== id);
    setCarrinho(nova > 0 ? [...resto, { id, quantidade: nova }] : resto);
  };

  const itens = carrinho
    .map((i) => ({ ...i, peca: PECAS.find((p) => p.id === i.id) }))
    .filter((i): i is ItemPeca & { peca: (typeof PECAS)[number] } => !!i.peca);
  const total = itens.reduce((t, i) => t + i.peca.preco * i.quantidade, 0);

  const mensagemPedido = [
    `Olá! Gostaria de fazer um pedido na ${LOJA.nome}:`,
    ...itens.map((i) => `• ${i.quantidade}x ${i.peca.nome} — ${formatarMoeda(i.peca.preco * i.quantidade)}`),
    `Total: ${formatarMoeda(total)}`,
    nome ? `Nome: ${nome}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  return (
    <section>
      <h2>Autopeças</h2>
      <div className="filtros">
        <input type="search" placeholder="Buscar peça..." value={busca} onChange={(e) => setBusca(e.target.value)} />
        <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
          {CATEGORIAS.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="layout-pecas">
        <div className="grade-pecas">
          {filtradas.length === 0 && <p className="texto-suave">Nenhuma peça encontrada.</p>}
          {filtradas.map((p) => (
            <article key={p.id} className="cartao peca">
              <span className="etiqueta">{p.categoria}</span>
              <h3>{p.nome}</h3>
              <p className="texto-suave">{p.descricao}</p>
              <p className="preco">{formatarMoeda(p.preco)}</p>
              <p className={p.estoque > 0 ? 'estoque' : 'estoque esgotado'}>
                {p.estoque > 0 ? `${p.estoque} em estoque` : 'Esgotado'}
              </p>
              {quantidade(p.id) === 0 ? (
                <button className="btn" disabled={p.estoque === 0} onClick={() => alterar(p.id, 1)}>
                  Adicionar
                </button>
              ) : (
                <div className="contador">
                  <button className="btn btn-claro" onClick={() => alterar(p.id, -1)} aria-label="Diminuir">
                    −
                  </button>
                  <span>{quantidade(p.id)}</span>
                  <button className="btn btn-claro" onClick={() => alterar(p.id, 1)} aria-label="Aumentar">
                    +
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>

        <aside className="cartao carrinho">
          <h3>🛒 Carrinho</h3>
          {itens.length === 0 ? (
            <p className="texto-suave">Seu carrinho está vazio.</p>
          ) : (
            <>
              <ul>
                {itens.map((i) => (
                  <li key={i.id}>
                    <span>
                      {i.quantidade}x {i.peca.nome}
                    </span>
                    <span>{formatarMoeda(i.peca.preco * i.quantidade)}</span>
                  </li>
                ))}
              </ul>
              <p className="total">
                Total: <strong>{formatarMoeda(total)}</strong>
              </p>
              <input placeholder="Seu nome" value={nome} onChange={(e) => setNome(e.target.value)} />
              <a className="btn btn-destaque" href={linkWhatsApp(LOJA.whatsapp, mensagemPedido)} target="_blank" rel="noreferrer">
                Enviar pedido pelo WhatsApp
              </a>
              <button className="btn btn-link" onClick={() => setCarrinho([])}>
                Esvaziar carrinho
              </button>
            </>
          )}
        </aside>
      </div>
    </section>
  );
}
