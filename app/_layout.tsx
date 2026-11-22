import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import "react-native-reanimated";

import { AuthProvider } from "@/context/auth-context";
import { CidadeProvider } from "@/context/cidade-context";
import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
  anchor: "index",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <CidadeProvider>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          {/* screenOptions={{ headerShown: false }} oculta a barra preta padrão em todas as telas */}
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="cadastro" />
            <Stack.Screen name="esqueci-senha" />
            <Stack.Screen name="verificar-email" />
            <Stack.Screen name="novo-reporte" />
            <Stack.Screen name="lista-de-reportes" />
          </Stack>
        </ThemeProvider>
      </CidadeProvider>
    </AuthProvider>
  );
}
