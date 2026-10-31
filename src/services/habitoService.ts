import type { Habito } from '../types/habito';

const SIMULAR_ERRO = false;

const ATRASO_MS = 1000;

const MOCK: Habito = {
  id: 'h1',
  titulo: 'Beber 2L de água',
  categoria: 'saude',
  frequencia: 'diaria',
  status: 'pendente',
  streakDias: 4,
  criadoEm: '2026-08-01T09:00:00.000Z',
};

export async function buscarHabitoDoDia(): Promise<Habito> {
  await new Promise((r) => setTimeout(r, ATRASO_MS));

  if (SIMULAR_ERRO) {
    throw new Error('Não foi possível buscar o hábito do dia. Por favor, verifique sua conexão e tente novamente.');
  }

  return MOCK;
}
