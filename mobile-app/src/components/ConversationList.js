import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';

const mockConversations = [
  {
    id: '1',
    tripName: 'Voyage au Japon',
    status: 'À venir',
    lastMessage: 'Bonjour, j\'ai une question concernant le transport local...',
    agentName: 'Sophie Martin',
    timestamp: '10:30',
    unread: true,
  },
  {
    id: '2',
    tripName: 'Safari en Tanzanie',
    status: 'En cours',
    lastMessage: 'Voici les détails de votre transfert à l\'aéroport.',
    agentName: 'Thomas Dubois',
    timestamp: 'Hier',
    unread: false,
  },
  {
    id: '3',
    tripName: 'Road Trip USA',
    status: 'Terminé',
    lastMessage: 'Merci pour votre retour ! N\'hésitez pas si vous avez d\'autres questions.',
    agentName: 'Julie Bernard',
    timestamp: '23 Mar',
    unread: false,
  },
];

const ConversationItem = ({ item, onPress }) => (
  <TouchableOpacity style={styles.conversationItem} onPress={onPress}>
    <View style={styles.avatarContainer}>
      <Image
        source={{ uri: 'https://via.placeholder.com/40' }}
        style={styles.avatar}
      />
    </View>
    <View style={styles.contentContainer}>
      <View style={styles.headerRow}>
        <Text style={styles.tripName}>{item.tripName}</Text>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
      <Text style={styles.agentName}>{item.agentName}</Text>
      <View style={styles.messageRow}>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
        {item.unread && <View style={styles.unreadDot} />}
      </View>
      <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
        {item.status}
      </Text>
    </View>
  </TouchableOpacity>
);

const getStatusColor = (status) => {
  switch (status) {
    case 'À venir':
      return '#2196F3';
    case 'En cours':
      return '#4CAF50';
    case 'Terminé':
      return '#9E9E9E';
    default:
      return '#000000';
  }
};

export default function ConversationList({ onConversationPress }) {
  const renderItem = ({ item }) => (
    <ConversationItem
      item={item}
      onPress={() => onConversationPress(item)}
    />
  );

  return (
    <FlatList
      data={mockConversations}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      style={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tripName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: 12,
    color: '#757575',
  },
  agentName: {
    fontSize: 14,
    color: '#616161',
    marginTop: 2,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    color: '#757575',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2196F3',
    marginLeft: 8,
  },
  status: {
    fontSize: 12,
    marginTop: 4,
  },
}); 