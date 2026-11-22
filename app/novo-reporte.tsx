import { useAuth } from "@/hooks/use-auth";
import { useCidade } from "@/hooks/use-cidade";
import { CategoriaReporte, criarReporte } from "@/services/reportes";
import { cores } from "@/styles";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const categorias: { id: CategoriaReporte; nome: string; simbolo: string }[] = [
  { id: "rua", nome: "Rua", simbolo: "01" },
  { id: "iluminacao", nome: "Luz", simbolo: "02" },
  { id: "limpeza", nome: "Limpeza", simbolo: "03" },
  { id: "outro", nome: "Outro", simbolo: "04" },
];

export default function NovoReporte() {
  const router = useRouter();
  const { user } = useAuth();
  const { coordenadas } = useCidade();
  const [categoria, setCategoria] = useState<CategoriaReporte>("rua");
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [enviando, setEnviando] = useState(false);

  function avisar(tituloAviso: string, mensagem: string, voltar = false) {
    if (Platform.OS === "web") {
      window.alert(`${tituloAviso}\n\n${mensagem}`);
      if (voltar) router.back();
      return;
    }
    Alert.alert(tituloAviso, mensagem, voltar ? [{ text: "OK", onPress: router.back }] : undefined);
  }

  async function salvar() {
    const tituloLimpo = titulo.trim();
    if (!tituloLimpo) {
      avisar("Falta o título", "Escreva uma frase curta para identificar o problema.");
      return;
    }
    if (!user) {
      avisar("Acesso necessário", "Entre na sua conta antes de enviar um reporte.");
      return;
    }
    if (!coordenadas) {
      avisar("Localização pendente", "Permita o acesso ao GPS e tente novamente.");
      return;
    }

    setEnviando(true);
    try {
      await criarReporte({
        idNotificante: user.uid,
        categoria,
        titulo: tituloLimpo,
        descricao,
        latitude: coordenadas.latitude,
        longitude: coordenadas.longitude,
      });
      avisar("Tudo certo", "O reporte foi salvo no Firebase.", true);
    } catch (erro) {
      console.error("Erro ao salvar reporte:", erro);
      avisar("Não foi possível enviar", "Confira a internet e tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <SafeAreaView style={styles.area}>
      <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
        <Pressable onPress={() => router.back()} style={styles.voltar}>
          <Text style={styles.voltarTexto}>‹ Voltar ao mapa</Text>
        </Pressable>
        <Text style={styles.etiqueta}>NOVO REGISTRO</Text>
        <Text style={styles.titulo}>O que aconteceu?</Text>
        <Text style={styles.instrucao}>Escolha uma categoria e conte onde a cidade precisa de atenção.</Text>

        <Text style={styles.rotulo}>Categoria</Text>
        <View style={styles.grade}>
          {categorias.map((item) => {
            const selecionada = categoria === item.id;
            return (
              <Pressable
                key={item.id}
                onPress={() => setCategoria(item.id)}
                style={[styles.categoria, selecionada && styles.categoriaAtiva]}
              >
                <Text style={[styles.simbolo, selecionada && styles.textoAtivo]}>{item.simbolo}</Text>
                <Text style={[styles.nomeCategoria, selecionada && styles.textoAtivo]}>{item.nome}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.rotulo}>Título do reporte</Text>
        <TextInput
          value={titulo}
          onChangeText={setTitulo}
          placeholder="Ex.: poste apagado na praça"
          placeholderTextColor={cores.cinzaClaro}
          style={styles.input}
          maxLength={80}
          editable={!enviando}
        />
        <View style={styles.linhaContagem}>
          <Text style={styles.dica}>Seja objetivo para facilitar a triagem.</Text>
          <Text style={styles.contagem}>{titulo.length}/80</Text>
        </View>

        <Text style={styles.rotulo}>Detalhes (opcional)</Text>
        <TextInput
          value={descricao}
          onChangeText={setDescricao}
          placeholder="Inclua alguma informação que ajude a localizar o problema."
          placeholderTextColor={cores.cinzaClaro}
          style={[styles.input, styles.areaTexto]}
          multiline
          maxLength={240}
          textAlignVertical="top"
          editable={!enviando}
        />
        <Text style={styles.contagemDescricao}>{descricao.length}/240</Text>

        <View style={styles.localizacao}>
          <Text style={styles.localizacaoTitulo}>Localização automática</Text>
          <Text style={styles.localizacaoTexto}>
            {coordenadas ? "GPS pronto: o ponto atual será anexado." : "Aguardando permissão de localização."}
          </Text>
        </View>

        <Pressable onPress={salvar} disabled={enviando} style={[styles.botao, enviando && styles.botaoDesativado]}>
          {enviando ? <ActivityIndicator color={cores.branco} /> : <Text style={styles.botaoTexto}>Salvar reporte</Text>}
        </Pressable>
        <Pressable onPress={() => router.back()} disabled={enviando} style={styles.cancelar}>
          <Text style={styles.cancelarTexto}>Descartar</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  area: { flex: 1, backgroundColor: "#f2f7f4" },
  conteudo: { padding: 22, paddingBottom: 36 },
  voltar: { marginBottom: 24 },
  voltarTexto: { color: cores.verde, fontSize: 15, fontWeight: "700" },
  etiqueta: { color: cores.verde, fontSize: 12, fontWeight: "800", letterSpacing: 1.5 },
  titulo: { color: cores.preto, fontSize: 30, fontWeight: "800", marginTop: 6 },
  instrucao: { color: cores.cinzaEscuro, fontSize: 15, lineHeight: 22, marginTop: 8, marginBottom: 25 },
  rotulo: { color: cores.preto, fontSize: 14, fontWeight: "800", marginBottom: 9, marginTop: 12 },
  grade: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 8 },
  categoria: { width: "47%", minHeight: 72, padding: 12, borderRadius: 14, backgroundColor: cores.branco, borderWidth: 1, borderColor: "#d9e3dc" },
  categoriaAtiva: { backgroundColor: cores.verde, borderColor: cores.verde },
  simbolo: { color: cores.verde, fontSize: 12, fontWeight: "900", marginBottom: 7 },
  nomeCategoria: { color: cores.preto, fontSize: 15, fontWeight: "700" },
  textoAtivo: { color: cores.branco },
  input: { backgroundColor: cores.branco, borderWidth: 1, borderColor: "#d9e3dc", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13, color: cores.preto, fontSize: 15 },
  linhaContagem: { flexDirection: "row", justifyContent: "space-between", marginTop: 6 },
  dica: { color: cores.cinzaClaro, fontSize: 12 },
  contagem: { color: cores.cinzaClaro, fontSize: 12 },
  areaTexto: { minHeight: 116, paddingTop: 13 },
  contagemDescricao: { color: cores.cinzaClaro, fontSize: 12, textAlign: "right", marginTop: 5 },
  localizacao: { backgroundColor: "#e4f1e9", borderRadius: 12, padding: 14, marginTop: 20, marginBottom: 20 },
  localizacaoTitulo: { color: cores.verdeEscuro, fontWeight: "800", fontSize: 14 },
  localizacaoTexto: { color: cores.cinzaEscuro, fontSize: 13, marginTop: 4 },
  botao: { backgroundColor: cores.verde, borderRadius: 13, alignItems: "center", padding: 16 },
  botaoDesativado: { opacity: 0.6 },
  botaoTexto: { color: cores.branco, fontSize: 16, fontWeight: "800" },
  cancelar: { alignItems: "center", padding: 15 },
  cancelarTexto: { color: cores.cinzaEscuro, fontSize: 14, fontWeight: "700" },
});
