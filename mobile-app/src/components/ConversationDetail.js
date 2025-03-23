import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';

const mockMessages = [
  {
    id: '1',
    text: 'Bonjour ! Comment puis-je vous aider pour votre voyage au Japon ?',
    sender: 'agent',
    timestamp: '10:30',
    agentName: 'Sophie Martin',
  },
  {
    id: '2',
    text: 'Bonjour ! J\'aurais besoin d\'informations sur les transports en commun à Tokyo.',
    sender: 'user',
    timestamp: '10:32',
  },
  {
    id: '3',
    text: 'Je vous conseille d\'acheter la Japan Rail Pass pour vos déplacements. C\'est très économique pour les touristes. Voulez-vous plus de détails ?',
    sender: 'agent',
    timestamp: '10:35',
    agentName: 'Sophie Martin',
  },
  {
    id: '4',
    text: 'Oui, je veux bien ! Combien ça coûte et où puis-je l\'acheter ?',
    sender: 'user',
    timestamp: '10:36',
  },
  {
    id: '5',
    text: 'Le Japan Rail Pass coûte environ 29,110 yen (environ 180€) pour 7 jours. Vous devez l\'acheter avant votre arrivée au Japon. Je peux vous envoyer un lien pour l\'achat si vous voulez.',
    sender: 'agent',
    timestamp: '10:38',
    agentName: 'Sophie Martin',
  },
];

const MessageItem = ({ message }) => (
  <View style={[
    styles.messageContainer,
    message.sender === 'user' ? styles.userMessage : styles.agentMessage
  ]}>
    {message.sender === 'agent' && (
      <View style={styles.agentInfo}>
        <Image
          source={{ uri: 'https://via.placeholder.com/30' }}
          style={styles.agentAvatar}
        />
        <Text style={styles.agentName}>{message.agentName}</Text>
      </View>
    )}
    <View style={[
      styles.messageBubble,
      message.sender === 'user' ? styles.userBubble : styles.agentBubble
    ]}>
      <Text style={styles.messageText}>{message.text}</Text>
      <Text style={styles.timestamp}>{message.timestamp}</Text>
    </View>
  </View>
);

export default function ConversationDetail() {
  return (
    <FlatList
      data={mockMessages}
      renderItem={({ item }) => <MessageItem message={item} />}
      keyExtractor={(item) => item.id}
      style={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  messageContainer: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  agentMessage: {
    alignItems: 'flex-start',
  },
  agentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  agentAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  agentName: {
    fontSize: 12,
    color: '#757575',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: '#2196F3',
  },
  agentBubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  messageText: {
    fontSize: 14,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 10,
    color: '#757575',
    alignSelf: 'flex-end',
  },
}); 