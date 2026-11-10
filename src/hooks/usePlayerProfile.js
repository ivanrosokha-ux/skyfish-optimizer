import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchPlayerProfile } from '../services/api';
import { usePlayerStore } from '../store/usePlayerStore';

/**
 * Custom Hook for fetching, caching, and managing player profile data
 */
export function usePlayerProfile(initialNickname = 'ReefRunner', initialProfile = 'Lime') {
  const { username, profile, setUsername, setProfile, setStats } = usePlayerStore();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const lastFetchedKey = useRef('');

  const loadProfile = useCallback(
    async (nick, prof) => {
      const key = `${(nick || '').toLowerCase()}:${(prof || '').toLowerCase()}`;
      if (lastFetchedKey.current === key && profileData) {
        return;
      }
      lastFetchedKey.current = key;

      setLoading(true);
      setError(null);
      try {
        const data = await fetchPlayerProfile(nick, prof);
        setProfileData(data);
        if (data.stats) {
          setStats(data.stats);
        }
        if (data.profile && data.profile !== prof) {
          lastFetchedKey.current = `${(data.username || nick).toLowerCase()}:${data.profile.toLowerCase()}`;
          setProfile(data.profile);
        }
        if (data.username && data.username !== nick) {
          setUsername(data.username);
        }
      } catch (err) {
        setError(err.message || 'Не вдалося завантажити профіль гравця');
      } finally {
        setLoading(false);
      }
    },
    [setStats, setProfile, setUsername, profileData]
  );

  useEffect(() => {
    loadProfile(username || initialNickname, profile || initialProfile);
  }, [username, profile, initialNickname, initialProfile, loadProfile]);

  const changeProfile = useCallback(
    (newProfileName) => {
      lastFetchedKey.current = '';
      setProfile(newProfileName);
      loadProfile(username, newProfileName);
    },
    [username, setProfile, loadProfile]
  );

  const searchNickname = useCallback(
    (newNick) => {
      lastFetchedKey.current = '';
      setUsername(newNick);
      loadProfile(newNick, profile);
    },
    [profile, setUsername, loadProfile]
  );

  return {
    profileData,
    loading,
    error,
    currentUsername: username,
    currentProfile: profile,
    changeProfile,
    searchNickname,
    refetch: () => {
      lastFetchedKey.current = '';
      loadProfile(username, profile);
    },
  };
}
