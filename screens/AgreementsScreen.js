import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AgreementsScreen = () => {
  const mockAgreements = [
    {
      id: 'agreement-1',
      clientName: 'Sam Wilson',
      clientPhone: '(555) 987-6543',
      meetingType: 'Buyer Consultation',
      status: 'signed',
      createdAt: '2024-01-15T10:30:00Z',
      signedAt: '2024-01-15T10:45:00Z',
      propertyAddress: '123 Main St, San Francisco, CA'
    },
    {
      id: 'agreement-2',
      clientName: 'Maria Garcia',
      clientPhone: '(555) 456-7890',
      meetingType: 'Listing Consultation',
      status: 'sent',
      createdAt: '2024-01-14T14:20:00Z',
      sentAt: '2024-01-14T14:25:00Z',
      propertyAddress: '456 Oak Ave, San Francisco, CA'
    },
    {
      id: 'agreement-3',
      clientName: 'John Smith',
      clientPhone: '(555) 321-0987',
      meetingType: 'Buyer Consultation',
      status: 'viewed',
      createdAt: '2024-01-13T09:15:00Z',
      viewedAt: '2024-01-13T09:30:00Z',
      propertyAddress: '789 Pine St, San Francisco, CA'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'signed': return '#10B981';
      case 'viewed': return '#3B82F6';
      case 'sent': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'signed': return 'checkmark-circle';
      case 'viewed': return 'eye';
      case 'sent': return 'paper-plane';
      default: return 'time';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Agreements</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {mockAgreements.map(agreement => (
          <View key={agreement.id} style={styles.agreementCard}>
            <View style={styles.agreementHeader}>
              <View style={styles.clientInfo}>
                <Text style={styles.clientName}>{agreement.clientName}</Text>
                <Text style={styles.clientPhone}>{agreement.clientPhone}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(agreement.status) + '20' }]}>
                <Ionicons 
                  name={getStatusIcon(agreement.status)} 
                  size={16} 
                  color={getStatusColor(agreement.status)} 
                />
                <Text style={[styles.statusText, { color: getStatusColor(agreement.status) }]}>
                  {agreement.status.charAt(0).toUpperCase() + agreement.status.slice(1)}
                </Text>
              </View>
            </View>

            <View style={styles.agreementDetails}>
              <Text style={styles.meetingType}>{agreement.meetingType}</Text>
              {agreement.propertyAddress && (
                <Text style={styles.propertyAddress}>{agreement.propertyAddress}</Text>
              )}
            </View>

            <View style={styles.agreementFooter}>
              <Text style={styles.dateText}>{formatDate(agreement.createdAt)}</Text>
              <View style={styles.actions}>
                {agreement.status === 'signed' && (
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="download-outline" size={20} color="#4F46E5" />
                  </TouchableOpacity>
                )}
                {agreement.status === 'sent' && (
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="refresh-outline" size={20} color="#4F46E5" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="eye-outline" size={20} color="#4F46E5" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  addButton: {
    backgroundColor: '#4F46E5',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  agreementCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  agreementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  clientPhone: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  agreementDetails: {
    marginBottom: 12,
  },
  meetingType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  propertyAddress: {
    fontSize: 14,
    color: '#6B7280',
  },
  agreementFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  dateText: {
    fontSize: 12,
    color: '#6B7280',
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 12,
    padding: 4,
  },
});

export default AgreementsScreen; 