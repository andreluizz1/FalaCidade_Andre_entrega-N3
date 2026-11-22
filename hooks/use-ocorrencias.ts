import { Coordenadas } from "@/context/cidade-context";
import { buscarOcorrencias } from "@/services/ocorrencias";
import { Ocorrencia } from "@/types/ocorrencia";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

export function useOcorrencias(coordenadas: Coordenadas | null) {
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const recarregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const centro = coordenadas ?? { latitude: 0, longitude: 0 };
      setOcorrencias(await buscarOcorrencias(centro));
    } catch (falha) {
      console.error("Falha ao consultar reportes:", falha);
      setErro("Não foi possível carregar os reportes.");
    } finally {
      setCarregando(false);
    }
  }, [coordenadas]);

  useFocusEffect(
    useCallback(() => {
      void recarregar();
    }, [recarregar]),
  );

  return { ocorrencias, carregando, erro, recarregar };
}
