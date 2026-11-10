import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchPlayerProfile } from '../services/api';
import { usePlayerStore } from '../store/usePlayerStore';

/**
 * Custom Hook for fetching, caching, and managing player profile data.
 * Features:
 * - In-memory cache for instant switching between profiles and players
 * - AbortController to cancel stale in-flight requests and prevent race conditions
 * - Clean loading state management without infinite re-render cycles
 */
export function usePlayerProfile(initialNickname = 'ReefRunner', initialProfile = 'Lime') {
  const { setStats } = usePlayerStore();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentUsername, setCurrentUsername] = useState(initialNickname);
  const [currentProfile, setCurrentProfile] = useState(initialProfile);

  const abortControllerRef = useRef(null);
  const cacheRef = useRef(new Map());

  const loadProfile = useCallback(
    async (nick, prof) => {
      const targetNick = (nick || initialNickname || 'ReefRunner').trim();
      const targetProf = (prof || initialProfile || 'Lime').trim();
      const cacheKey = `${targetNick.toLowerCase()}:${targetProf.toLowerCase()}`;

      // Check cache first for instant UI response
      if (cacheRef.current.has(cacheKey)) {
        const cached = cacheRef.current.get(cacheKey);
        setProfileData(cached);
        setCurrentUsername(cached.username || targetNick);
        setCurrentProfile(cached.profile || targetProf);
        if (cached.stats) setStats(cached.stats);
        setLoading(false);
        setError(null);
        return;
      }

      // Cancel previous request if still running
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const ac = new AbortController();
      abortControllerRef.current = ac;

      setLoading(true);
      setError(null);

      try {
        const data = await fetchPlayerProfile(targetNick, targetProf, ac.signal);
        if (ac.signal.aborted) return;

        cacheRef.current.set(cacheKey, data);
        setProfileData(data);
        setCurrentUsername(data.username || targetNick);
        setCurrentProfile(data.profile || targetProf);
        if (data.stats) {
          setStats(data.stats);
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Не вдалося завантажити профіль гравця');
        }
      } finally {
        if (!ac.signal.aborted) {
          setLoading(false);
        }
      }
    },
    [initialNickname, initialProfile, setStats]
  );

  // Load when initial props change (e.g. route param /profile/:player)
  useEffect(() => {
    loadProfile(initialNickname, initialProfile);
  }, [initialNickname, initialProfile, loadProfile]);

  const changeProfile = useCallback(
    (newProfileName) => {
      setCurrentProfile(newProfileName);
      loadProfile(currentUsername, newProfileName);
    },
    [currentUsername, loadProfile]
  );

  const searchNickname = useCallback(
    (newNick) => {
      const trimmed = newNick.trim();
      if (!trimmed) return;
      setCurrentUsername(trimmed);
      loadProfile(trimmed, currentProfile);
    },
    [currentProfile, loadProfile]
  );

  return {
    profileData,
    loading,
    error,
    currentUsername,
    currentProfile,
    changeProfile,
    searchNickname,
    refetch: () => loadProfile(currentUsername, currentProfile),
  };
}
