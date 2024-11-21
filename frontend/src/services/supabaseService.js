import { supabase } from './supabase';

export const profileService = {
  async fetchProfile(profileId) {
    try {
      const { data, error } = await supabase
        .from('user_profile')
        .select(`
          *,
          users:user_id (
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
          role: data.users.role,
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

  async updateProfile(profileId, userData) {
    try {
      const { error } = await supabase
        .from('user_profile')
        .update({
          first_name: userData.firstname,
          last_name: userData.lastname,
          email: userData.email,
          contact_number: userData.phone,
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

  async fetchAllUsers() {
    try {
      const { data, error } = await supabase
        .from('user_profile')
        .select(`
          profile_id,
          first_name,
          last_name,
          users:user_id (
            role
          )
        `)
        .order('profile_id');

      if (error) throw error;

      return {
        data: data.map(user => ({
          id: user.profile_id,
          name: `${user.first_name} ${user.last_name}`,
          role: user.users.role
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
  async fetchActivities(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const { data, error } = await supabase
        .from('activity_log')
        .select(`
          activity_id,
          user_id,
          activity_type,
          activity_description,
          activity_date
        `)
        .eq('user_id', userId)
        .order('activity_date', { ascending: false })
        .limit(10);

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching activities:', error);
      return { data: null, error };
    }
  }
};

export const supportService = {
  async fetchTickets(userId) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const { data, error } = await supabase
        .from('support_tickets')
        .select(`
          ticket_id,
          user_id,
          subject,
          description,
          status,
          priority,
          created_at,
          updated_at
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching tickets:', error);
      return { data: null, error };
    }
  }
};

export const rewardsService = {
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