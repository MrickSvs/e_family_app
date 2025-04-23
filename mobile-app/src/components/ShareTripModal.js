import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Share,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';

// Données mockées pour les contacts
const MOCK_CONTACTS = [
  { id: '1', name: 'Jean Dupont', avatar: 'https://randomuser.me/api/portraits/men/1.jpg', selected: false },
  { id: '2', name: 'Marie Martin', avatar: 'https://randomuser.me/api/portraits/women/2.jpg', selected: false },
  { id: '3', name: 'Pierre Durand', avatar: 'https://randomuser.me/api/portraits/men/3.jpg', selected: false },
  { id: '4', name: 'Sophie Bernard', avatar: 'https://randomuser.me/api/portraits/women/4.jpg', selected: false },
  { id: '5', name: 'Lucas Petit', avatar: 'https://randomuser.me/api/portraits/men/5.jpg', selected: false },
];

const ShareTripModal = ({ visible, onClose, trip }) => {
  const [contacts, setContacts] = useState(MOCK_CONTACTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [shareLink, setShareLink] = useState('https://evaneos-family-app.com/trip/123456');

  const toggleContactSelection = (id) => {
    setContacts(contacts.map(contact => 
      contact.id === id ? { ...contact, selected: !contact.selected } : contact
    ));
  };

  const handleShare = async () => {
    try {
      const selectedContacts = contacts.filter(contact => contact.selected);
      
      if (selectedContacts.length === 0) {
        Alert.alert('Erreur', 'Veuillez sélectionner au moins un contact');
        return;
      }

      // Simuler l'envoi des invitations
      Alert.alert(
        'Invitations envoyées',
        `Votre voyage a été partagé avec ${selectedContacts.length} contact(s)`,
        [{ text: 'OK', onPress: onClose }]
      );
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors du partage');
    }
  };

  const handleShareLink = async () => {
    try {
      await Share.share({
        message: `Découvrez mon voyage au ${trip?.destination || 'Costa Rica'} sur Evaneos Family App: ${shareLink}`,
        title: 'Partagez mon voyage',
      });
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors du partage du lien');
    }
  };

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderContactItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.contactItem}
      onPress={() => toggleContactSelection(item.id)}
    >
      <Image source={{ uri: item.avatar }} style={styles.contactAvatar} />
      <Text style={styles.contactName}>{item.name}</Text>
      <View style={styles.checkboxContainer}>
        {item.selected && (
          <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Partager mon voyage</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.shareLinkContainer}>
            <Text style={styles.shareLinkLabel}>Lien de partage</Text>
            <View style={styles.shareLinkBox}>
              <Text style={styles.shareLinkText} numberOfLines={1}>{shareLink}</Text>
              <TouchableOpacity onPress={handleShareLink} style={styles.copyButton}>
                <Ionicons name="share-outline" size={20} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Inviter des contacts</Text>
          
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher un contact..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <FlatList
            data={filteredContacts}
            renderItem={renderContactItem}
            keyExtractor={item => item.id}
            style={styles.contactsList}
          />

          <TouchableOpacity 
            style={styles.shareButton}
            onPress={handleShare}
          >
            <Text style={styles.shareButtonText}>Partager</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  shareLinkContainer: {
    marginBottom: 20,
  },
  shareLinkLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  shareLinkBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
  },
  shareLinkText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  copyButton: {
    padding: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  contactsList: {
    maxHeight: 300,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  contactName: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  checkboxContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ShareTripModal; 