import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { ProfilePage } from '../pages/Profile/ProfilePage';

const ProfileScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ProfilePage />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default ProfileScreen; 