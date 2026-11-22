import { useAuth, useSair } from "@/hooks/use-auth";
import { cores } from "@/styles";
import { Image } from 'expo-image';
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Perfil() {
  const { user, isLogin: estaLogado } = useAuth();
  const handleSair = useSair();

  const perfil = user ? user : 'sem informação disponivel';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.status}>
        {estaLogado ? (
          <>
            <Text style={[styles.statusTexto, { color: cores.verde }]}>
              Você está logado
            </Text>
            <Text style={styles.titulo}>User: {typeof perfil !== 'string' ? perfil.displayName : ''}</Text>
            <Text style={styles.titulo}>Email: {typeof perfil !== 'string' ? perfil.email : ''}</Text>
            
            {typeof perfil !== 'string' && perfil.photoURL && (
              <Image
                style={styles.image}
                source={{ uri: perfil.photoURL }}
                contentFit="cover"
                transition={1000}
              />
            )}

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.botaoSair}
              onPress={handleSair}
            >
              <Text style={styles.textoBotaoSair}>Sair</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={[styles.statusTexto, { color: cores.alerta }]}>
            Você não está logado
          </Text>
        )}

        {/* Botão visível com ou sem login, pois a leitura dos reportes é pública */}
        <Link href="/lista-de-reportes" asChild>
          <Pressable style={styles.botaoReportes}>
            <Text style={styles.link}>Ver reportes</Text>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.bgBrancoGelo,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  status: {
    alignItems: "center",
    marginBottom: 16,
  },
  statusTexto: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  botaoReportes: {
    backgroundColor: "#E0F2E9",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 20,
  },
  link: {
    color: cores.verde,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  titulo: {
    color: cores.preto,
    fontSize: 18,
    fontWeight: "600",
  },
  botaoSair: {
    borderWidth: 2,
    borderColor: cores.verde,
    width: 150,
    padding: 16,
    alignItems: "center",
    borderRadius: 15,
    marginTop: 24,
  },
  textoBotaoSair: {
    color: cores.verde,
    fontSize: 18,
    fontWeight: "800",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: '#0553',
  },
});
