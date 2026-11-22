export type StatusOcorrencia = "aberto" | "em_execucao" | "resolvido";
export type CategoriaReporte = "rua" | "iluminacao" | "limpeza" | "outro";

export type Ocorrencia = {
  id: string;
  idNotificante?: string;
  categoria?: CategoriaReporte;
  titulo: string;
  descricao?: string;
  status: StatusOcorrencia;
  latitude: number;
  longitude: number;
  criadoEm?: Date;
};
