import { useState, useEffect } from 'react';
import { History, Send, Terminal, Loader2, CheckCircle2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { executeApiRequest, getRequestHistory } from '../services/testingService';
import { useDispatch } from 'react-redux';
import { setHistory } from '../redux/slices/endpointSlice';

interface TestingConsoleProps {
  endpoint: any;
}

const TestingConsole = ({ endpoint }: TestingConsoleProps) => {
  const [activeTab, setActiveTab] = useState<'params' | 'headers' | 'body' | 'response'>('body');
  const [requestBody, setRequestBody] = useState(JSON.stringify(endpoint.request_schema || {}, null, 2));
  const [headers, setHeaders] = useState('{\n  "Content-Type": "application/json"\n}');
  const [executing, setExecuting] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    setRequestBody(JSON.stringify(endpoint.request_schema || {}, null, 2));
    loadHistory();
  }, [endpoint.id]);

  const loadHistory = async () => {
    try {
      const history = await getRequestHistory(endpoint.id);
      dispatch(setHistory({ endpointId: endpoint.id, history }));
    } catch (err) {
      console.error('Failed to load history', err);
    }
  };

  const handleExecute = async () => {
    setExecuting(true);
    setActiveTab('response');
    try {
      const result = await executeApiRequest({
        endpointId: endpoint.id,
        method: endpoint.method,
        url: `http://localhost:5000/api/mock/${endpoint.project_id}${endpoint.path}`, // Using mock server by default
        headers: JSON.parse(headers),
        body: endpoint.method !== 'GET' ? JSON.parse(requestBody) : undefined
      });
      setResponse(result);
      loadHistory();
    } catch (err: any) {
      setResponse({
        error: true,
        message: err.response?.data?.message || err.message,
        status: err.response?.status || 500
      });
    } finally {
      setExecuting(false);
    }
  };

  const statusColor = (status: number) => {
    if (status < 300) return 'text-green-500';
    if (status < 400) return 'text-blue-500';
    return 'text-red-500';
  };

  return (
    <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[600px]">
      {/* Header / URL Bar */}
      <div className="p-4 border-b border-border bg-muted/30 flex items-center gap-3">
        <div className={`px-3 py-1 rounded-md font-bold text-xs ${
          endpoint.method === 'GET' ? 'bg-blue-500/10 text-blue-500' :
          endpoint.method === 'POST' ? 'bg-green-500/10 text-green-500' :
          endpoint.method === 'PUT' ? 'bg-yellow-500/10 text-yellow-500' :
          'bg-red-500/10 text-red-500'
        }`}>
          {endpoint.method}
        </div>
        <div className="flex-1 bg-background/50 border border-border rounded-lg px-3 py-1.5 text-sm font-mono truncate">
          {endpoint.path}
        </div>
        <button
          onClick={handleExecute}
          disabled={executing}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-1.5 rounded-lg font-medium flex items-center transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
        >
          {executing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
          Send
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border bg-muted/10">
        {['body', 'headers', 'params', 'response'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-3 text-xs font-semibold uppercase tracking-wider transition-all relative ${
              activeTab === tab ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              />
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 p-4 overflow-auto font-mono text-sm bg-background/30">
          <AnimatePresence mode="wait">
            {activeTab === 'body' && (
              <motion.textarea
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                className="w-full h-full bg-transparent resize-none focus:outline-none scrollbar-hide"
                placeholder="{}"
              />
            )}
            {activeTab === 'headers' && (
              <motion.textarea
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                value={headers}
                onChange={(e) => setHeaders(e.target.value)}
                className="w-full h-full bg-transparent resize-none focus:outline-none scrollbar-hide"
                placeholder="{}"
              />
            )}
            {activeTab === 'response' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col"
              >
                {response ? (
                  <>
                    <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border/50">
                      <div className="flex items-center gap-1.5">
                        <span className="text-muted-foreground">Status:</span>
                        <span className={`font-bold ${statusColor(response.status)}`}>{response.status}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground">Time:</span>
                        <span className="text-foreground">{response.duration}ms</span>
                      </div>
                    </div>
                    <pre className="flex-1 overflow-auto text-xs text-blue-400 dark:text-blue-300">
                      {JSON.stringify(response.response || response, null, 2)}
                    </pre>
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-3">
                    <Terminal className="h-12 w-12 opacity-20" />
                    <p>Click Send to execute the request</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* History Sidebar/Footer Toggle */}
      <div className="p-3 border-t border-border bg-muted/20 flex items-center justify-between text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
        <div className="flex items-center gap-2">
          <History className="h-3 w-3" />
          Last result: {response ? `${response.status} OK` : 'None'}
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3 text-green-500" />
          Connected to Mock Server
        </div>
      </div>
    </div>
  );
};

export default TestingConsole;
