import { supabase } from './supabase';

/**
 * supabaseService for interacting with Supabase, like fetching user profiles, history, activities, etc.
 * All services are exported from this file to use in the UI components.
 * Components should import these services to interact with Supabase, not the supabase client directly
 * Available services:
 * - profileService - for fetching and updating user profile and preferences data
 * - historyService - for fetching purchase and interaction history
 * - activityService - for fetching activity logs
 * - supportService - for fetching support tickets
 * - rewardsService - for fetching rewards history
 * - userService - to get non-admin users for user selection since there's no login portal
 */

/**
 * profileService for interacting with user profiles in Supabase
 */
export const profileService = {
  async fetchProfile(profileId) {
    try {
      // Fetch single user profile data from Supabase
      const { data, error } = await supabase
        .from('user_profile')
        .select(`
          *,
          USERS (
            role
          )
        `)
        .eq('profile_id', profileId)
        .single();

      if (error) throw error;

      return {
        data: {
          firstname: data.first_name,
          lastname: data.last_name,
          email: data.email,
          phone: data.contact_number,
          address: data.address,
          role: data.USERS?.role,
          dateCreated: new Date(data.created_at).toLocaleDateString(),
          dateUpdated: new Date(data.updated_at).toLocaleDateString(),
          preferences: data.preferences,
        },
        error: null,
      };
    } catch (error) {
      console.error('Error fetching profile:', error);
      return { data: null, error };
    }
  },

  /**
   * updateProfile function to update user profile data in Supabase
   */
  async updateProfile(profileId, userData) {
    try {
      const { error } = await supabase
        .from('user_profile')
        .update({
          first_name: userData.firstname,
          last_name: userData.lastname,
          email: userData.email,
          contact_number: userData.phone,
          address: userData.address,
          updated_at: new Date().toISOString(),
        })
        .eq('profile_id', profileId);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { error };
    }
  },

  /**
   * updatePreferences function to update user preferences in Supabase
   */
  async updatePreferences(profileId, preferences) {
    try {
      const { error } = await supabase
        .from('user_profile')
        .update({
          preferences: preferences,
          updated_at: new Date().toISOString(),
        })
        .eq('profile_id', profileId);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Error updating preferences:', error);
      return { error };
    }
  },

  /**
   * fetchAllUsers function to fetch all users from Supabase
   */
  async fetchAllUsers() {
    try {
      const { data, error } = await supabase
        .from('user_profile')
        .select(`
          profile_id,
          first_name,
          last_name,
          USERS:user_id (
            role
          )
        `)
        .order('profile_id');

      if (error) throw error;

      return {
        data: data.map(user => ({
          id: user.profile_id,
          name: `${user.first_name} ${user.last_name}`,
          role: user.USERS.role
        })),
        error: null
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      return { data: null, error };
    }
  }
};

export const historyService = {
  /**
   * fetchHistory function to fetch history from Supabase
   */
  async fetchHistory(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const { data, error } = await supabase
        .from('history_log')
        .select(`
          history_id,
          user_id,
          activity_type,
          activity_description,
          activity_date,
          purchase_cost
        `)
        .eq('user_id', userId)
        .order('activity_date', { ascending: false });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching history:', error);
      return { data: null, error };
    }
  }
};

export const activityService = {
  /**
   * fetchActivities function to fetch activities from Supabase
   */
  async fetchActivities(userId, isAdmin = false) {
    try {
      if (!isAdmin && !userId) {
        throw new Error('User ID is required for non-admin users');
      }

      // Build the activity query
      let query = supabase
        .from('activity_log')
        .select('*')
        .order('activity_date', { ascending: false });

      // Only filter by user_id if NOT an admin
      if (!isAdmin) {
        query = query.eq('user_id', userId);
      }

      const { data: activityData, error: activityError } = await query;

      if (activityError) throw activityError;

      // Get user profiles for mapping names
      const { data: profileData, error: profileError } = await supabase
        .from('user_profile')
        .select('user_id, first_name, last_name');

      if (profileError) throw profileError;

      // Create a map of user profiles for quick lookup
      const userProfileMap = profileData.reduce((acc, profile) => {
        acc[profile.user_id] = profile;
        return acc;
      }, {});

      // Transform the data
      const transformedData = activityData.map(activity => ({
        activity_id: activity.activity_id,
        user_id: activity.user_id,
        activity_type: activity.activity_type,
        activity_description: activity.activity_description,
        activity_date: new Date(activity.activity_date).toLocaleString(),
        userName: userProfileMap[activity.user_id] 
          ? `${userProfileMap[activity.user_id].first_name} ${userProfileMap[activity.user_id].last_name}`
          : `User ${activity.user_id}`
      }));

      return { data: transformedData, error: null };
    } catch (error) {
      console.error('Error fetching activities:', error);
      return { 
        data: [], 
        error: {
          message: 'Failed to fetch activities',
          details: error
        }
      };
    }
  }
};

export const supportService = {
  /**
   * fetchTickets function to fetch tickets from Supabase
   */
  async fetchTickets(userId, isAdmin = false) {
    try {
      if (!isAdmin && !userId) {
        throw new Error('User ID is required for non-admin users');
      }

      let query = supabase
        .from('support_tickets')
        .select(`
          *,
          user_profile!support_tickets_user_id_fkey (
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false });

      if (!isAdmin) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) throw error;

      const transformedData = data.map(ticket => ({
        ...ticket,
        userName: ticket.user_profile 
          ? `${ticket.user_profile.first_name} ${ticket.user_profile.last_name}`
          : `User ${ticket.user_id}`
      }));

      return { data: transformedData, error: null };
    } catch (error) {
      console.error('Error fetching tickets:', error);
      return { data: null, error };
    }
  }
};

export const rewardsService = {
  /**
   * fetchRewards function to fetch rewards from Supabase
   */
  async fetchRewards(userId) {
    try {
      const { data, error } = await supabase
        .from('rewards')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const totals = data.reduce((acc, curr) => ({
        pointsEarned: acc.pointsEarned + (curr.points_earned || 0),
        pointsRedeemed: acc.pointsRedeemed + (curr.points_redeemed || 0),
      }), { pointsEarned: 0, pointsRedeemed: 0 });

      return {
        data: {
          history: data,
          totalPointsEarned: totals.pointsEarned,
          totalPointsRedeemed: totals.pointsRedeemed,
          totalPoints: totals.pointsEarned - totals.pointsRedeemed,
        },
        error: null
      };
    } catch (error) {
      console.error('Error fetching rewards:', error);
      return { data: null, error };
    }
  }
};

export const userService = {
  /**
   * fetchNonAdminUsers function to fetch non-admin users from Supabase
   */
  async fetchNonAdminUsers() {
    try {
      const { data, error } = await supabase
        .from('user_profile')
        .select(`
          user_id,
          first_name,
          last_name,
          USERS (
            role
          )
        `)
        .neq('USERS.role', 'admin')
        .order('first_name');

      if (error) throw error;

      const transformedData = data.map(user => ({
        user_id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.USERS?.role
      }));

      return { data: transformedData, error: null };
    } catch (error) {
      console.error('Error fetching users:', error);
      return { data: null, error };
    }
  }
};