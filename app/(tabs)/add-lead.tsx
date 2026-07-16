import { useLeads } from '@/context/LeadContext';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type LeadStatus =
  | 'New'
  | 'Contacted'
  | 'Interested'
  | 'Meeting Booked'
  | 'Closed';

type FormData = {
  name: string;
  company: string;
  email: string;
  phone: string;
  status: LeadStatus;
  followUpDate: string;
  notes: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

type FormFieldProps = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  placeholder: string;
  value: string;
  error?: string;
  keyboardType?: TextInputProps['keyboardType'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  onChangeText: (value: string) => void;
};

const statuses: LeadStatus[] = [
  'New',
  'Contacted',
  'Interested',
  'Meeting Booked',
  'Closed',
];

function readParameter(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? '';
  }

  return value ?? '';
}

function isLeadStatus(value: string): value is LeadStatus {
  return statuses.includes(value as LeadStatus);
}

function FormField({
  label,
  icon,
  placeholder,
  value,
  error,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  onChangeText,
}: FormFieldProps) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>

      <View
        style={[
          styles.inputContainer,
          error ? styles.inputContainerError : undefined,
        ]}
      >
        <Ionicons name={icon} size={20} color="#71809B" />

        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#53627A"
          value={value}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onChangeText={onChangeText}
        />
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

