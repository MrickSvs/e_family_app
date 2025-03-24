import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
  <TouchableOpacity 
    style={styles.conversationItem} 
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.avatarContainer}>
      <Image
        source={{ uri: 'https://via.placeholder.com/40' }}
        style={styles.avatar}
      />
      {item.unread && <View style={styles.unreadBadge} />}
    </View>
    <View style={styles.contentContainer}>
      <View style={styles.headerRow}>
        <Text style={styles.tripName} numberOfLines={1}>{item.tripName}</Text>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
      <View style={styles.agentRow}>
        <Ionicons name="person-circle-outline" size={16} color="#666" />
        <Text style={styles.agentName} numberOfLines={1}>{item.agentName}</Text>
      </View>
      <View style={styles.messageRow}>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>
      <View style={styles.statusContainer}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

const getStatusColor = (status) => {
  switch (status) {
    case 'À venir':
      return '#E3F2FD';
    case 'En cours':
      return '#E8F5E9';
    case 'Terminé':
      return '#F5F5F5';
    default:
      return '#F5F5F5';
  }
};

export default function ConversationList({ onConversationPress }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = mockConversations.filter(conv => 
    conv.tripName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.agentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <ConversationItem
      item={item}
      onPress={() => onConversationPress(item)}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchWrapper}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher une conversation..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>
      </View>
      <FlatList
        data={filteredConversations}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchWrapper: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    borderRadius: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    height: 44,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 16,
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  avatarContainer: {
    marginRight: 12,
    position: 'relative',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  unreadBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0f8066',
    borderWidth: 2,
    borderColor: '#fff',
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  tripName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  agentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  agentName: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
    flex: 1,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
}); 