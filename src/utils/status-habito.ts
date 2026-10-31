import type { StatusHabito } from '../types/habito';

export function corDoStatus(status: StatusHabito): string {
  switch (status) {
    case 'pendente':
      return '#fb8c00';
    case 'concluido':
      return '#43a047';
    case 'pulado':
      return '#9e9e9e';
    default: {
      const naoTratado: never = status;
      throw new Error(`StatusHabito não tratado: ${naoTratado}`);
    }
  }
}

export function rotuloDoStatus(status: StatusHabito): string {
  switch (status) {
    case 'pendente':
      return 'Pendente';
    case 'concluido':
      return 'Concluído';
    case 'pulado':
      return 'Pulado';
    default: {
      const naoTratado: never = status;
      throw new Error(`StatusHabito não tratado: ${naoTratado}`);
    }
  }
}
