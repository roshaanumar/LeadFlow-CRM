import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useLeads } from '@/context/LeadContext';
import type { LeadStatus } from '@/types/lead';

type StatusFilter = 'All' | LeadStatus;

const statuses: StatusFilter[] = [
  'All',
  'New',
  'Contacted',
  'Interested',
  'Meeting Booked',
  'Closed',
];

export default function LeadManagementScreen() {
  const { leads, deleteLead } = useLeads();
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] =
    useState<StatusFilter>('All');

  const filteredLeads = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return leads.filter((lead) => {
      const matchesSearch =
        lead.contactName.toLowerCase().includes(searchText) ||
        lead.company.toLowerCase().includes(searchText) ||
        lead.email.toLowerCase().includes(searchText);

      const matchesStatus =
        selectedStatus === 'All' || lead.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [leads, search, selectedStatus]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>LEADFLOW CRM</Text>
            <Text style={styles.title}>Lead Management</Text>
            <Text style={styles.subtitle}>
              Search, filter, edit and manage your sales leads.
            </Text>
          </View>

          <View style={styles.countBadge}>
            <Text style={styles.countNumber}>{leads.length}</Text>
            <Text style={styles.countLabel}>Total Leads</Text>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={21} color="#71809B" />
          <TextInput
            placeholder="Search by name, company or email..."
            placeholderTextColor="#71809B"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />

          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={21} color="#71809B" />
            </Pressable>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
        >
          {statuses.map((status) => {
            const isSelected = selectedStatus === status;

            return (
              <Pressable
                key={status}
                style={[
                  styles.filterButton,
                  isSelected && styles.filterButtonActive,
                ]}
                onPress={() => setSelectedStatus(status)}
              >
                <Text
                  style={[
                    styles.filterText,
                    isSelected && styles.filterTextActive,
                  ]}
                >
                  {status}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <Text style={styles.resultsText}>
          {filteredLeads.length}{' '}
          {filteredLeads.length === 1 ? 'lead' : 'leads'} found
        </Text>

        {filteredLeads.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="people-outline" size={40} color="#4F7CFF" />
            </View>

            <Text style={styles.emptyTitle}>No leads found</Text>
            <Text style={styles.emptyText}>
              Add a new lead or change your search and filter options.
            </Text>
          </View>
        ) : (
          <View style={styles.leadList}>
            {filteredLeads.map((lead) => (
              <View key={lead.id} style={styles.leadCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {lead.contactName.charAt(0).toUpperCase()}
                    </Text>
                  </View>

                  <View style={styles.leadHeading}>
                    <Text style={styles.contactName}>
                      {lead.contactName}
                    </Text>
                    <Text style={styles.company}>{lead.company}</Text>
                  </View>

                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>{lead.status}</Text>
                  </View>
                </View>

                <View style={styles.details}>
                  <View style={styles.detailRow}>
                    <Ionicons
                      name="mail-outline"
                      size={18}
                      color="#8290A8"
                    />
                    <Text style={styles.detailText}>
                      {lead.email || 'No email provided'}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Ionicons
                      name="call-outline"
                      size={18}
                      color="#8290A8"
                    />
                    <Text style={styles.detailText}>
                      {lead.phone || 'No phone provided'}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Ionicons
                      name="calendar-outline"
                      size={18}
                      color="#8290A8"
                    />
                    <Text style={styles.detailText}>
                      Follow-up: {lead.followUpDate}
                    </Text>
                  </View>
                </View>

                <View style={styles.actions}>
                  <Pressable
                    style={styles.editButton}
                    onPress={() =>
                      router.push({
                        pathname: '/add-lead',
                        params: {
                          id: lead.id,
                          name: lead.contactName,
                          company: lead.company,
                          email: lead.email,
                          phone: lead.phone,
                          status: lead.status,
                          followUpDate: lead.followUpDate,
                          notes: lead.notes,
                        },
                      })
                    }
                  >
                    <Ionicons
                      name="create-outline"
                      size={18}
                      color="#FFFFFF"
                    />
                    <Text style={styles.editButtonText}>Edit</Text>
                  </Pressable>

                  <Pressable
                    style={styles.deleteButton}
                    onPress={() => deleteLead(lead.id)}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={18}
                      color="#FF6B78"
                    />
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#071120',
  },
  screen: {
    flex: 1,
    backgroundColor: '#071120',
  },
  content: {
    width: '100%',
    maxWidth: 1260,
    alignSelf: 'center',
    paddingHorizontal: 28,
    paddingTop: 30,
    paddingBottom: 110,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
    gap: 20,
  },
  eyebrow: {
    color: '#7C9DFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '800',
  },
  subtitle: {
    color: '#8290A8',
    fontSize: 16,
    marginTop: 8,
  },
  countBadge: {
    minWidth: 115,
    backgroundColor: '#111D32',
    borderWidth: 1,
    borderColor: '#20304A',
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 14,
    alignItems: 'center',
  },
  countNumber: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: '800',
  },
  countLabel: {
    color: '#8290A8',
    fontSize: 12,
    marginTop: 2,
  },
  searchContainer: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0C182A',
    borderWidth: 1,
    borderColor: '#20304A',
    borderRadius: 16,
    paddingHorizontal: 18,
    marginBottom: 18,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
  },
  filters: {
    gap: 10,
    paddingBottom: 20,
  },
  filterButton: {
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 22,
    backgroundColor: '#111D32',
    borderWidth: 1,
    borderColor: '#20304A',
  },
  filterButtonActive: {
    backgroundColor: '#4F7CFF',
    borderColor: '#4F7CFF',
  },
  filterText: {
    color: '#8D9AB0',
    fontSize: 13,
    fontWeight: '700',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  resultsText: {
    color: '#8290A8',
    fontSize: 14,
    marginBottom: 14,
  },
  leadList: {
    gap: 15,
  },
  leadCard: {
    backgroundColor: '#111D32',
    borderWidth: 1,
    borderColor: '#20304A',
    borderRadius: 20,
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: '#203B75',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '800',
  },
  leadHeading: {
    flex: 1,
  },
  contactName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  company: {
    color: '#8290A8',
    fontSize: 14,
    marginTop: 3,
  },
  statusBadge: {
    backgroundColor: '#203B75',
    borderRadius: 20,
    paddingHorizontal: 13,
    paddingVertical: 7,
  },
  statusText: {
    color: '#8FAAFF',
    fontSize: 12,
    fontWeight: '800',
  },
  details: {
    marginTop: 20,
    gap: 11,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detailText: {
    color: '#AAB5C8',
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  editButton: {
    flex: 1,
    minHeight: 46,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4F7CFF',
    borderRadius: 12,
    gap: 8,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  deleteButton: {
    flex: 1,
    minHeight: 46,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#251B2A',
    borderWidth: 1,
    borderColor: '#523044',
    borderRadius: 12,
    gap: 8,
  },
  deleteButtonText: {
    color: '#FF6B78',
    fontSize: 14,
    fontWeight: '800',
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: '#111D32',
    borderWidth: 1,
    borderColor: '#20304A',
    borderRadius: 20,
    paddingVertical: 65,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: '#172B51',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '800',
  },
  emptyText: {
    color: '#8290A8',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});