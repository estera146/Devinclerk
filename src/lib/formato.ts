const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export const formatarMoeda = (valor: number) => moeda.format(valor);

export function linkWhatsApp(numero: string, mensagem: string): string {
  return `https://wa.me/${numero.replace(/\D/g, '')}?text=${encodeURIComponent(mensagem)}`;
}

export function linkTelefone(telefone: string): string {
  return `tel:${telefone.replace(/[^\d+]/g, '')}`;
}
