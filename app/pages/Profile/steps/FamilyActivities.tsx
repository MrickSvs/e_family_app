import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

interface ActivitiesData {
  preferred: string[];
  excluded: string[];
}

interface FamilyActivitiesProps {
  data: ActivitiesData;
  onUpdate: (data: ActivitiesData) => void;
  onPrevious: () => void;
  onComplete: () => void;
}

const activities = {
  outdoor: [
    'Randonnée',
    'Vélo',
    'Pique-nique',
    'Plage',
    'Camping',
    'Sports nautiques',
    'Jardinage',
  ],
  indoor: [
    'Jeux de société',
    'Cinéma',
    'Lecture',
    'Cuisine',
    'Arts créatifs',
    'Musique',
    'Danse',
  ],
  cultural: [
    'Musées',
    'Théâtre',
    'Concerts',
    'Expositions',
    'Festivals',
    'Patrimoine',
  ],
  sports: [
    'Football',
    'Basketball',
    'Tennis',
    'Natation',
    'Yoga',
    'Course à pied',
    'Escalade',
  ],
};

export const FamilyActivities: React.FC<FamilyActivitiesProps> = ({
  data,
  onUpdate,
  onPrevious,
  onComplete,
}) => {
  const [formData, setFormData] = useState<ActivitiesData>(data);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const toggleActivity = (activity: string, type: 'preferred' | 'excluded') => {
    setFormData((prev) => {
      const isInPreferred = prev.preferred.includes(activity);
      const isInExcluded = prev.excluded.includes(activity);

      if (type === 'preferred') {
        if (isInPreferred) {
          return {
            ...prev,
            preferred: prev.preferred.filter((a) => a !== activity),
          };
        } else {
          return {
            ...prev,
            preferred: [...prev.preferred, activity],
            excluded: prev.excluded.filter((a) => a !== activity),
          };
        }
      } else {
        if (isInExcluded) {
          return {
            ...prev,
            excluded: prev.excluded.filter((a) => a !== activity),
          };
        } else {
          return {
            ...prev,
            excluded: [...prev.excluded, activity],
            preferred: prev.preferred.filter((a) => a !== activity),
          };
        }
      }
    });
  };

  const handleSubmit = () => {
    onUpdate(formData);
    onComplete();
  };

  const renderActivitySection = (title: string, activityList: string[]) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.activityContainer}>
        {activityList.map((activity) => {
          const isPreferred = formData.preferred.includes(activity);
          const isExcluded = formData.excluded.includes(activity);

          return (
            <View key={activity} style={styles.activityWrapper}>
              <TouchableOpacity
                style={[
                  styles.activityChip,
                  isPreferred && styles.preferredChip,
                  isExcluded && styles.excludedChip,
                ]}
              >
                <Text
                  style={[
                    styles.activityText,
                    isPreferred && styles.preferredText,
                    isExcluded && styles.excludedText,
                  ]}
                >
                  {activity}
                </Text>
              </TouchableOpacity>
              <View style={styles.activityActions}>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    isPreferred && styles.actionButtonActive,
                  ]}
                  onPress={() => toggleActivity(activity, 'preferred')}
                >
                  <Text
                    style={[
                      styles.actionButtonText,
                      isPreferred && styles.actionButtonTextActive,
                    ]}
                  >
                    👍
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    isExcluded && styles.actionButtonActive,
                  ]}
                  onPress={() => toggleActivity(activity, 'excluded')}
                >
                  <Text
                    style={[
                      styles.actionButtonText,
                      isExcluded && styles.actionButtonTextActive,
                    ]}
                  >
                    👎
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Activités préférées</Text>
      <Text style={styles.subtitle}>
        Sélectionnez les activités que votre famille aime ou n'aime pas
      </Text>

      {renderActivitySection('Activités en plein air', activities.outdoor)}
      {renderActivitySection('Activités d\'intérieur', activities.indoor)}
      {renderActivitySection('Activités culturelles', activities.cultural)}
      {renderActivitySection('Sports', activities.sports)}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
          onPress={onPrevious}
        >
          <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
            Précédent
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Terminer</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#666',
  },
  activityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  activityWrapper: {
    width: '50%',
    padding: 4,
  },
  activityChip: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  preferredChip: {
    backgroundColor: '#e8f5e9',
    borderColor: '#0f8066',
  },
  excludedChip: {
    backgroundColor: '#ffebee',
    borderColor: '#ff5252',
  },
  activityText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
  preferredText: {
    color: '#0f8066',
  },
  excludedText: {
    color: '#ff5252',
  },
  activityActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginHorizontal: 4,
    backgroundColor: '#f5f5f5',
  },
  actionButtonActive: {
    backgroundColor: '#0f8066',
  },
  actionButtonText: {
    fontSize: 16,
  },
  actionButtonTextActive: {
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  button: {
    backgroundColor: '#0f8066',
    padding: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#0f8066',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonTextSecondary: {
    color: '#0f8066',
  },
}); 