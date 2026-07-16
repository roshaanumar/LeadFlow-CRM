import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ReactNode } from 'react';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import type { Lead } from '../types/lead';

const LEADS_STORAGE_KEY = 'leadflow-leads';

type NewLead = Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>;

type LeadUpdates = Partial<
  Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>
>;

interface LeadContextValue {
  leads: Lead[];
  addLead: (lead: NewLead) => void;
  updateLead: (id: string, updates: LeadUpdates) => void;
  deleteLead: (id: string) => void;
  getLeadById: (id: string) => Lead | undefined;
}

const LeadContext = createContext<LeadContextValue | undefined>(undefined);

export function LeadProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isStorageLoaded, setIsStorageLoaded] = useState(false);

  useEffect(() => {
    async function loadSavedLeads() {
      try {
        const savedLeads = await AsyncStorage.getItem(LEADS_STORAGE_KEY);

        if (savedLeads) {
          setLeads(JSON.parse(savedLeads) as Lead[]);
        }
      } catch (error) {
        console.error('Failed to load saved leads:', error);
      } finally {
        setIsStorageLoaded(true);
      }
    }

    void loadSavedLeads();
  }, []);

  useEffect(() => {
    if (!isStorageLoaded) {
      return;
    }

    async function saveLeads() {
      try {
        await AsyncStorage.setItem(
          LEADS_STORAGE_KEY,
          JSON.stringify(leads),
        );
      } catch (error) {
        console.error('Failed to save leads:', error);
      }
    }

    void saveLeads();
  }, [leads, isStorageLoaded]);

  const addLead = (lead: NewLead) => {
    const currentTime = new Date().toISOString();

    const newLead: Lead = {
      ...lead,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      createdAt: currentTime,
      updatedAt: currentTime,
    };

    setLeads((currentLeads) => [newLead, ...currentLeads]);
  };

  const updateLead = (id: string, updates: LeadUpdates) => {
    setLeads((currentLeads) =>
      currentLeads.map((lead) =>
        lead.id === id
          ? {
              ...lead,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : lead,
      ),
    );
  };

  const deleteLead = (id: string) => {
    setLeads((currentLeads) =>
      currentLeads.filter((lead) => lead.id !== id),
    );
  };

  const getLeadById = (id: string) => {
    return leads.find((lead) => lead.id === id);
  };

  const value = useMemo(
    () => ({
      leads,
      addLead,
      updateLead,
      deleteLead,
      getLeadById,
    }),
    [leads],
  );

  return (
    <LeadContext.Provider value={value}>
      {children}
    </LeadContext.Provider>
  );
}

export function useLeads() {
  const context = useContext(LeadContext);

  if (!context) {
    throw new Error('useLeads must be used inside a LeadProvider');
  }

  return context;
}