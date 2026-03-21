import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { setEndpoints, setSelectedEndpoint } from '../redux/slices/endpointSlice';
import type { Endpoint } from '../redux/slices/endpointSlice';
import api from '../services/api';
import Navbar from '../components/Navbar';
import TestingConsole from '../components/TestingConsole';
import AIExplanation from '../components/AIExplanation';
import { Search, Code as CodeIcon, Server, Database, ArrowLeft, Terminal, LayoutDashboard, Settings, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const dispatch = useDispatch();
  const { endpoints, selectedEndpoint } = useSelector((state: RootState) => state.endpoint);

  useEffect(() => {
    const fetchEndpoints = async () => {
      try {
        const res = await api.get(`/endpoints/project/${id}`);
        dispatch(setEndpoints(res.data));
      } catch (error) {
        console.error('Failed to fetch endpoints', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchEndpoints();
  }, [id, dispatch]);

  const methodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'POST': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'PUT': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'DELETE': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'PATCH': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      default: return 'text-muted-foreground bg-muted/20 border-border';
    }
  };

  const filteredEndpoints = endpoints.filter(ep => 
    ep.path.toLowerCase().includes(searchQuery.toLowerCase()) || 
    ep.method.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-80 border-r border-border bg-card/30 backdrop-blur-sm flex flex-col h-[calc(100vh-4rem)]">
          <div className="p-6 border-b border-border space-y-4">
            <Link to="/dashboard" className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary flex items-center gap-2 transition-all group">
              <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
              Projects
            </Link>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Find endpoint..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-border rounded-xl bg-background/50 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
            {loading ? (
              <div className="flex flex-col gap-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-10 bg-muted/50 animate-pulse rounded-lg" />
                ))}
              </div>
            ) : filteredEndpoints.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
                <Search className="h-8 w-8 opacity-20" />
                Nothing found
              </div>
            ) : (
              <div className="space-y-1">
                {filteredEndpoints.map((ep: Endpoint) => (
                  <button
                    key={ep.id}
                    onClick={() => dispatch(setSelectedEndpoint(ep))}
                    className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 text-sm transition-all duration-200 group ${
                      selectedEndpoint?.id === ep.id 
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                        : 'hover:bg-muted/50 text-foreground'
                    }`}
                  >
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded border transition-colors ${
                      selectedEndpoint?.id === ep.id ? 'bg-white/20 border-white/30 text-white' : methodColor(ep.method)
                    }`}>
                      {ep.method}
                    </span>
                    <span className="truncate flex-1 font-medium">{ep.path}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 h-[calc(100vh-4rem)] overflow-y-auto bg-muted/5 custom-scrollbar">
          <AnimatePresence mode="wait">
            {selectedEndpoint ? (
              <motion.div 
                key={selectedEndpoint.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8 max-w-6xl mx-auto space-y-8 pb-20"
              >
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-2xl border ${methodColor(selectedEndpoint.method)} shadow-sm`}>
                      <CodeIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold tracking-tight font-mono">{selectedEndpoint.path}</h1>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <span className="font-bold border-r border-border pr-2">{selectedEndpoint.method}</span>
                        <span>API ENDPOINT</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2.5 bg-muted/50 hover:bg-muted rounded-xl transition-colors border border-border">
                      <Settings className="h-4 w-4" />
                    </button>
                    <button className="p-2.5 bg-muted/50 hover:bg-muted rounded-xl transition-colors border border-border">
                      <LayoutDashboard className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* AI Explanation Integrated */}
                <AIExplanation 
                  endpointId={selectedEndpoint.id} 
                  initialExplanation={selectedEndpoint.ai_explanation} 
                />

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {/* Left Column: Schemas */}
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                          <Database className="w-5 h-5 text-primary" /> Request Schema
                        </h3>
                        <span className="text-[10px] font-bold bg-muted px-2 py-0.5 rounded uppercase tracking-widest">JSON</span>
                      </div>
                      <div className="bg-card/50 backdrop-blur border border-border rounded-2xl p-6 overflow-hidden relative shadow-sm">
                        {selectedEndpoint.request_schema ? (
                          <pre className="text-xs font-mono text-foreground/80 overflow-x-auto leading-relaxed">
                            {JSON.stringify(selectedEndpoint.request_schema, null, 2)}
                          </pre>
                        ) : (
                          <p className="text-sm text-muted-foreground italic flex items-center gap-2">
                            <Info className="h-4 w-4" /> No request payload required for this method.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                          <Server className="w-5 h-5 text-green-500" /> Response Schema
                        </h3>
                        <span className="text-[10px] font-bold bg-muted px-2 py-0.5 rounded uppercase tracking-widest">JSON</span>
                      </div>
                      <div className="bg-card/50 backdrop-blur border border-border rounded-2xl p-6 overflow-hidden relative shadow-sm">
                        {selectedEndpoint.response_schema ? (
                          <pre className="text-xs font-mono text-green-600 dark:text-green-400 overflow-x-auto leading-relaxed">
                            {JSON.stringify(selectedEndpoint.response_schema, null, 2)}
                          </pre>
                        ) : (
                          <p className="text-sm text-muted-foreground italic">No response schema detected.</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Testing Console */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <Terminal className="w-5 h-5 text-primary" /> API Testing Console
                    </h3>
                    <TestingConsole endpoint={selectedEndpoint} />
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-6 animate-pulse">
                <div className="p-8 bg-muted/20 rounded-full border border-border/50">
                  <CodeIcon className="w-16 h-16 opacity-30" />
                </div>
                <div className="text-center max-w-xs">
                  <h2 className="text-xl font-bold text-foreground mb-2">Select an Endpoint</h2>
                  <p className="text-sm opacity-60">Choose an endpoint from the left sidebar to start exploring, testing and documenting your API.</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default ProjectDetails;
