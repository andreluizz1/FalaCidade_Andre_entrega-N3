import GoogleLogo from "@/components/google-logo";
import { traduzErroFirebase } from "@/constants/erros-firebase";
import { auth } from "@/firebase-config";
import { useAuth } from "@/hooks/use-auth";
import { useGoogleAuth } from "@/hooks/use-google-auth";
import { cores } from "@/styles";
import { Feather } from "@react-native-vector-icons/feather";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Link, router } from "expo-router";

export default function HomeScreen() {
  const { user } = useAuth();
  const { request, promptAsync, error } = useGoogleAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  // Controla se a senha está visível ou oculta (melhoria de usabilidade)
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erroLogin, setErroLogin] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      router.replace(user.emailVerified ? "/mapa" : "/verificar-email");
    }
  }, [user]);

  async function handleEmailLogin() {
    setErroLogin(null);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), senha);
    } catch (e) {
      setErroLogin(traduzErroFirebase(e));
    }
  }

  useEffect(() => {
    if (error) {
      console.error("Erro ao fazer login com Google:", error);
    }
  }, [error]);

  function handleGoogleLogin() {
    promptAsync();
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logo}>
        <Text style={styles.logoText}>FC</Text>
      </View>
      <Text style={styles.titulo}>Falaa cidade!</Text>
      <Text style={styles.subtitulo}>
        Reporte, acompanhe e confirme a correção de eventos que ocorrem na sua cidade.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor={cores.cinzaClaro}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />

      {/* Campo de senha com botão de olhinho para exibir/ocultar o texto */}
      <View style={styles.campoSenhaContainer}>
        <TextInput
          style={styles.inputSenha}
          placeholder="Senha"
          placeholderTextColor={cores.cinzaClaro}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={!mostrarSenha}
        />
        <TouchableOpacity
          onPress={() => setMostrarSenha((anterior) => !anterior)}
          style={styles.botaoOlho}
          activeOpacity={0.7}
        >
          <Feather
            name={mostrarSenha ? "eye-off" : "eye"}
            size={20}
            color={cores.cinzaEscuro}
          />
        </TouchableOpacity>
      </View>

      {erroLogin && <Text style={styles.erro}>{erroLogin}</Text>}

      <Link
        href={{ pathname: "/esqueci-senha", params: { email: email.trim() } }}
        asChild
      >
        <TouchableOpacity activeOpacity={0.8} style={styles.esqueciSenha}>
          <Text style={styles.esqueciSenhaTexto}>Esqueci minha senha</Text>
        </TouchableOpacity>
      </Link>

      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.botao, styles.botaoEmail]}
        onPress={handleEmailLogin}
      >
        <Text style={styles.textoBotao}>Entrar</Text>
      </TouchableOpacity>

      <Link href="/cadastro" asChild>
        <TouchableOpacity activeOpacity={0.8}>
          <Text style={styles.mapaSemLogin}>Não tem conta? Cadastre-se</Text>
        </TouchableOpacity>
      </Link>

      <Text style={styles.ou}>ou</Text>

      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.botao, styles.botaoGoogle]}
        disabled={!request}
        onPress={() => handleGoogleLogin()}
      >
        <GoogleLogo size={20} />
        <Text style={styles.textoBotaoGoogle}>Entrar com o Google</Text>
      </TouchableOpacity>

      <Text style={styles.rodape}>
        Ao continuar, você concorda com os Termos e a Política de Privacidade
        (LGPD).
      </Text>

      <Link
        href={{
          pathname: "/mapa",
          params: { logado: "false" },
        }}
        asChild
      >
        <TouchableOpacity activeOpacity={0.8}>
          <Text style={styles.mapaSemLogin}>Ver mapa sem login {">"}</Text>
        </TouchableOpacity>
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.bgBrancoGelo,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: cores.verde,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    color: "white",
    fontSize: 40,
    fontWeight: 900,
  },
  titulo: {
    color: cores.preto,
    fontSize: 40,
    marginVertical: 20,
    fontWeight: 800,
  },
  subtitulo: {
    color: cores.cinzaClaro,
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: 800,
  },
  rodape: {
    color: cores.cinzaClaro,
    justifyContent: "center",
    fontSize: 15,
    fontWeight: 400,
    alignItems: "center",
    textAlign: "center",
    marginTop: 15,
  },
  botao: {
    backgroundColor: cores.verde,
    width: 300,
    height: "auto",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    flexDirection: "row",
  },
  botaoEmail: {
    backgroundColor: cores.azul,
    padding: 16,
  },
  input: {
    width: 300,
    backgroundColor: cores.branco,
    borderWidth: 1,
    borderColor: cores.cinzaClaro,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: cores.preto,
    marginBottom: 12,
  },
  campoSenhaContainer: {
    width: 300,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: cores.branco,
    borderWidth: 1,
    borderColor: cores.cinzaClaro,
    borderRadius: 12,
    marginBottom: 12,
  },
  inputSenha: {
    flex: 1,
    padding: 14,
    fontSize: 16,
    color: cores.preto,
  },
  botaoOlho: {
    paddingHorizontal: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  erro: {
    color: cores.alerta,
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
  esqueciSenha: {
    width: 300,
    alignItems: "flex-end",
    marginTop: -4,
    marginBottom: 12,
  },
  esqueciSenhaTexto: {
    color: cores.verde,
    fontSize: 14,
    fontWeight: "600",
  },
  ou: {
    color: cores.cinzaClaro,
    fontSize: 15,
    marginVertical: 12,
  },
  textoBotao: {
    marginStart: 10,
    color: cores.branco,
    fontSize: 20,
    fontWeight: 800,
  },
  mapaSemLogin: {
    fontSize: 16,
    fontWeight: "700",
    color: cores.verde,
    marginTop: 10,
  },
  botaoGoogle: {
    backgroundColor: cores.branco,
    borderWidth: 1,
    borderColor: cores.googleBorda,
    padding: 16,
  },
  textoBotaoGoogle: {
    marginStart: 12,
    color: cores.googleTexto,
    fontSize: 18,
    fontWeight: "500",
  },
});
