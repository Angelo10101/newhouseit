import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useBusinessRecommendation, Business } from '@/hooks/useBusinessRecommendation';

interface AIRecommendationChatProps {
  visible: boolean;
  onClose: () => void;
  businesses: Business[];
}

export const AIRecommendationChat: React.FC<AIRecommendationChatProps> = ({
  visible,
  onClose,
  businesses,
}) => {
  const [userInput, setUserInput] = useState('');
  const [recommendation, setRecommendation] = useState<{
    businessId: string;
    confidence: number;
    reason: string;
  } | null>(null);
  const { getRecommendation, loading, error } = useBusinessRecommendation();

  const handleSubmit = async () => {
    if (!userInput.trim() || loading) return;

    const result = await getRecommendation(userInput, businesses);
    
    if (result) {
      setRecommendation({
        businessId: result.recommendedBusinessId,
        confidence: result.confidence,
        reason: result.reason,
      });
    }
  };

  const handleViewBusiness = () => {
    if (recommendation && recommendation.businessId !== 'NO_MATCH') {
      // Navigate to the business detail page based on the business ID
      // The businessId format should be "category-providerId"
      const [category, providerId] = recommendation.businessId.split('-');
      if (category && providerId) {
        onClose();
        handleReset();
        router.push(`/provider/${category}/${providerId}`);
      } else {
        console.error('Invalid business ID format:', recommendation.businessId);
      }
    }
  };

  const handleReset = () => {
    setRecommendation(null);
    setUserInput('');
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <ThemedView style={styles.chatContainer}>
          {/* Header */}
          <View style={styles.header}>
            <ThemedText type="title" style={styles.headerTitle}>
              AI Assistant
            </ThemedText>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <IconSymbol name="xmark.circle.fill" size={28} color="#666666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Welcome Message */}
            {!recommendation && (
              <View style={styles.welcomeContainer}>
                <IconSymbol name="brain" size={48} color="#000000" style={styles.brainIcon} />
                <ThemedText style={styles.welcomeText}>
                  Hi! I'm your AI assistant. Describe your problem and I'll recommend the best
                  business for you.
                </ThemedText>
                <ThemedText style={styles.exampleText}>
                  Example: "My lights keep flickering" or "I need help with a leaky faucet"
                </ThemedText>
              </View>
            )}

            {/* Recommendation Result */}
            {recommendation && (
              <View style={styles.recommendationContainer}>
                {recommendation.businessId === 'NO_MATCH' ? (
                  <View style={styles.noMatchContainer}>
                    <IconSymbol name="exclamationmark.triangle" size={48} color="#FF9500" />
                    <ThemedText style={styles.noMatchTitle}>No Match Found</ThemedText>
                    <ThemedText style={styles.noMatchText}>{recommendation.reason}</ThemedText>
                    <TouchableOpacity style={styles.tryAgainButton} onPress={handleReset}>
                      <ThemedText style={styles.tryAgainText}>Try Another Question</ThemedText>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.matchContainer}>
                    <IconSymbol name="checkmark.circle.fill" size={48} color="#34C759" />
                    <ThemedText style={styles.matchTitle}>Recommendation Found!</ThemedText>
                    <ThemedText style={styles.confidenceText}>
                      Confidence: {(recommendation.confidence * 100).toFixed(0)}%
                    </ThemedText>
                    <View style={styles.reasonContainer}>
                      <ThemedText style={styles.reasonLabel}>Why this business:</ThemedText>
                      <ThemedText style={styles.reasonText}>{recommendation.reason}</ThemedText>
                    </View>
                    <View style={styles.actionButtons}>
                      <TouchableOpacity
                        style={styles.viewBusinessButton}
                        onPress={handleViewBusiness}
                      >
                        <ThemedText style={styles.viewBusinessText}>View Business</ThemedText>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={handleReset}
                      >
                        <ThemedText style={styles.secondaryButtonText}>Ask Again</ThemedText>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            )}

            {/* Error Display */}
            {error && (
              <View style={styles.errorContainer}>
                <IconSymbol name="exclamationmark.circle" size={24} color="#FF3B30" />
                <ThemedText style={styles.errorText}>{error}</ThemedText>
              </View>
            )}
          </ScrollView>

          {/* Input Area */}
          {!recommendation && (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Describe your problem..."
                placeholderTextColor="#999999"
                value={userInput}
                onChangeText={setUserInput}
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                style={[styles.sendButton, loading && styles.sendButtonDisabled]}
                onPress={handleSubmit}
                disabled={loading || !userInput.trim()}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <IconSymbol name="arrow.up.circle.fill" size={32} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            </View>
          )}
        </ThemedView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  chatContainer: {
    height: '85%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  closeButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  welcomeContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  brainIcon: {
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333333',
    marginBottom: 16,
    lineHeight: 24,
  },
  exampleText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666666',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    fontSize: 16,
    maxHeight: 100,
    color: '#000000',
  },
  sendButton: {
    backgroundColor: '#000000',
    borderRadius: 20,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  recommendationContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  noMatchContainer: {
    alignItems: 'center',
    padding: 20,
  },
  noMatchTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 16,
    marginBottom: 12,
  },
  noMatchText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666666',
    marginBottom: 24,
    lineHeight: 24,
  },
  tryAgainButton: {
    backgroundColor: '#000000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  tryAgainText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  matchContainer: {
    alignItems: 'center',
    padding: 20,
  },
  matchTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 16,
    marginBottom: 8,
  },
  confidenceText: {
    fontSize: 16,
    color: '#34C759',
    fontWeight: '600',
    marginBottom: 20,
  },
  reasonContainer: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    width: '100%',
  },
  reasonLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  reasonText: {
    fontSize: 15,
    color: '#333333',
    lineHeight: 22,
  },
  actionButtons: {
    width: '100%',
    gap: 12,
  },
  viewBusinessButton: {
    backgroundColor: '#000000',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewBusinessText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
});
