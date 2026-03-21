import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyTeams, createTeam as createTeamApi, inviteMember } from '../services/teamService';
import { setTeams, addTeam } from '../redux/slices/teamSlice';
import Navbar from '../components/Navbar';
import { Users, UserPlus, Shield, Mail, Plus, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import type { RootState } from '../redux/store';

const Teams = () => {
  const [newTeamName, setNewTeamName] = useState('');
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [inviting, setInviting] = useState(false);
  
  const dispatch = useDispatch();
  const { teams } = useSelector((state: RootState) => state.team);

  const fetchTeams = async () => {
    try {
      const res = await getMyTeams();
      dispatch(setTeams(res));
    } catch (err) {
      console.error('Failed to fetch teams', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName) return;
    setCreating(true);
    try {
      const res = await createTeamApi(newTeamName);
      dispatch(addTeam(res));
      setNewTeamName('');
    } catch (err) {
      alert('Failed to create team');
    } finally {
      setCreating(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !selectedTeamId) return;
    setInviting(true);
    try {
      await inviteMember(selectedTeamId, inviteEmail);
      setInviteEmail('');
      alert('Invitation sent successfully!');
    } catch (err) {
      alert('Failed to invite member');
    } finally {
      setInviting(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/10 flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-black tracking-tight text-foreground flex items-center gap-3">
              <Users className="h-10 w-10 text-primary" /> Teams
            </h1>
            <p className="text-muted-foreground mt-2">Collaborate with your developers and manage project access.</p>
          </motion.div>

          <motion.form 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={handleCreateTeam} 
            className="flex items-center gap-2 w-full md:w-auto"
          >
            <input
              type="text"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              placeholder="Team Name"
              className="px-4 py-2.5 border border-border rounded-xl bg-card focus:ring-2 focus:ring-primary/20 outline-none flex-1 md:w-64"
              required
            />
            <button 
              type="submit" 
              disabled={creating}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2.5 rounded-xl font-bold flex items-center transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
            >
              {creating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              Create
            </button>
          </motion.form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Teams List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 className="text-xl font-bold flex items-center gap-2 tracking-tight">
                <Shield className="h-5 w-5 text-primary" /> Active Teams
              </h2>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((_, i) => <div key={i} className="h-24 bg-card/50 animate-pulse rounded-2xl border border-border" />)}
              </div>
            ) : teams.length === 0 ? (
              <div className="py-20 text-center border-2 border-dashed border-border rounded-3xl bg-card/30 flex flex-col items-center gap-4">
                <div className="p-6 bg-muted/20 rounded-full">
                  <Users className="h-12 w-12 text-muted-foreground opacity-30" />
                </div>
                <div className="max-w-xs">
                  <h3 className="text-lg font-bold">No teams found</h3>
                  <p className="text-muted-foreground text-sm mt-1">Create a team to start collaborating on your projects with others.</p>
                </div>
              </div>
            ) : (
              <div className="grid gap-4">
                {teams.map((team, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={team.id}
                    className={`p-6 bg-card border border-border rounded-3xl hover:border-primary/50 transition-all group relative cursor-pointer ${selectedTeamId === team.id ? 'ring-2 ring-primary/20 border-primary' : ''}`}
                    onClick={() => setSelectedTeamId(team.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-black text-xl text-primary group-hover:underline">{team.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1 uppercase tracking-widest font-bold">
                          Created {new Date(team.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex -space-x-3">
                        {team.members.map((member: any) => (
                          <div 
                            key={member.user_id} 
                            className="h-8 w-8 rounded-full bg-muted border-2 border-card flex items-center justify-center text-[10px] font-bold"
                            title={member.user?.name}
                          >
                            {member.user?.name?.[0].toUpperCase()}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-6 flex items-center gap-6">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        {team.members.length} Members
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                        Active
                      </div>
                    </div>

                    {selectedTeamId === team.id && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute -top-2 -right-2 bg-primary text-primary-foreground p-1 rounded-full"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Invitation Sidebar */}
          <div className="space-y-6">
            <div className={`p-8 bg-primary/5 border border-primary/20 rounded-3xl transition-opacity animate-in fade-in zoom-in duration-300 ${!selectedTeamId ? 'opacity-50 pointer-events-none' : ''}`}>
              <h3 className="font-black text-xl flex items-center gap-2 mb-2">
                <UserPlus className="h-5 w-5 text-primary" /> Invite Member
              </h3>
              <p className="text-sm text-muted-foreground mb-6">Add a new developer to your team via email.</p>
              
              <form onSubmit={handleInvite} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] items-center font-black uppercase tracking-widest text-muted-foreground flex gap-1.5">
                    <Mail className="h-3 w-3" /> Email Address
                  </label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="teammate@example.com"
                    className="w-full px-4 py-3 border border-border rounded-xl bg-card focus:ring-2 focus:ring-primary/20 outline-none"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={inviting || !selectedTeamId}
                  className="w-full bg-foreground text-background hover:bg-foreground/90 py-3 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 shadow-xl"
                >
                  {inviting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                  Send Invitation
                </button>
              </form>
            </div>
            
            <div className="p-6 bg-card border border-border rounded-3xl">
              <h4 className="font-bold flex items-center gap-2 mb-4 text-sm uppercase tracking-wider">
                <Shield className="h-4 w-4 text-primary" /> Role Privileges
              </h4>
              <ul className="space-y-3 text-xs">
                <li className="flex gap-2">
                  <span className="font-black text-primary">ADMIN</span>
                  <span className="text-muted-foreground">Full access to settings, members and projects.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-black text-blue-500">MEMBER</span>
                  <span className="text-muted-foreground">Can edit projects, run tests and view docs.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-black text-muted-foreground">VIEWER</span>
                  <span className="text-muted-foreground">Read-only access to documentation.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Teams;
