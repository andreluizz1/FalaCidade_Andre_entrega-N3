import { Coordenadas } from "@/context/cidade-context";
import { bancoDeDados } from "@/firebase-config";
import { Ocorrencia } from "@/types/ocorrencia";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";

/** Retorna no máximo 50 ocorrências recentes da coleção pública. */
export async function buscarOcorrencias(_centro: Coordenadas): Promise<Ocorrencia[]> {
  const consulta = query(
    collection(bancoDeDados, "ocorrencias"),
    orderBy("criadoEm", "desc"),
    limit(50),
  );
  const snapshot = await getDocs(consulta);

  return snapshot.docs.map((item) => {
    const dados = item.data();
    const timestamp = dados.criadoEm;
    return {
      id: item.id,
      idNotificante: dados.idNotificante,
      categoria: dados.categoria ?? "outro",
      titulo: String(dados.titulo ?? "Sem título"),
      descricao: dados.descricao ?? undefined,
      status: dados.status ?? "aberto",
      latitude: Number(dados.latitude),
      longitude: Number(dados.longitude),
      criadoEm: timestamp?.toDate?.(),
    };
  });
}
