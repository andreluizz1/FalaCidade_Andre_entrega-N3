import { STATUS } from "@/constants/status";
import { useCidade } from "@/hooks/use-cidade";
import { useOcorrencias } from "@/hooks/use-ocorrencias";
import { cores } from "@/styles";
import { CategoriaReporte } from "@/types/ocorrencia";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const nomesCategoria: Record<CategoriaReporte, string> = {
  rua: "Vias públicas",
  iluminacao: "Iluminação",
  limpeza: "Limpeza urbana",
  outro: "Outros",
};

export default function ListaDeReportes() {
  const router = useRouter();
  const { coordenadas } = useCidade();
  const { ocorrencias, carregando, erro, recarregar } = useOcorrencias(coordenadas);
  const abertos = useMemo(() => ocorrencias.filter((item) => item.status === "aberto").length, [ocorrencias]);

  function dataTexto(data?: Date) {
    return data ? data.toLocaleDateString("pt-BR") : "agora";
  }

  return (
    <SafeAreaView style={styles.area}>
      <View style={styles.cabecalho}>
        <Pressable onPress={() => router.back()}><Text style={styles.voltar}>‹</Text></Pressable>
        <View style={styles.tituloArea}>
          <Text style={styles.miniTitulo}>PAINEL DA CIDADE</Text>
          <Text style={styles.titulo}>Reportes recentes</Text>
        </View>
        <Pressable onPress={() => void recarregar()} disabled={carregando} style={styles.atualizar}>
          <Text style={styles.atualizarTexto}>↻</Text>
        </Pressable>
      </View>

      <View style={styles.resumo}>
        <View><Text style={styles.numero}>{ocorrencias.length}</Text><Text style={styles.resumoTexto}>registrados</Text></View>
        <View style={styles.divisor} />
        <View><Text style={[styles.numero, { color: cores.alerta }]}>{abertos}</Text><Text style={styles.resumoTexto}>em aberto</Text></View>
        <View style={styles.selo}><Text style={styles.seloTexto}>últimos 50</Text></View>
      </View>

      {carregando && ocorrencias.length === 0 && <ActivityIndicator color={cores.verde} style={styles.carregando} />}
      {erro && <View style={styles.erro}><Text style={styles.erroTexto}>{erro}</Text><Pressable onPress={() => void recarregar()}><Text style={styles.tentar}>Tentar de novo</Text></Pressable></View>}
      {!carregando && !erro && ocorrencias.length === 0 && <Text style={styles.vazio}>Ainda não há reportes cadastrados.</Text>}

      <FlatList
        data={ocorrencias}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        refreshControl={<RefreshControl refreshing={carregando} onRefresh={recarregar} tintColor={cores.verde} />}
        renderItem={({ item, index }) => {
          const status = STATUS[item.status];
          const categoria = item.categoria ? nomesCategoria[item.categoria] : "Outros";
          return (
            <View style={styles.cartao}>
              <View style={[styles.numeroCartao, { backgroundColor: status?.cor ?? cores.verde }]}><Text style={styles.numeroCartaoTexto}>{String(index + 1).padStart(2, "0")}</Text></View>
              <View style={styles.corpo}>
                <View style={styles.linhaTopo}><Text style={styles.categoria}>{categoria}</Text><Text style={styles.data}>{dataTexto(item.criadoEm)}</Text></View>
                <Text style={styles.tituloReporte}>{item.titulo}</Text>
                {!!item.descricao && <Text style={styles.descricao} numberOfLines={2}>{item.descricao}</Text>}
                <View style={styles.linhaRodape}><Text style={[styles.status, { color: status?.cor ?? cores.verde }]}>{status?.rotulo ?? item.status}</Text><Text style={styles.coordenadas}>{item.latitude.toFixed(3)}, {item.longitude.toFixed(3)}</Text></View>
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  area: { flex: 1, backgroundColor: "#f2f7f4" },
  cabecalho: { flexDirection: "row", alignItems: "center", paddingHorizontal: 18, paddingTop: 14, paddingBottom: 18 },
  voltar: { color: cores.verde, fontSize: 36, lineHeight: 36, width: 36 },
  tituloArea: { flex: 1 },
  miniTitulo: { color: cores.verde, fontSize: 11, letterSpacing: 1.4, fontWeight: "900" },
  titulo: { color: cores.preto, fontSize: 23, fontWeight: "800", marginTop: 2 },
  atualizar: { width: 40, height: 40, borderRadius: 20, backgroundColor: cores.branco, alignItems: "center", justifyContent: "center" },
  atualizarTexto: { color: cores.verde, fontSize: 24 },
  resumo: { marginHorizontal: 18, marginBottom: 15, padding: 17, borderRadius: 16, backgroundColor: cores.branco, flexDirection: "row", alignItems: "center", gap: 15 },
  numero: { color: cores.verde, fontSize: 25, fontWeight: "900" },
  resumoTexto: { color: cores.cinzaEscuro, fontSize: 12, marginTop: 2 },
  divisor: { height: 40, width: 1, backgroundColor: "#dce6df" },
  selo: { marginLeft: "auto", paddingHorizontal: 8, paddingVertical: 6, borderRadius: 8, backgroundColor: "#e4f1e9" },
  seloTexto: { color: cores.verdeEscuro, fontSize: 11, fontWeight: "800" },
  lista: { paddingHorizontal: 18, paddingBottom: 30 },
  carregando: { marginTop: 20 },
  erro: { margin: 18, padding: 15, borderRadius: 12, backgroundColor: "#fff4e5" },
  erroTexto: { color: cores.preto, fontSize: 14 },
  tentar: { color: cores.verde, fontWeight: "800", marginTop: 8 },
  vazio: { textAlign: "center", color: cores.cinzaEscuro, marginTop: 25 },
  cartao: { flexDirection: "row", backgroundColor: cores.branco, borderRadius: 15, padding: 13, marginBottom: 10, shadowColor: "#173d28", shadowOpacity: 0.06, shadowRadius: 5, elevation: 1 },
  numeroCartao: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center", marginRight: 11 },
  numeroCartaoTexto: { color: cores.branco, fontSize: 12, fontWeight: "900" },
  corpo: { flex: 1 },
  linhaTopo: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  categoria: { color: cores.verde, fontSize: 11, fontWeight: "900", textTransform: "uppercase" },
  data: { color: cores.cinzaClaro, fontSize: 11 },
  tituloReporte: { color: cores.preto, fontSize: 16, fontWeight: "800", marginTop: 5 },
  descricao: { color: cores.cinzaEscuro, fontSize: 13, lineHeight: 18, marginTop: 4 },
  linhaRodape: { flexDirection: "row", justifyContent: "space-between", marginTop: 10, paddingTop: 7, borderTopWidth: 1, borderTopColor: "#edf2ee" },
  status: { fontSize: 12, fontWeight: "800" },
  coordenadas: { color: cores.cinzaClaro, fontSize: 11 },
});
