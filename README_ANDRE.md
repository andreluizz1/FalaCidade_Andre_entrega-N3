# Fala Cidade — entrega individual

Esta é uma implementação individual dos dois desafios de Desenvolvimento Mobile. O projeto usa Expo Router, React Native, TypeScript e Firebase Firestore.

## O que foi implementado

### Desafio 1 — gravar reporte

- `firebase-config.ts` exporta `bancoDeDados` com `getFirestore(app)`.
- `services/reportes.ts` separa a regra de gravação da interface.
- A tela `app/novo-reporte.tsx` possui categorias, título, descrição opcional, contador de caracteres e validações.
- O ponto do GPS é salvo junto com o usuário autenticado.
- O status inicial é `aberto` e a data utiliza `serverTimestamp()`.

### Desafio 2 — listar reportes

- `services/ocorrencias.ts` consulta a coleção `ocorrencias`, ordena por `criadoEm` e limita o resultado a 50 documentos.
- `hooks/use-ocorrencias.ts` usa `useFocusEffect`, portanto a leitura é refeita quando a tela volta a ficar visível.
- `app/lista-de-reportes.tsx` mostra um resumo numérico, cartões com categoria, data, status e coordenadas, além de atualização por gesto ou botão.
- O mapa continua recebendo os reportes do Firestore por meio do hook existente.

## Diferenças desta versão

A interface não reproduz a tela de referência: o formulário foi organizado em blocos de categoria numerados, com contador e aviso de GPS. A listagem usa um painel de resumo e cartões numerados, sem o filtro de “meus reportes” e sem o campo de endereço usado na outra implementação. Também foi acrescentado tratamento visual de erro na consulta.

## Configuração

1. Instale o Node.js LTS.
2. Execute `npm install`.
3. Copie `.envExample` para `.env`.
4. Preencha as variáveis `EXPO_PUBLIC_FIREBASE_*` com as configurações do seu próprio aplicativo Firebase.
5. No Firebase, ative Authentication, crie pelo menos um usuário e habilite o Firestore.
6. Publique as regras fornecidas no PDF da disciplina.
7. Execute `npm start` e abra com Expo Go ou use `npm run web`.

A pasta entregue não contém o `.env` nem as credenciais do projeto usado como referência.

## Verificação realizada

O comando `npx tsc --noEmit` foi executado com sucesso nesta versão.
