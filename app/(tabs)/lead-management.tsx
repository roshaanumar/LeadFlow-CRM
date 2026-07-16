import { useLeads } from '@/context/LeadContext';
import { router } from 'expo-router';
import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
export default function LeadManagementScreen() {
  const { leads, deleteLead } = useLeads();
const [search, setSearch] = useState('');
const [selectedStatus, setSelectedStatus] = useState('All');
const statuses = [
  'All',
  'New',
  'Contacted',
  'Interested',
  'Meeting Booked',
  'Closed',
];
 return (
  <View style={styles.container}>
    <Text style={styles.title}>Lead Management</Text>
    <TextInput
  placeholder="Search leads..."
  value={search}
  onChangeText={setSearch}
  style={{
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    width: '90%',
  }}
/>
<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
  {statuses.map((status) => (
    <Button
      key={status}
      title={status}
      onPress={() => setSelectedStatus(status)}
    />
  ))}
</View>
    {leads.length === 0 ? (
      <Text>No leads found.</Text>
    ) : (
      leads
 .filter((lead) =>
  (lead.company.toLowerCase().includes(search.toLowerCase()) ||
   lead.contactName.toLowerCase().includes(search.toLowerCase())) &&
  (selectedStatus === 'All' || lead.status === selectedStatus)
)
  .map((lead) => (
        <View
          key={lead.id}
          style={{
            borderWidth: 1,
            padding: 10,
            marginVertical: 5,
            width: '90%',
          }}
        >
          <Text>{lead.contactName}</Text>
          <Text>{lead.company}</Text>
          <Text>{lead.status}</Text>
   <Button
  title="Edit"
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
/>
        <Button
            title="Delete"
            onPress={() => deleteLead(lead.id)}
          />
        </View>
      ))
    )}
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});