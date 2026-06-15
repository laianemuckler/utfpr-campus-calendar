/**
 * Constantes e dados fixos da aplicação
 */

export const CAMPUS_LIST = [
  'Apucarana',
  'Campo Mourão',
  'Cornélio Procópio',
  'Curitiba',
  'Dois Vizinhos',
  'Francisco Beltrão',
  'Guarapuava',
  'Londrina',
  'Medianeira',
  'Pato Branco',
  'Ponta Grossa',
  'Santa Helena',
  'Toledo',
];

export const WEEK_DAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

export const EVENT_CATEGORIES = {
  DEADLINE: 'Prazo',
  EVENT: 'Evento',
  HOLIDAY: 'Feriado',
};

export const DEFAULT_CAMPUS = 'Dois Vizinhos';

// Dados de exemplo (será substituído por Firestore)
export const MOCK_EVENTS = [
  {
    date: '13 DE MAIO',
    title: 'Entrega de TCC',
    location: 'Coordenação · Sala B-204',
    category: 'Engenharia de Software',
    color: '#E24B4A',
  },
  {
    date: '15 A 19 DE MAIO',
    title: 'Semana Acadêmica',
    location: 'Campus · Auditório Principal',
    category: 'Todos os cursos',
    color: '#F5C200',
  },
];

export const DOMINIOS_UTFPR = ['@alunos.utfpr.edu.br', '@utfpr.edu.br'];

