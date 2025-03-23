import React from 'react';
import { View, StyleSheet } from 'react-native';
import ConversationList from '../components/ConversationList';
import ConversationDetail from '../components/ConversationDetail';

export default function MessagerieScreen({ navigation }) {
  const handleConversationPress = (conversation) => {
    navigation.navigate('ConversationDetail', {
      conversation,
      title: conversation.tripName,
    });
  };

  return (
    <View style={styles.container}>
      <ConversationList onConversationPress={handleConversationPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
}); 