// Service mocké pour gérer le partage de voyage
class ShareTripService {
  // Simuler l'envoi d'invitations à des contacts
  static async inviteContacts(tripId, contactIds) {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Retourner un succès mocké
    return {
      success: true,
      message: `Invitations envoyées à ${contactIds.length} contact(s)`,
      data: {
        tripId,
        invitedContacts: contactIds,
        timestamp: new Date().toISOString()
      }
    };
  }

  // Simuler la génération d'un lien de partage
  static async generateShareLink(tripId) {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Générer un lien mocké
    const shareId = Math.random().toString(36).substring(2, 10);
    return {
      success: true,
      data: {
        tripId,
        shareLink: `https://evaneos-family-app.com/trip/${tripId}?share=${shareId}`,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // Expire dans 7 jours
      }
    };
  }

  // Simuler la récupération des contacts disponibles
  static async getAvailableContacts() {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Retourner des contacts mockés
    return {
      success: true,
      data: [
        { id: '1', name: 'Jean Dupont', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
        { id: '2', name: 'Marie Martin', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
        { id: '3', name: 'Pierre Durand', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
        { id: '4', name: 'Sophie Bernard', avatar: 'https://randomuser.me/api/portraits/women/4.jpg' },
        { id: '5', name: 'Lucas Petit', avatar: 'https://randomuser.me/api/portraits/men/5.jpg' },
      ]
    };
  }

  // Simuler la récupération des personnes qui suivent le voyage
  static async getTripFollowers(tripId) {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Retourner des followers mockés
    return {
      success: true,
      data: [
        { 
          id: '1', 
          name: 'Jean Dupont', 
          avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
          joinedAt: '2023-04-15T10:30:00Z',
          lastActive: '2023-04-20T14:45:00Z'
        },
        { 
          id: '2', 
          name: 'Marie Martin', 
          avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
          joinedAt: '2023-04-16T09:15:00Z',
          lastActive: '2023-04-21T08:30:00Z'
        }
      ]
    };
  }

  // Simuler la récupération des commentaires sur le voyage
  static async getTripComments(tripId) {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Retourner des commentaires mockés
    return {
      success: true,
      data: [
        {
          id: '1',
          userId: '1',
          userName: 'Jean Dupont',
          userAvatar: 'https://randomuser.me/api/portraits/men/1.jpg',
          content: 'Super voyage ! Les photos sont magnifiques.',
          createdAt: '2023-04-18T15:30:00Z',
          likes: 3
        },
        {
          id: '2',
          userId: '2',
          userName: 'Marie Martin',
          userAvatar: 'https://randomuser.me/api/portraits/women/2.jpg',
          content: 'J\'adore la plage que vous avez visitée hier !',
          createdAt: '2023-04-19T10:15:00Z',
          likes: 1
        }
      ]
    };
  }

  // Simuler l'ajout d'un commentaire
  static async addComment(tripId, userId, content) {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Retourner un succès mocké
    return {
      success: true,
      data: {
        id: Math.random().toString(36).substring(2, 10),
        tripId,
        userId,
        content,
        createdAt: new Date().toISOString(),
        likes: 0
      }
    };
  }

  // Simuler le like d'un commentaire
  static async likeComment(tripId, commentId, userId) {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Retourner un succès mocké
    return {
      success: true,
      data: {
        tripId,
        commentId,
        userId,
        liked: true,
        likesCount: Math.floor(Math.random() * 10) + 1
      }
    };
  }
}

export default ShareTripService; 