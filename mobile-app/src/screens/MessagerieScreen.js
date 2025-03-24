import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import ConversationList from '../components/ConversationList';

export default function MessagerieScreen({ navigation }) {
  const handleConversationPress = (conversation) => {
    navigation.navigate('ConversationDetail', {
      conversation,
      title: conversation.tripName,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ConversationList onConversationPress={handleConversationPress} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
}); 