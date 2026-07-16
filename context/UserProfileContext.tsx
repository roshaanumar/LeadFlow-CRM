import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ReactNode } from 'react';
import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';

const USER_NAME_STORAGE_KEY = 'leadflow-user-name';

interface UserProfileContextValue {
  userName: string;
  setUserName: (name: string) => void;
  isProfileLoaded: boolean;
}

const UserProfileContext =
  createContext<UserProfileContextValue | undefined>(undefined);

export function UserProfileProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [userName, setUserNameState] = useState('');
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);

  useEffect(() => {
    async function loadUserName() {
      try {
        const savedName = await AsyncStorage.getItem(
          USER_NAME_STORAGE_KEY,
        );

        if (savedName) {
          setUserNameState(savedName);
        }
      } catch (error) {
        console.error('Failed to load user name:', error);
      } finally {
        setIsProfileLoaded(true);
      }
    }

    void loadUserName();
  }, []);

  useEffect(() => {
    if (!isProfileLoaded) {
      return;
    }

    async function saveUserName() {
      try {
        const cleanedName = userName.trim();

        if (cleanedName) {
          await AsyncStorage.setItem(
            USER_NAME_STORAGE_KEY,
            cleanedName,
          );
        } else {
          await AsyncStorage.removeItem(USER_NAME_STORAGE_KEY);
        }
      } catch (error) {
        console.error('Failed to save user name:', error);
      }
    }

    void saveUserName();
  }, [userName, isProfileLoaded]);

  const setUserName = (name: string) => {
    setUserNameState(name);
  };

  const value = useMemo(
    () => ({
      userName,
      setUserName,
      isProfileLoaded,
    }),
    [userName, isProfileLoaded],
  );

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);

  if (!context) {
    throw new Error(
      'useUserProfile must be used inside a UserProfileProvider',
    );
  }

  return context;
}