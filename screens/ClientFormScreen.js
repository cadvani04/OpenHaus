import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ClientFormScreen = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState('consent'); // 'consent', 'agreement', 'signature', 'success'
  const [agreementData, setAgreementData] = useState(null);
  const [signature, setSignature] = useState(null);

  useEffect(() => {
    // Mock agreement data - in production this would come from URL params
    const mockData = {
      id: 'agreement-123',
      realtor: {
        name: 'Sarah Johnson',
        company: 'Premier Real Estate',
        phone: '(555) 123-4567',
        email: 'sarah@premierrealestate.com',
        license: 'CA-1234567',
      },
      client: {
        name: 'Sam Wilson',
        phone: '(555) 987-6543'
      },
      meetingType: 'Buyer Consultation',
      state: 'California',
      agreementText: `BUYER CONSULTATION AGREEMENT

This agreement is entered into between Sarah Johnson and Sam Wilson on ${new Date().toLocaleDateString()}.

1. PURPOSE: This consultation is for the purpose of discussing real estate services and market information.

2. CONFIDENTIALITY: All information shared during this consultation will be kept confidential.

3. NO OBLIGATION: This consultation does not create any obligation to enter into a formal agency relationship.

4. COMPLIANCE: This agreement complies with California real estate laws and regulations.

5. DISCLOSURE: California law requires that you receive a copy of the "Agency Relationships in Real Estate Transactions" disclosure.

By signing below, you acknowledge receipt of this consultation agreement and understand its terms.`,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
    };

    setAgreementData(mockData);
  }, []);

  const handleConsent = () => {
    setCurrentStep('agreement');
  };

  const handleAgreementRead = () => {
    setCurrentStep('signature');
  };

  const handleSignatureComplete = (signatureData) => {
    setSignature(signatureData);
  };

  const handleSubmit = async () => {
    if (!signature) {
      Alert.alert('Error', 'Please provide your signature');
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentStep('success');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit agreement. Please try again.');
    }
  };

  const renderConsentStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Meeting Agreement</Text>
        <Text style={styles.subtitle}>
          Please review and sign the agreement for your meeting with {agreementData?.realtor?.name}
        </Text>
      </View>

      <View style={styles.consentBox}>
        <Text style={styles.consentTitle}>ESIGN Consent</Text>
        <Text style={styles.consentText}>
          By proceeding, you consent to receive and sign this agreement electronically. 
          This consent applies to all future agreements sent by {agreementData?.realtor?.name}.
        </Text>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={handleConsent}>
        <Text style={styles.buttonText}>I Consent - Continue to Agreement</Text>
      </TouchableOpacity>
    </View>
  );

  const renderAgreementStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Agreement Details</Text>
        <Text style={styles.meetingType}>{agreementData?.meetingType}</Text>
      </View>

      <ScrollView style={styles.agreementContainer}>
        <Text style={styles.agreementText}>{agreementData?.agreementText}</Text>
      </ScrollView>

      <View style={styles.warningBox}>
        <Text style={styles.warningText}>
          <Text style={styles.bold}>Important:</Text> This agreement expires on{' '}
          {new Date(agreementData?.expiresAt).toLocaleDateString()}
        </Text>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={handleAgreementRead}>
        <Text style={styles.buttonText}>I've Read the Agreement - Proceed to Sign</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSignatureStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Electronic Signature</Text>
        <Text style={styles.subtitle}>Please sign below to complete the agreement</Text>
      </View>

      <View style={styles.signatureContainer}>
        <View style={styles.signatureBox}>
          <Text style={styles.signaturePlaceholder}>Draw your signature here</Text>
          <TouchableOpacity 
            style={styles.signatureButton}
            onPress={() => {
              // In a real app, this would open a signature pad
              setSignature('signature-data');
            }}
          >
            <Ionicons name="create-outline" size={24} color="#4F46E5" />
            <Text style={styles.signatureButtonText}>Tap to Sign</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.legalBox}>
        <Text style={styles.legalText}>
          <Text style={styles.bold}>Legal Notice:</Text> Your electronic signature has the same legal effect as a handwritten signature.
        </Text>
      </View>

      <TouchableOpacity 
        style={[styles.primaryButton, !signature && styles.disabledButton]} 
        onPress={handleSubmit}
        disabled={!signature}
      >
        <Text style={styles.buttonText}>Submit Agreement</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSuccessStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.successHeader}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark" size={32} color="white" />
        </View>
        <Text style={styles.successTitle}>Agreement Signed!</Text>
        <Text style={styles.successSubtitle}>
          Your meeting agreement has been successfully signed and submitted.
        </Text>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.detailsTitle}>Agreement Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Agreement ID:</Text>
          <Text style={styles.detailValue}>{agreementData?.id}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Signed:</Text>
          <Text style={styles.detailValue}>{new Date().toLocaleString()}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Meeting Type:</Text>
          <Text style={styles.detailValue}>{agreementData?.meetingType}</Text>
        </View>
      </View>

      <View style={styles.nextStepsBox}>
        <Text style={styles.nextStepsTitle}>What's Next?</Text>
        <Text style={styles.nextStepsText}>• You'll receive a confirmation email</Text>
        <Text style={styles.nextStepsText}>• {agreementData?.realtor?.name} will contact you soon</Text>
        <Text style={styles.nextStepsText}>• Download your copy of the agreement below</Text>
      </View>

      <TouchableOpacity style={styles.primaryButton}>
        <Text style={styles.buttonText}>Download PDF Copy</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>This agreement is legally binding and compliant with ESIGN Act</Text>
        <Text style={styles.footerText}>Powered by HomeShow</Text>
      </View>
    </View>
  );

  if (!agreementData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.card}>
            {/* Realtor Info Header */}
            <View style={styles.realtorHeader}>
              <View style={styles.realtorInfo}>
                <Text style={styles.realtorName}>{agreementData.realtor.name}</Text>
                <Text style={styles.realtorCompany}>{agreementData.realtor.company}</Text>
                <Text style={styles.realtorLicense}>License: {agreementData.realtor.license}</Text>
              </View>
              <View style={styles.realtorContact}>
                <View style={styles.contactRow}>
                  <Ionicons name="mail-outline" size={16} color="white" />
                  <Text style={styles.contactText}>{agreementData.realtor.email}</Text>
                </View>
                <View style={styles.contactRow}>
                  <Ionicons name="call-outline" size={16} color="white" />
                  <Text style={styles.contactText}>{agreementData.realtor.phone}</Text>
                </View>
              </View>
            </View>

            {/* Step Content */}
            {currentStep === 'consent' && renderConsentStep()}
            {currentStep === 'agreement' && renderAgreementStep()}
            {currentStep === 'signature' && renderSignatureStep()}
            {currentStep === 'success' && renderSuccessStep()}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    backgroundColor: '#4F46E5',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  realtorHeader: {
    backgroundColor: '#4F46E5',
    padding: 20,
  },
  realtorInfo: {
    marginBottom: 12,
  },
  realtorName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  realtorCompany: {
    fontSize: 14,
    color: '#E0E7FF',
    marginBottom: 2,
  },
  realtorLicense: {
    fontSize: 12,
    color: '#E0E7FF',
  },
  realtorContact: {
    borderTopWidth: 1,
    borderTopColor: '#6366F1',
    paddingTop: 12,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  contactText: {
    fontSize: 12,
    color: '#E0E7FF',
    marginLeft: 8,
  },
  stepContainer: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  meetingType: {
    fontSize: 14,
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  consentBox: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  consentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 8,
  },
  consentText: {
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
  },
  agreementContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    maxHeight: 300,
    marginBottom: 16,
  },
  agreementText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  warningBox: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  warningText: {
    fontSize: 14,
    color: '#92400E',
  },
  signatureContainer: {
    marginBottom: 24,
  },
  signatureBox: {
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signaturePlaceholder: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  signatureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  signatureButtonText: {
    fontSize: 14,
    color: '#4F46E5',
    marginLeft: 8,
    fontWeight: '500',
  },
  legalBox: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#10B981',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  legalText: {
    fontSize: 14,
    color: '#065F46',
  },
  primaryButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  successHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  detailsContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  nextStepsBox: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  nextStepsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 8,
  },
  nextStepsText: {
    fontSize: 14,
    color: '#1E40AF',
    marginBottom: 4,
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  bold: {
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ClientFormScreen; 