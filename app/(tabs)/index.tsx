import { Ionicons } from '@expo/vector-icons';
import { router, type Href } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLeads } from '../../context/LeadContext';

type IconName = keyof typeof Ionicons.glyphMap;

type StatisticCardProps = {
  title: string;
  value: string;
  icon: IconName;
  accent: string;
};

const recentLeads = [
  {
    id: 1,
    name: 'Alex Morgan',
    company: 'Vintage Hub',
    status: 'Interested',
    followUp: '18 July',
  },
  {
    id: 2,
    name: 'Emma Wilson',
    company: 'Urban Archive',
    status: 'Meeting Booked',
    followUp: '20 July',
  },
  {
    id: 3,
    name: 'Daniel Smith',
    company: 'Retro Supply Co.',
    status: 'Contacted',
    followUp: '22 July',
  },
];

function StatisticCard({
  title,
  value,
  icon,
  accent,
}: StatisticCardProps) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.iconContainer, { backgroundColor: `${accent}20` }]}>
        <Ionicons name={icon} size={22} color={accent} />
      </View>

      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );
}

function getStatusStyle(status: string) {
  if (status === 'Interested') {
    return {
      backgroundColor: '#F59E0B20',
      color: '#FBBF24',
    };
  }

  if (status === 'Meeting Booked') {
    return {
      backgroundColor: '#8B5CF620',
      color: '#A78BFA',
    };
  }

  return {
    backgroundColor: '#3B82F620',
    color: '#60A5FA',
  };
}

export default function DashboardScreen() {
  const { leads } = useLeads();
  const totalLeads = leads.length;

const activeLeads = leads.filter(
  (lead) => lead.status !== 'Closed' && lead.status !== 'Lost',
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
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good evening, Roshaan</Text>
            <Text style={styles.headerTitle}>LeadFlow Dashboard</Text>
          </View>

          <View style={styles.profile}>
            <Text style={styles.profileText}>R</Text>
          </View>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroGlow} />

          <Text style={styles.heroLabel}>SALES PIPELINE</Text>
          <Text style={styles.heroValue}>{activeLeads} Active Leads</Text>

          <View style={styles.progressRow}>
            <Text style={styles.progressText}>Monthly progress</Text>
            <Text style={styles.progressPercentage}>68%</Text>
          </View>

          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Overview</Text>

        <View style={styles.statsGrid}>
          <StatisticCard
            title="Total Leads"
            value={String(totalLeads)}
            icon="people-outline"
            accent="#4F7CFF"
          />

          <StatisticCard
            title="Interested"
            value={String(interestedLeads)}
            icon="flame-outline"
            accent="#F59E0B"
          />

          <StatisticCard
            title="Meetings"
            value={String(meetingLeads)}
            icon="calendar-outline"
            accent="#8B5CF6"
          />

          <StatisticCard
            title="Closed Deals"
            value={String(closedLeads)}
            icon="trophy-outline"
            accent="#22C55E"
          />
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <View style={styles.actionRow}>
          <Pressable
  style={styles.primaryButton}
  onPress={() => router.push('/add-lead' as Href)}
>

            <Ionicons name="add" size={22} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Add New Lead</Text>
          </Pressable>

          <Pressable style={styles.secondaryButton}>
            <Ionicons name="funnel-outline" size={20} color="#AFC2FF" />
            <Text style={styles.secondaryButtonText}>View Pipeline</Text>
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Leads</Text>

          <Pressable>
            <Text style={styles.viewAllText}>View all</Text>
          </Pressable>
        </View>

        <View style={styles.leadsContainer}>
          {recentLeads.map((lead) => {
            const statusStyle = getStatusStyle(lead.status);

            return (
              <Pressable key={lead.id} style={styles.leadCard}>
                <View style={styles.leadAvatar}>
                  <Text style={styles.leadAvatarText}>
                    {lead.name.charAt(0)}
                  </Text>
                </View>

                <View style={styles.leadInformation}>
                  <Text style={styles.leadName}>{lead.name}</Text>
                  <Text style={styles.companyName}>{lead.company}</Text>

                  <View style={styles.followUpRow}>
                    <Ionicons
                      name="time-outline"
                      size={14}
                      color="#71809B"
                    />
                    <Text style={styles.followUpText}>
                      Follow-up: {lead.followUp}
                    </Text>
                  </View>
                </View>

                <View style={styles.leadRight}>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: statusStyle.backgroundColor },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: statusStyle.color },
                      ]}
                    >
                      {lead.status}
                    </Text>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color="#52617A"
                  />
                </View>
              </Pressable>
            );
          })}
        </View>
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
    maxWidth: 1100,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },

  greeting: {
    color: '#8290A8',
    fontSize: 14,
    marginBottom: 5,
  },

  headerTitle: {
    color: '#F8FAFC',
    fontSize: 26,
    fontWeight: '800',
  },

  profile: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: '#4F7CFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },

  heroCard: {
    overflow: 'hidden',
    backgroundColor: '#14213B',
    borderRadius: 24,
    padding: 24,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: '#243657',
  },

  heroGlow: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: '#4F7CFF35',
    right: -55,
    top: -80,
  },

  heroLabel: {
    color: '#8FA8FF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.4,
  },

  heroValue: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '800',
    marginTop: 8,
    marginBottom: 26,
  },

  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 9,
  },

  progressText: {
    color: '#A6B2C7',
    fontSize: 13,
  },

  progressPercentage: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  progressTrack: {
    height: 8,
    borderRadius: 20,
    backgroundColor: '#263653',
    overflow: 'hidden',
  },

  progressFill: {
    width: '68%',
    height: '100%',
    borderRadius: 20,
    backgroundColor: '#4F7CFF',
  },

  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 14,
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  statCard: {
    width: '48.5%',
    backgroundColor: '#111D32',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#1D2B43',
  },

  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },

  statValue: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: '800',
  },

  statTitle: {
    color: '#8290A8',
    fontSize: 13,
    marginTop: 5,
  },

  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
  },

  primaryButton: {
    flex: 1,
    height: 55,
    borderRadius: 17,
    backgroundColor: '#4F7CFF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },

  secondaryButton: {
    flex: 1,
    height: 55,
    borderRadius: 17,
    backgroundColor: '#15233B',
    borderWidth: 1,
    borderColor: '#2A3D60',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },

  secondaryButtonText: {
    color: '#AFC2FF',
    fontSize: 15,
    fontWeight: '700',
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  viewAllText: {
    color: '#6F91FF',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 14,
  },

  leadsContainer: {
    gap: 12,
  },

  leadCard: {
    backgroundColor: '#111D32',
    borderRadius: 19,
    padding: 15,
    borderWidth: 1,
    borderColor: '#1D2B43',
    flexDirection: 'row',
    alignItems: 'center',
  },

  leadAvatar: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: '#24385F',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 13,
  },

  leadAvatarText: {
    color: '#9EB4FF',
    fontSize: 17,
    fontWeight: '800',
  },

  leadInformation: {
    flex: 1,
  },

  leadName: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '800',
  },

  companyName: {
    color: '#8795AB',
    fontSize: 13,
    marginTop: 3,
  },

  followUpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },

  followUpText: {
    color: '#71809B',
    fontSize: 11,
  },

  leadRight: {
    alignItems: 'flex-end',
    gap: 12,
  },

  statusBadge: {
    maxWidth: 110,
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },

  statusText: {
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
  },
});
