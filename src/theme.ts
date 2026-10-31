export const cores = {
  fundo: '#FEF7EE',
  cartao: '#FFFFFF',
  texto: '#1A1A1A',
  textoFraco: '#7A7A7A',
  primaria: '#FF7F50',
  sucesso: '#4CAF50',
  erro: '#F44336'
} as const;

export const espaco = {
  // Progressão 4/8/16/24: cada degrau é o dobro do anterior.
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
} as const;

export const tipografia = {
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: cores.texto,
  },
  corpo: {
    fontSize: 16,
    color: cores.texto,
  },
  legenda: {
    fontSize: 12,
    color: cores.textoFraco,
  },
} as const;

// Por que este arquivo usa `as const` e o StyleSheet.create do componente NÃO usa:
// `as const` força os valores a serem literais exatos para o TypeScript, enquanto `StyleSheet.create` já tipa e otimiza os estilos internamente.
