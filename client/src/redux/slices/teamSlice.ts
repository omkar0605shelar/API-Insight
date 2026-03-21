import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface TeamMember {
  user_id: string;
  role: 'ADMIN' | 'MEMBER' | 'VIEWER';
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Team {
  id: string;
  name: string;
  members: TeamMember[];
  created_at: string;
}

interface TeamState {
  teams: Team[];
  currentTeam: Team | null;
  loading: boolean;
}

const initialState: TeamState = {
  teams: [],
  currentTeam: null,
  loading: false,
};

const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    setTeams: (state, action: PayloadAction<Team[]>) => {
      state.teams = action.payload;
    },
    addTeam: (state, action: PayloadAction<Team>) => {
      state.teams.unshift(action.payload);
    },
    setCurrentTeam: (state, action: PayloadAction<Team | null>) => {
      state.currentTeam = action.payload;
    },
    updateTeamMember: (state, action: PayloadAction<{ teamId: string; member: TeamMember }>) => {
      const team = state.teams.find(t => t.id === action.payload.teamId);
      if (team) {
        const index = team.members.findIndex(m => m.user_id === action.payload.member.user_id);
        if (index !== -1) {
          team.members[index] = action.payload.member;
        } else {
          team.members.push(action.payload.member);
        }
      }
      if (state.currentTeam?.id === action.payload.teamId) {
        const index = state.currentTeam.members.findIndex(m => m.user_id === action.payload.member.user_id);
        if (index !== -1) {
          state.currentTeam.members[index] = action.payload.member;
        } else {
          state.currentTeam.members.push(action.payload.member);
        }
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }
  },
});

export const { setTeams, addTeam, setCurrentTeam, updateTeamMember, setLoading } = teamSlice.actions;
export default teamSlice.reducer;
