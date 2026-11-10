# Auto Elétrica São Jorge

Aplicativo web (responsivo para celular) da Auto Elétrica São Jorge.

## Funcionalidades

- **Autopeças** – catálogo com busca, categorias, preço e estoque; carrinho e envio do pedido pelo WhatsApp da loja.
- **Eletricistas** – especialidades, horários de trabalho por dia, status "atendendo agora" e contato (telefone e WhatsApp).
- **Agendar atendimento** – dados do cliente e do veículo, breve resumo do problema, escolha do eletricista (ou qualquer um disponível), do dia e do horário livre conforme o expediente. O resumo é enviado pelo WhatsApp do eletricista.
- **Orçamento prévio** – estimativa de mão de obra (ajustada pelo tipo de veículo) + peças do catálogo.

Os agendamentos e o carrinho ficam salvos no navegador (localStorage).

## Como personalizar

| O quê | Arquivo |
| --- | --- |
| Nome, endereço, telefone e WhatsApp da loja | `src/config.ts` |
| Eletricistas, horários e contatos | `src/data/eletricistas.ts` |
| Peças, preços e estoque | `src/data/pecas.ts` |
| Serviços e faixas de preço de mão de obra | `src/data/servicos.ts` |

Números de WhatsApp usam o formato internacional sem símbolos (ex.: `5511999990000`).

## Rodando

```bash
npm install
npm run dev     # desenvolvimento
npm test        # testes
npm run build   # gera a versão de produção em dist/
```
