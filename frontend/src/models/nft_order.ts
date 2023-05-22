export type NftAttributes = 'Comunidade' | 'Educacao' | 'Expansao Global' | 'Growth' | 'Labs' | 'Learn2Earn' | 'Midiatico' | 'Traducao'; 
export type NftStatus = 'Em andamento' | 'Concluido' | 'Pendente'
export type NftDifficulty = 'Iniciante' | 'Intermediario' | 'Avancado'

export interface NftOrder {
  owner: string;
  tokenId : number;
  name: string;
  description: string;
  image: string;
  status: NftStatus;
  attributes: NftAttributes;
  creatorActivity: string;
  tag: string;
  dateLimit: string;
  bounty: number;
  difficulty: NftDifficulty;
  
}
