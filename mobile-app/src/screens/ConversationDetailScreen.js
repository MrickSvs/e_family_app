import React from 'react';
import { View, StyleSheet } from 'react-native';
import ConversationDetail from '../components/ConversationDetail';

export default function ConversationDetailScreen({ route }) {
  const { conversation } = route.params;

  return (
    <View style={styles.container}>
      <ConversationDetail conversation={conversation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
}); 