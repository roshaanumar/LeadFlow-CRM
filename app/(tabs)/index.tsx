import { Ionicons } from '@expo/vector-icons';
import { router, type Href } from 'expo-router';
import {
  useEffect,
  useMemo,
  useState,
  type ComponentProps,
} from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useLeads } from '../../context/LeadContext';
import { useUserProfile } from '../../context/UserProfileContext';
import type { Lead, LeadStatus } from '../../types/lead';

type IconName = ComponentProps<typeof Ionicons>['name'];

interface StatisticCardProps {
  title: string;
  value: number;
  icon: IconName;
  accent: string;
  iconBackground: string;
}

const MONTHLY_CLOSED_DEALS_TARGET = 10;

function StatisticCard({
  title,
  value,
  icon,
  accent,
  iconBackground,
}: StatisticCardProps) {
  return (
    <View style={styles.statCard}>
      <View
        style={[
          styles.statIcon,
          {
            backgroundColor: iconBackground,
          },
        ]}
      >
        <Ionicons name={icon} size={25} color={accent} />
      </View>

      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );
}

function getStatusColors(status: LeadStatus) {
  switch (status) {
    case 'Interested':
      return {
        background: '#392E1D',
        text: '#F59E0B',
      };

    case 'Meeting Booked':
      return {
        background: '#282549',
        text: '#9A91FF',
      };

    case 'Closed':
      return {
        background: '#173B32',
        text: '#41D39B',
      };

    case 'Lost':
      return {
        background: '#3A202A',
        text: '#FF7185',
      };

    case 'Contacted':
      return {
        background: '#18364A',
        text: '#54B9ED',
      };

    default:
      return {
        background: '#203B75',
        text: '#8FAAFF',
      };
  }
}

function RecentLeadCard({ lead }: { lead: Lead }) {
  const statusColors = getStatusColors(lead.status);

  return (
    <View style={styles.recentLeadCard}>
      <View style={styles.recentLeadAvatar}>
        <Text style={styles.recentLeadAvatarText}>
          {lead.contactName.charAt(0).toUpperCase()}
        </Text>
      </View>

      <View style={styles.recentLeadInformation}>
        <Text style={styles.recentLeadName}>{lead.contactName}</Text>

        <Text style={styles.recentLeadCompany}>
          {lead.company || 'No company provided'}
        </Text>
      </View>

      <View
        style={[
          styles.recentLeadStatus,
          {
            backgroundColor: statusColors.background,
          },
        ]}
      >
        <Text
          style={[
            styles.recentLeadStatusText,
            {
              color: statusColors.text,
            },
          ]}
        >
          {lead.status}
        </Text>
      </View>
    </View>
  );
}

