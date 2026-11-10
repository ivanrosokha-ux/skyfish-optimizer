import { useState, useEffect, useCallback } from 'react';
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

  const loadProfile = useCallback(
    async (nick, prof) => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPlayerProfile(nick, prof);
        setProfileData(data);
        if (data.stats) {
          setStats(data.stats);
        }
      } catch (err) {
        setError(err.message || 'Не вдалося завантажити профіль гравця');
      } finally {
        setLoading(false);
      }
    },
    [setStats]
  );

  useEffect(() => {
    loadProfile(username || initialNickname, profile || initialProfile);
  }, [username, profile, initialNickname, initialProfile, loadProfile]);

  const changeProfile = useCallback(
    (newProfileName) => {
      setProfile(newProfileName);
      loadProfile(username, newProfileName);
    },
    [username, setProfile, loadProfile]
  );

  const searchNickname = useCallback(
    (newNick) => {
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
    refetch: () => loadProfile(username, profile),
  };
}
