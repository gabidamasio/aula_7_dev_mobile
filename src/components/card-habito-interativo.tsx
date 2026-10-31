// components/card-habito-interativo.tsx
import { useState } from 'react';
import { View, Text, Switch, Button, StyleSheet } from 'react-native';

export default function CardHabitoInterativo() {
    const [concluido, setConcluido] = useState(false);
    const [lembrete, setLembrete] = useState(false);

    // Forma de função: o novo valor deriva do anterior.
    const alternar = () => { setConcluido(prev => !prev); };

    return (
        // Array SOMA os estilos; ternário TROCARIA.
        <View style={[styles.card, concluido && styles.cardConcluido]}>
            <Text
                style={[styles.titulo, concluido && styles.tituloConcluido]}
                onPress={alternar}
            >
                Beber 2L de água
            </Text>

            <View style={styles.linha}>
                <Text style={styles.rotulo}>Lembrete diário</Text>
                {/* Sem `value` o Switch volta sozinho ao valor anterior. */}
                <Switch value={lembrete} onValueChange={setLembrete} />
            </View>

            <Button title={concluido ? 'Desmarcar' : 'Marcar concluído'} onPress={alternar} />
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 16,
        borderRadius: 12,
        backgroundColor: '#fff',
        gap: 8,
    },
    cardConcluido: { backgroundColor: '#f2f8f2' },
    titulo: { fontSize: 18, fontWeight: '600' },
    tituloConcluido: { textDecorationLine: 'line-through', color: '#6b6459' },
    linha: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rotulo: { fontSize: 14 },
});