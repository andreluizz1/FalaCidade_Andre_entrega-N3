import { bancoDeDados } from "@/firebase-config";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export type CategoriaReporte = "rua" | "iluminacao" | "limpeza" | "outro";

export type DadosDoReporte = {
  idNotificante: string;
  categoria: CategoriaReporte;
  titulo: string;
  descricao: string;
  latitude: number;
  longitude: number;
};

/** Mantém a tela independente da forma como o Firebase grava os dados. */
export async function criarReporte(dados: DadosDoReporte): Promise<string> {
  const referencia = await addDoc(collection(bancoDeDados, "ocorrencias"), {
    idNotificante: dados.idNotificante,
    categoria: dados.categoria,
    titulo: dados.titulo.trim(),
    descricao: dados.descricao.trim() || null,
    status: "aberto",
    latitude: dados.latitude,
    longitude: dados.longitude,
    criadoEm: serverTimestamp(),
  });

  return referencia.id;
}