export default function AddLeadScreen() {
  const { addLead, updateLead } = useLeads();
  const parameters = useLocalSearchParams();

  const parameterStatus = readParameter(parameters.status);
  const initialStatus: LeadStatus = isLeadStatus(parameterStatus)
    ? parameterStatus
    : 'New';

  const leadId = readParameter(parameters.id);
  const isEditing = Boolean(leadId);

  const emptyForm: FormData = {
    name: '',
    company: '',
    email: '',
    phone: '',
    status: 'New',
    followUpDate: '',
    notes: '',
  };

  const initialForm: FormData = {
    name: readParameter(parameters.name),
    company: readParameter(parameters.company),
    email: readParameter(parameters.email),
    phone: readParameter(parameters.phone),
    status: initialStatus,
    followUpDate: readParameter(parameters.followUpDate),
    notes: readParameter(parameters.notes),
  };

  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState('');

  function updateField<K extends keyof FormData>(
    field: K,
    value: FormData[K],
  ) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));

    setErrors((currentErrors) => {
      const updatedErrors = { ...currentErrors };
      delete updatedErrors[field];
      return updatedErrors;
    });

    setSuccessMessage('');
  }

  function validateForm(): boolean {
    const newErrors: FormErrors = {};

    if (!form.name.trim()) {
      newErrors.name = 'Contact name is required.';
    }

    if (!form.company.trim()) {
      newErrors.company = 'Company name is required.';
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = 'Enter a valid email address.';
    }

    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    }

    if (!form.followUpDate.trim()) {
      newErrors.followUpDate = 'Follow-up date is required.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

function handleSubmit() {
  if (!validateForm()) {
    return;
  }

const leadData = {
  contactName: form.name.trim(),
  company: form.company.trim(),
  email: form.email.trim(),
  phone: form.phone.trim(),
  status: form.status,
  followUpDate: form.followUpDate,
  notes: form.notes.trim(),
};

if (isEditing && leadId) {
  updateLead(leadId, leadData);
} else {
  addLead(leadData);
}

  setSuccessMessage(
    isEditing
      ? 'Lead updated successfully.'
      : 'Lead added successfully.',
  );
}

  function handleClear() {
    setForm(emptyForm);
    setErrors({});
    setSuccessMessage('');
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Ionicons
                name={isEditing ? 'create-outline' : 'person-add-outline'}
                size={25}
                color="#9EB4FF"
              />
            </View>

            <View style={styles.headerTextContainer}>
              <Text style={styles.eyebrow}>LEADFLOW CRM</Text>

              <Text style={styles.title}>
                {isEditing ? 'Edit Lead' : 'Add New Lead'}
              </Text>

              <Text style={styles.subtitle}>
                {isEditing
                  ? 'Update the customer information and follow-up details.'
                  : 'Enter customer information to add a new opportunity to the sales pipeline.'}
              </Text>
            </View>
          </View>

          {successMessage ? (
            <View style={styles.successBanner}>
              <Ionicons
                name="checkmark-circle"
                size={21}
                color="#4ADE80"
              />

              <Text style={styles.successText}>{successMessage}</Text>
            </View>
          ) : null}

          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>Contact Information</Text>

            <FormField
              label="Contact Name"
              icon="person-outline"
              placeholder="e.g. Alex Morgan"
              value={form.name}
              error={errors.name}
              autoCapitalize="words"
              onChangeText={(value) => updateField('name', value)}
            />

            <FormField
              label="Company Name"
              icon="business-outline"
              placeholder="e.g. Vintage Hub"
              value={form.company}
              error={errors.company}
              autoCapitalize="words"
              onChangeText={(value) => updateField('company', value)}
            />

            <View style={styles.twoColumnRow}>
              <View style={styles.column}>
                <FormField
                  label="Email Address"
                  icon="mail-outline"
                  placeholder="alex@company.com"
                  value={form.email}
                  error={errors.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onChangeText={(value) => updateField('email', value)}
                />
              </View>

              <View style={styles.column}>
                <FormField
                  label="Phone Number"
                  icon="call-outline"
                  placeholder="+44 7123 456789"
                  value={form.phone}
                  error={errors.phone}
                  keyboardType="phone-pad"
                  onChangeText={(value) => updateField('phone', value)}
                />
              </View>
            </View>

            <Text style={styles.sectionTitle}>Lead Progress</Text>

            <Text style={styles.label}>Lead Status</Text>

            <View style={styles.statusContainer}>
              {statuses.map((status) => {
                const isSelected = form.status === status;

                return (
                  <Pressable
                    key={status}
                    onPress={() => updateField('status', status)}
                    style={({ pressed }) => [
                      styles.statusChip,
                      isSelected
                        ? styles.selectedStatusChip
                        : undefined,
                      pressed ? styles.pressed : undefined,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusChipText,
                        isSelected
                          ? styles.selectedStatusChipText
                          : undefined,
                      ]}
                    >
                      {status}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <FormField
              label="Follow-up Date"
              icon="calendar-outline"
              placeholder="YYYY-MM-DD"
              value={form.followUpDate}
              error={errors.followUpDate}
              autoCapitalize="none"
              onChangeText={(value) =>
                updateField('followUpDate', value)
              }
            />

            <Text style={styles.label}>Notes</Text>

            <View style={styles.notesContainer}>
              <Ionicons
                name="document-text-outline"
                size={20}
                color="#71809B"
                style={styles.notesIcon}
              />

              <TextInput
                style={styles.notesInput}
                placeholder="Add call notes, buyer preferences or other details..."
                placeholderTextColor="#53627A"
                value={form.notes}
                onChangeText={(value) => updateField('notes', value)}
                multiline
                textAlignVertical="top"
              />
            </View>

            <View style={styles.buttonRow}>
              <Pressable
                onPress={handleClear}
                style={({ pressed }) => [
                  styles.secondaryButton,
                  pressed ? styles.pressed : undefined,
                ]}
              >
                <Ionicons
                  name="refresh-outline"
                  size={20}
                  color="#AFC2FF"
                />

                <Text style={styles.secondaryButtonText}>Clear</Text>
              </Pressable>

              <Pressable
                onPress={handleSubmit}
                style={({ pressed }) => [
                  styles.primaryButton,
                  pressed ? styles.pressed : undefined,
                ]}
              >
                <Ionicons
                  name={
                    isEditing
                      ? 'save-outline'
                      : 'add-circle-outline'
                  }
                  size={21}
                  color="#FFFFFF"
                />

                <Text style={styles.primaryButtonText}>
                  {isEditing ? 'Save Changes' : 'Add Lead'}
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#081120',
  },
  content: {
    width: '100%',
    maxWidth: 950,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 25,
  },
  headerIcon: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor: '#182B50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  headerTextContainer: {
    flex: 1,
  },
  eyebrow: {
    color: '#7897FF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: 5,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 29,
    fontWeight: '800',
  },
  subtitle: {
    color: '#8290A8',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 7,
    maxWidth: 650,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#123523',
    borderWidth: 1,
    borderColor: '#22643D',
    borderRadius: 15,
    padding: 14,
    marginBottom: 17,
  },
  successText: {
    color: '#86EFAC',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 9,
  },
  formCard: {
    backgroundColor: '#111D32',
    borderWidth: 1,
    borderColor: '#1D2B43',
    borderRadius: 24,
    padding: 22,
  },
  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 17,
    marginTop: 4,
  },
  fieldContainer: {
    marginBottom: 18,
  },
  label: {
    color: '#B5C0D2',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  inputContainer: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0B1628',
    borderWidth: 1,
    borderColor: '#263650',
    borderRadius: 15,
    paddingHorizontal: 15,
  },
  inputContainerError: {
    borderColor: '#EF4444',
  },
  input: {
    flex: 1,
    minHeight: 52,
    color: '#F8FAFC',
    fontSize: 14,
    marginLeft: 11,
  },
  errorText: {
    color: '#F87171',
    fontSize: 12,
    marginTop: 6,
  },
  twoColumnRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  column: {
    flex: 1,
    minWidth: 250,
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
    marginBottom: 21,
  },
  statusChip: {
    borderWidth: 1,
    borderColor: '#2A3A55',
    backgroundColor: '#0B1628',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  selectedStatusChip: {
    borderColor: '#4F7CFF',
    backgroundColor: '#1B356C',
  },
  statusChipText: {
    color: '#8290A8',
    fontSize: 12,
    fontWeight: '700',
  },
  selectedStatusChipText: {
    color: '#C7D3FF',
  },
  notesContainer: {
    minHeight: 130,
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#0B1628',
    borderWidth: 1,
    borderColor: '#263650',
    borderRadius: 15,
    padding: 15,
    marginBottom: 24,
  },
  notesIcon: {
    marginTop: 2,
    marginRight: 10,
  },
  notesInput: {
    flex: 1,
    minHeight: 98,
    color: '#F8FAFC',
    fontSize: 14,
    lineHeight: 21,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    gap: 12,
  },
  secondaryButton: {
    minWidth: 130,
    height: 54,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2A3D60',
    backgroundColor: '#15233B',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  secondaryButtonText: {
    color: '#AFC2FF',
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 8,
  },
  primaryButton: {
    minWidth: 155,
    height: 54,
    borderRadius: 16,
    backgroundColor: '#4F7CFF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 8,
  },
  pressed: {
    opacity: 0.75,
  },
});