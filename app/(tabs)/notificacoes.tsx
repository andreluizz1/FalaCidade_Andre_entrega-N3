import { useAuth } from "@/hooks/use-auth";
import { cores } from "@/styles";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Notificacoes() {
  const { user } = useAuth();
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Atualizações</Text>
      <Text style={styles.texto}>{user ? "Você receberá novidades sobre seus reportes aqui." : "Entre para acompanhar novidades dos seus reportes."}</Text>
      <Link href="/lista-de-reportes" asChild>
        <Pressable style={styles.botao}><Text style={styles.botaoTexto}>Abrir reportes</Text></Pressable>
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.bgBrancoGelo, padding: 22 },
  titulo: { color: cores.preto, fontSize: 27, fontWeight: "800", marginBottom: 10 },
  texto: { color: cores.cinzaEscuro, fontSize: 16, lineHeight: 23 },
  botao: { backgroundColor: cores.verde, borderRadius: 12, padding: 14, alignItems: "center", marginTop: 25 },
  botaoTexto: { color: cores.branco, fontWeight: "800" },
});
