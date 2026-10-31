// Tela de criar/editar Habito (Aula 3 · Atividade 1).
// Ainda não está ligada a nenhuma navegação — a Aula 3 não cobre isso.
// Para pré-visualizar enquanto você desenvolve: troque temporariamente o conteúdo
// renderizado dentro de <View style={styles.conteudo}> em App.tsx por <HabitoForm />,
// e desfaça a troca antes de entregar.
import { useState } from 'react';
import { ScrollView, View, Text, TextInput, Switch, Button, StyleSheet } from 'react-native';
import { cores, espaco, tipografia } from '../theme';

export function HabitoForm() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [lembrete, setLembrete] = useState(false);

  // Válido quando o título não está vazio — sem contar espaços.
  const tituloVazio = titulo.trim().length === 0;

  return (
    <ScrollView style={styles.tela}>
      <View style={styles.conteudo}>
        <Text style={styles.rotulo}>Título</Text>
        {/* Controlado, e com o estilo de inválido SOMADO (array), não trocado. */}
        <TextInput 
          style={[styles.input, tituloVazio && styles.inputInvalido]} 
          placeholder="Ex.: Beber 2L de água"
          value={titulo}
          onChangeText={setTitulo}
          />

        <Text style={styles.rotulo}>Descrição</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Opcional"
          value={descricao}
          onChangeText={setDescricao}
          />

        <View style={styles.linha}>
          <Text style={styles.rotulo}>Lembrete diário</Text>
          {/* Sem `value` o Switch volta sozinho ao valor anterior. */}
          <Switch 
            value={lembrete}
            onValueChange={setLembrete} />
        </View>

        {/* O Button não aceita `style` — por isso a View estilizada em volta. */}
        <View style={styles.areaBotao}>
          <Button title="Salvar" onPress={() => {}} disabled={tituloVazio} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  conteudo: {
    // Daqui saem todos os espaçamentos do formulário.
    padding: espaco.md,
    gap: espaco.sm,
  },
  input: {
    borderWidth: 1,
    padding: 8,
    borderColor: cores.primaria,
    borderRadius: espaco.sm,
    fontSize: tipografia.corpo.fontSize,
  },
  inputInvalido: {
    // Só o que MUDA em relação ao `input` normal.
    borderColor: cores.erro,
  },
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rotulo: {
    fontSize: 14,
  },
  areaBotao: {
    borderRadius: 8,
    overflow: 'hidden',
    // `margin` aqui é legítima: é espaço EM VOLTA do grupo, não entre irmãos.
    marginTop: espaco.md,
  },
});