export default function DashboardScreen() {
  const { leads } = useLeads();

  const {
    userName,
    setUserName,
    isProfileLoaded,
  } = useUserProfile();

  const [isEditingName, setIsEditingName] = useState(false);
  const [draftName, setDraftName] = useState('');

  useEffect(() => {
    if (!isProfileLoaded) {
      return;
    }

    setDraftName(userName);
    setIsEditingName(!userName.trim());
  }, [isProfileLoaded, userName]);

  const statistics = useMemo(() => {
    const totalLeads = leads.length;

    const activeLeads = leads.filter(
      (lead) =>
        lead.status !== 'Closed' &&
        lead.status !== 'Lost',
    ).length;

    const interestedLeads = leads.filter(
      (lead) => lead.status === 'Interested',
    ).length;

    const meetingLeads = leads.filter(
      (lead) => lead.status === 'Meeting Booked',
    ).length;

    const closedLeads = leads.filter(
      (lead) => lead.status === 'Closed',
    ).length;

    return {
      totalLeads,
      activeLeads,
      interestedLeads,
      meetingLeads,
      closedLeads,
    };
  }, [leads]);

  const monthlyProgress = Math.min(
    100,
    Math.round(
      (statistics.closedLeads /
        MONTHLY_CLOSED_DEALS_TARGET) *
        100,
    ),
  );

  const progressWidth =
    `${monthlyProgress}%` as `${number}%`;

  const recentLeads = leads.slice(0, 3);

  const currentHour = new Date().getHours();

  const greeting =
    currentHour < 12
      ? 'Good morning'
      : currentHour < 18
        ? 'Good afternoon'
        : 'Good evening';

  const displayedName = userName.trim() || 'User';

  const handleSaveName = () => {
    const cleanedName = draftName.trim();

    if (!cleanedName) {
      return;
    }

    setUserName(cleanedName);
    setIsEditingName(false);
  };

  const handleCancelNameEdit = () => {
    setDraftName(userName);
    setIsEditingName(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerInformation}>
            <Text style={styles.greeting}>
              {greeting}, {displayedName}
            </Text>

            {isEditingName ? (
              <View style={styles.nameEditContainer}>
                <TextInput
                  value={draftName}
                  onChangeText={setDraftName}
                  placeholder="Enter your name"
                  placeholderTextColor="#71809B"
                  style={styles.nameInput}
                  autoFocus
                  onSubmitEditing={handleSaveName}
                />

                <Pressable
                  style={[
                    styles.saveNameButton,
                    !draftName.trim() &&
                      styles.disabledNameButton,
                  ]}
                  disabled={!draftName.trim()}
                  onPress={handleSaveName}
                >
                  <Text style={styles.saveNameText}>Save</Text>
                </Pressable>

                {userName.trim() ? (
                  <Pressable
                    style={styles.cancelNameButton}
                    onPress={handleCancelNameEdit}
                  >
                    <Ionicons
                      name="close-outline"
                      size={20}
                      color="#8290A8"
                    />
                  </Pressable>
                ) : null}
              </View>
            ) : (
              <Pressable
                onPress={() => {
                  setDraftName(userName);
                  setIsEditingName(true);
                }}
              >
                <Text style={styles.changeNameText}>
                  Change name
                </Text>
              </Pressable>
            )}

            <Text style={styles.headerTitle}>
              LeadFlow Dashboard
            </Text>
          </View>

          <View style={styles.profile}>
            <Text style={styles.profileText}>
              {displayedName.charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroDecoration} />

          <Text style={styles.heroLabel}>SALES PIPELINE</Text>

          <Text style={styles.heroValue}>
            {statistics.activeLeads}{' '}
            {statistics.activeLeads === 1
              ? 'Active Lead'
              : 'Active Leads'}
          </Text>

          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>
              Monthly progress
            </Text>

            <Text style={styles.progressPercentage}>
              {monthlyProgress}%
            </Text>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressBar,
                {
                  width: progressWidth,
                },
              ]}
            />
          </View>

          <Text style={styles.progressDescription}>
            {statistics.closedLeads} of{' '}
            {MONTHLY_CLOSED_DEALS_TARGET} closed-deal target
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Overview</Text>

        <View style={styles.statsGrid}>
          <StatisticCard
            title="Total Leads"
            value={statistics.totalLeads}
            icon="people-outline"
            accent="#4F7CFF"
            iconBackground="#172B51"
          />

          <StatisticCard
            title="Interested"
            value={statistics.interestedLeads}
            icon="flame-outline"
            accent="#F59E0B"
            iconBackground="#392E1D"
          />

          <StatisticCard
            title="Meetings"
            value={statistics.meetingLeads}
            icon="calendar-outline"
            accent="#9A91FF"
            iconBackground="#282549"
          />

          <StatisticCard
            title="Closed Deals"
            value={statistics.closedLeads}
            icon="checkmark-circle-outline"
            accent="#41D39B"
            iconBackground="#173B32"
          />
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <View style={styles.actions}>
          <Pressable
            style={styles.primaryButton}
            onPress={() =>
              router.push('/add-lead' as Href)
            }
          >
            <View style={styles.primaryButtonIcon}>
              <Ionicons
                name="person-add-outline"
                size={22}
                color="#FFFFFF"
              />
            </View>

            <View>
              <Text style={styles.primaryButtonTitle}>
                Add New Lead
              </Text>

              <Text style={styles.primaryButtonDescription}>
                Create a new sales opportunity
              </Text>
            </View>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={() =>
              router.push('/lead-management' as Href)
            }
          >
            <View style={styles.secondaryButtonIcon}>
              <Ionicons
                name="people-outline"
                size={22}
                color="#8FAAFF"
              />
            </View>

            <View>
              <Text style={styles.secondaryButtonTitle}>
                View Pipeline
              </Text>

              <Text style={styles.secondaryButtonDescription}>
                Search and manage your leads
              </Text>
            </View>
          </Pressable>
        </View>

        <View style={styles.recentSectionHeader}>
          <Text style={styles.sectionTitle}>Recent Leads</Text>

          {leads.length > 0 ? (
            <Pressable
              onPress={() =>
                router.push('/lead-management' as Href)
              }
            >
              <Text style={styles.viewAllText}>View all</Text>
            </Pressable>
          ) : null}
        </View>

        {recentLeads.length === 0 ? (
          <View style={styles.emptyRecentLeads}>
            <View style={styles.emptyRecentIcon}>
              <Ionicons
                name="people-outline"
                size={34}
                color="#4F7CFF"
              />
            </View>

            <Text style={styles.emptyRecentTitle}>
              No leads added yet
            </Text>

            <Text style={styles.emptyRecentDescription}>
              Add your first lead to begin tracking your sales
              pipeline.
            </Text>
          </View>
        ) : (
          <View style={styles.recentLeadList}>
            {recentLeads.map((lead) => (
              <RecentLeadCard key={lead.id} lead={lead} />
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
    backgroundColor: '#081120',
  },
  screen: {
    flex: 1,
    backgroundColor: '#081120',
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
  headerInformation: {
    flex: 1,
  },
  greeting: {
    color: '#8EA7D5',
    fontSize: 16,
    marginBottom: 5,
  },
  changeNameText: {
    alignSelf: 'flex-start',
    color: '#7C9DFF',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 3,
    marginBottom: 8,
  },
  nameEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 9,
    marginTop: 7,
    marginBottom: 10,
  },
  nameInput: {
    width: 220,
    minHeight: 44,
    paddingHorizontal: 14,
    color: '#FFFFFF',
    backgroundColor: '#111D32',
    borderWidth: 1,
    borderColor: '#20304A',
    borderRadius: 12,
    fontSize: 14,
  },
  saveNameButton: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 17,
    backgroundColor: '#4F7CFF',
    borderRadius: 11,
  },
  disabledNameButton: {
    opacity: 0.45,
  },
  saveNameText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  cancelNameButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111D32',
    borderWidth: 1,
    borderColor: '#20304A',
    borderRadius: 11,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 31,
    fontWeight: '800',
  },
  profile: {
    width: 58,
    height: 58,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4F7CFF',
    borderRadius: 18,
  },
  profileText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  heroCard: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#172641',
    borderWidth: 1,
    borderColor: '#253A5C',
    borderRadius: 26,
    padding: 28,
    marginBottom: 36,
  },
  heroDecoration: {
    position: 'absolute',
    top: -50,
    right: -40,
    width: 180,
    height: 180,
    backgroundColor: '#29427A',
    borderRadius: 90,
  },
  heroLabel: {
    color: '#7C9DFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  heroValue: {
    color: '#FFFFFF',
    fontSize: 35,
    fontWeight: '800',
    marginTop: 14,
    marginBottom: 33,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 11,
  },
  progressLabel: {
    color: '#A9B9D4',
    fontSize: 15,
  },
  progressPercentage: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  progressTrack: {
    height: 10,
    overflow: 'hidden',
    backgroundColor: '#2A3B59',
    borderRadius: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4F7CFF',
    borderRadius: 8,
  },
  progressDescription: {
    color: '#8290A8',
    fontSize: 12,
    marginTop: 10,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 18,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,
    marginBottom: 38,
  },
  statCard: {
    flexGrow: 1,
    flexBasis: 260,
    minHeight: 175,
    justifyContent: 'space-between',
    backgroundColor: '#111D32',
    borderWidth: 1,
    borderColor: '#20304A',
    borderRadius: 22,
    padding: 22,
  },
  statIcon: {
    width: 54,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 31,
    fontWeight: '800',
    marginTop: 19,
  },
  statTitle: {
    color: '#8290A8',
    fontSize: 14,
    marginTop: 6,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 38,
  },
  primaryButton: {
    flexGrow: 1,
    flexBasis: 320,
    minHeight: 86,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F7CFF',
    borderRadius: 19,
    paddingHorizontal: 21,
    gap: 15,
  },
  primaryButtonIcon: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3C67DF',
    borderRadius: 14,
  },
  primaryButtonTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  primaryButtonDescription: {
    color: '#D8E1FF',
    fontSize: 13,
    marginTop: 4,
  },
  secondaryButton: {
    flexGrow: 1,
    flexBasis: 320,
    minHeight: 86,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111D32',
    borderWidth: 1,
    borderColor: '#20304A',
    borderRadius: 19,
    paddingHorizontal: 21,
    gap: 15,
  },
  secondaryButtonIcon: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#172B51',
    borderRadius: 14,
  },
  secondaryButtonTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryButtonDescription: {
    color: '#8290A8',
    fontSize: 13,
    marginTop: 4,
  },
  recentSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  viewAllText: {
    color: '#7C9DFF',
    fontSize: 14,
    fontWeight: '700',
  },
  recentLeadList: {
    gap: 13,
  },
  recentLeadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111D32',
    borderWidth: 1,
    borderColor: '#20304A',
    borderRadius: 18,
    padding: 18,
  },
  recentLeadAvatar: {
    width: 47,
    height: 47,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#203B75',
    borderRadius: 15,
    marginRight: 14,
  },
  recentLeadAvatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  recentLeadInformation: {
    flex: 1,
  },
  recentLeadName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  recentLeadCompany: {
    color: '#8290A8',
    fontSize: 13,
    marginTop: 4,
  },
  recentLeadStatus: {
    borderRadius: 18,
    paddingHorizontal: 13,
    paddingVertical: 7,
  },
  recentLeadStatusText: {
    fontSize: 12,
    fontWeight: '800',
  },
  emptyRecentLeads: {
    alignItems: 'center',
    backgroundColor: '#111D32',
    borderWidth: 1,
    borderColor: '#20304A',
    borderRadius: 20,
    paddingVertical: 42,
    paddingHorizontal: 20,
  },
  emptyRecentIcon: {
    width: 68,
    height: 68,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#172B51',
    borderRadius: 22,
    marginBottom: 16,
  },
  emptyRecentTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  emptyRecentDescription: {
    maxWidth: 380,
    color: '#8290A8',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});