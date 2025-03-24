import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const mockMessages = [
  {
    id: '1',
    text: 'Bonjour ! Comment puis-je vous aider pour votre voyage au Japon ?',
    sender: 'agent',
    timestamp: '10:30',
    agentName: 'Sophie Martin',
    read: true,
  },
  {
    id: '2',
    text: 'Bonjour ! J\'aurais besoin d\'informations sur les transports en commun à Tokyo.',
    sender: 'user',
    timestamp: '10:32',
    read: true,
  },
  {
    id: '3',
    text: 'Je vous conseille d\'acheter la Japan Rail Pass pour vos déplacements. C\'est très économique pour les touristes. Voulez-vous plus de détails ?',
    sender: 'agent',
    timestamp: '10:35',
    agentName: 'Sophie Martin',
    read: true,
  },
  {
    id: '4',
    text: 'Oui, je veux bien ! Combien ça coûte et où puis-je l\'acheter ?',
    sender: 'user',
    timestamp: '10:36',
    read: false,
  },
  {
    id: '5',
    text: 'Le Japan Rail Pass coûte environ 29,110 yen (environ 180€) pour 7 jours. Vous devez l\'acheter avant votre arrivée au Japon. Je peux vous envoyer un lien pour l\'achat si vous voulez.',
    sender: 'agent',
    timestamp: '10:38',
    agentName: 'Sophie Martin',
    read: true,
  },
];

const Header = ({ agentName, status, onBack, onCall, onMore }) => (
  <SafeAreaView style={styles.headerContainer}>
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={24} color="#333" />
        <Text style={styles.backText}>Retour</Text>
      </TouchableOpacity>
      
      <View style={styles.agentInfo}>
        <Image
          source={{ uri: 'https://via.placeholder.com/40' }}
          style={styles.headerAvatar}
        />
        <View style={styles.agentDetails}>
          <Text style={styles.agentName}>{agentName}</Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(status) }]} />
            <Text style={styles.statusText}>{status}</Text>
          </View>
        </View>
      </View>

      <View style={styles.headerActions}>
        <TouchableOpacity style={styles.actionButton} onPress={onCall}>
          <Ionicons name="call-outline" size={24} color="#0f8066" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onMore}>
          <Ionicons name="ellipsis-vertical" size={24} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  </SafeAreaView>
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
      return '#9E9E9E';
  }
};

const MessageItem = ({ message }) => {
  const isUser = message.sender === 'user';

  return (
    <View style={[
      styles.messageContainer,
      isUser ? styles.userMessageContainer : styles.agentMessageContainer
    ]}>
      {!isUser && (
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
        isUser ? styles.userBubble : styles.agentBubble
      ]}>
        <Text style={[
          styles.messageText,
          isUser ? styles.userMessageText : styles.agentMessageText
        ]}>
          {message.text}
        </Text>
        <View style={styles.messageFooter}>
          <Text style={styles.timestamp}>{message.timestamp}</Text>
          {isUser && (
            <View style={styles.readStatus}>
              {message.read ? (
                <Ionicons name="checkmark-done" size={16} color="#0f8066" />
              ) : (
                <Ionicons name="checkmark" size={16} color="#666" />
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default function ConversationDetail({ navigation }) {
  const [message, setMessage] = useState('');
  const flatListRef = useRef(null);

  const handleSend = () => {
    if (message.trim()) {
      // Ici, vous ajouteriez la logique pour envoyer le message
      setMessage('');
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  };

  return (
    <View style={styles.container}>
      <Header
        agentName="Sophie Martin"
        status="À venir"
        onBack={() => navigation.goBack()}
        onCall={() => {/* Logique d'appel */}}
        onMore={() => {/* Logique du menu */}}
      />
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={mockMessages}
          renderItem={({ item }) => <MessageItem message={item} />}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesListContent}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <Ionicons name="add-circle-outline" size={24} color="#666" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Écrivez votre message..."
            value={message}
            onChangeText={setMessage}
            multiline
            placeholderTextColor="#999"
          />
          <TouchableOpacity 
            style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!message.trim()}
          >
            <Ionicons 
              name="send" 
              size={24} 
              color={message.trim() ? '#0f8066' : '#999'} 
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 4,
  },
  agentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  agentDetails: {
    alignItems: 'center',
  },
  agentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#666',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  keyboardView: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  messagesList: {
    flex: 1,
  },
  messagesListContent: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '85%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  agentMessageContainer: {
    alignSelf: 'flex-start',
  },
  agentAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userBubble: {
    backgroundColor: '#0f8066',
    borderTopRightRadius: 4,
  },
  agentBubble: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  agentMessageText: {
    color: '#333333',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  timestamp: {
    fontSize: 11,
    color: '#999',
    marginRight: 4,
  },
  readStatus: {
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  attachButton: {
    padding: 8,
    marginRight: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 16,
    color: '#333',
  },
  sendButton: {
    padding: 8,
    marginLeft: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
}); 