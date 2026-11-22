import { useAuth } from "@/hooks/use-auth";
import { cores } from "@/styles";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Ranking() {
  const { user } = useAuth();
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.marca}>PARTICIPAÇÃO</Text>
      <Text style={styles.titulo}>Ranking da comunidade</Text>
      <Text style={styles.texto}>{user ? "A pontuação será calculada conforme os reportes confirmados." : "Faça login para participar do ranking."}</Text>
      <Link href="/lista-de-reportes" asChild>
        <Pressable style={styles.botao}><Text style={styles.botaoTexto}>Ver atividade da cidade</Text></Pressable>
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.bgBrancoGelo, padding: 22 },
  marca: { color: cores.verde, fontSize: 11, letterSpacing: 1.5, fontWeight: "900" },
  titulo: { color: cores.preto, fontSize: 27, fontWeight: "800", marginTop: 5, marginBottom: 10 },
  texto: { color: cores.cinzaEscuro, fontSize: 16, lineHeight: 23 },
  botao: { backgroundColor: cores.verde, borderRadius: 12, padding: 14, alignItems: "center", marginTop: 25 },
  botaoTexto: { color: cores.branco, fontWeight: "800" },
});
