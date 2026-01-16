import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

type Unit = { unit_id: string; label?: string };
type FaultRow = { id: string; category: string; description: string };
type ReportRow = any;

const STORAGE_KEY = 'kamoa_local_queue_v1';

export default function Home() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [library, setLibrary] = useState<Record<string, FaultRow[]>>({});
  const [history, setHistory] = useState<ReportRow[]>([]);
  const [currentUnit, setCurrentUnit] = useState<Unit | null>(null);
  const [description, setDescription] = useState('');
  const [output, setOutput] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const [operator, setOperator] = useState('');
  const [tonnage, setTonnage] = useState('');
  const [notes, setNotes] = useState('');

  const newFaultTextRef = useRef<HTMLInputElement | null>(null);
  const newFaultCatRef = useRef<HTMLSelectElement | null>(null);

  // clock
  const [clock, setClock] = useState('--:--:--');
  const [dateStr, setDateStr] = useState('--/--/----');

  useEffect(() => {
    fetchUnits();
    fetchLibrary();
    fetchReports();

    const t = setInterval(() => {
      const now = new Date();
      setClock(now.toLocaleTimeString('en-GB', { hour12: false }));
      setDateStr(now.toLocaleDateString('fr-FR'));
    }, 1000);

    // realtime subscription to INSERT on reports
    const channel = supabase
      .channel('public:reports')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'reports' }, (payload) => {
        setHistory(prev => [payload.new as ReportRow, ...prev]);
      })
      .subscribe();

    return () => {
      clearInterval(t);
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchUnits() {
    const { data, error } = await supabase.from('units').select('*').order('unit_id');
    if (error) return console.error(error);
    setUnits(data || []);
    if ((data || []).length > 0 && !currentUnit) setCurrentUnit((data || [])[0]);
  }

  async function fetchLibrary() {
    const { data, error } = await supabase.from('faults_library').select('*').order('created_at', { ascending: false });
    if (error) return console.error(error);
    const grouped: Record<string, FaultRow[]> = {};
    (data || []).forEach((r: any) => {
      if (!grouped[r.category]) grouped[r.category] = [];
      grouped[r.category].push(r);
    });
    setLibrary(grouped);
  }

  async function fetchReports() {
    const { data, error } = await supabase.from('reports').select('*').order('created_at', { ascending: false }).limit(200);
    if (error) return console.error(error);
    setHistory(data || []);
  }

  async function addNewFault() {
    const text = newFaultTextRef.current?.value.trim();
    const cat = newFaultCatRef.current?.value || 'Safety';
    if (!text) return;
    const { error } = await supabase.from('faults_library').insert([{ category: cat, description: text }]);
    if (error) return console.error(error);
    newFaultTextRef.current!.value = '';
    fetchLibrary();
  }

  async function processReport(status: 'STOPPED'|'RUNNING', emojiIcon: string) {
    const desc = description.trim();
    if (!desc || !currentUnit) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-GB', { hour12: false });

    let raw = '';
    if (status === 'STOPPED') {
      raw = `*${emojiIcon} ${currentUnit.unit_id} ${status}* ${timeStr}\n- ${desc}`;
    } else {
      raw = `*${emojiIcon} ${currentUnit.unit_id} ${status}* ${timeStr}\n- Fixed: ${desc}`;
    }

    const payload = {
      unit_id: currentUnit.unit_id,
      status,
      emoji: emojiIcon,
      description: desc,
      raw_message: raw,
      created_at: now.toISOString()
    };

    const { data, error } = await supabase.from('reports').insert([payload]).select();
    if (error) {
      console.error('Insert failed, queueing locally', error);
      enqueueLocal(payload);
    } else {
      setOutput(raw);
      setShowPreview(true);
      setDescription('');
      // realtime will add to history
    }
  }

  function enqueueLocal(item: any) {
    try {
      const q = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      q.push(item);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(q));
    } catch (e) {
      console.error(e);
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(output).then(() => {
      // optional UI feedback
    });
  }

  async function generateFullReport() {
    const header = `📊 *SHIFT REPORT - KAMOA 1*\nDate: ${dateStr}\nOperator: ${operator || 'N/A'}\nTonnage: ${tonnage || '0'} t\n--------------------------\n`;
    const body = history.map(h => `${h.raw_message}\n\n`).join('');
    const footer = `--------------------------\n📝 *NOTES*: ${notes || 'N/A'}`;
    const full = header + body + footer;
    setOutput(full);
    setShowPreview(true);
  }

  function clearHistory() {
    if (!confirm('Vider ?')) return;
    setHistory([]);
  }

  function setTheme(m: string) {
    document.body.setAttribute('data-ui', m);
    document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
    const el = document.getElementById('t-' + m);
    if (el) el.classList.add('active');
  }

  return (
    <div className="w-full h-full flex">
      <aside className="sidebar">
        <div className="mb-6">
          <h1 className="text-xl font-black tracking-tighter uppercase text-main">Kamoa<br/><span className="text-accent">Supervision</span></h1>
        </div>

        <div className="bg-accent p-6 rounded-[28px] text-center text-white shadow-xl mb-6">
          <div className="text-3xl font-black tracking-tighter">{clock}</div>
          <div className="text-[10px] font-bold opacity-80 uppercase mt-1 tracking-widest">{dateStr}</div>
        </div>

        <div className="px-2 mb-4 space-y-4">
          <div className="startup-group p-3">
            <div className="flex items-center gap-2 mb-2 px-1">
              <i className="fas fa-mountain text-[9px] text-accent"></i>
              <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Surface Belts</span>
            </div>
            <div className="grid grid-cols-1 gap-1">
              <div className="grid grid-cols-2 gap-1">
                <button onClick={() => processReport('STOPPED','⛔')} className="p-2 rounded-lg bg-emerald-500 text-white text-[10px] font-black uppercase shadow-sm">Starting</button>
                <button onClick={() => processReport('RUNNING','✅')} className="p-2 rounded-lg bg-blue-500 text-white text-[10px] font-black uppercase shadow-sm">Running (ROM)</button>
              </div>
              <button onClick={() => processReport('STOPPED','🛑')} className="p-2 rounded-lg bg-slate-500 text-white text-[10px] font-black uppercase shadow-sm">Stop (End Shift)</button>
            </div>
          </div>

          <div className="startup-group p-3">
            <div className="flex items-center gap-2 mb-2 px-1">
              <i className="fas fa-arrow-down text-[9px] text-accent"></i>
              <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Underground Belts</span>
            </div>
            <div className="grid grid-cols-1 gap-1">
              <div className="grid grid-cols-2 gap-1">
                <button onClick={() => processReport('STOPPED','⛔')} className="p-2 rounded-lg bg-indigo-500 text-white text-[10px] font-black uppercase shadow-sm">Starting</button>
                <button onClick={() => processReport('RUNNING','✅')} className="p-2 rounded-lg bg-blue-500 text-white text-[10px] font-black uppercase shadow-sm">Running (ROM)</button>
              </div>
              <button onClick={() => processReport('STOPPED','🛑')} className="p-2 rounded-lg bg-slate-500 text-white text-[10px] font-black uppercase shadow-sm">Stop (End Shift)</button>
            </div>
          </div>
        </div>

        <div className="px-2 mb-4">
          <button onClick={() => setShowHistory(s => !s)} className="w-full flex items-center justify-between p-4 rounded-2xl transition-all border border-color-border bg-card" aria-label="Toggle activities history">
            <div className="flex items-center gap-3">
              <i className="fas fa-list-ul text-accent"></i>
              <span className="text-[11px] font-black uppercase tracking-widest text-main opacity-60">Activités</span>
            </div>
            <i className={`fas fa-chevron-right text-[10px] transition-transform text-muted ${showHistory ? 'transform rotate-90' : ''}`}></i>
          </button>
        </div>

        <div className="mt-auto pt-4 border-t border-color-border flex gap-2">
          <button id="t-ios" onClick={() => setTheme('ios')} className="theme-btn active" aria-label="iOS theme"><i className="fab fa-apple"></i></button>
          <button id="t-scada" onClick={() => setTheme('scada')} className="theme-btn" aria-label="SCADA theme"><i className="fas fa-terminal"></i></button>
          <button id="t-classic" onClick={() => setTheme('classic')} className="theme-btn" aria-label="Classic theme"><i className="fas fa-desktop"></i></button>
        </div>
      </aside>

      <main className="main-stage">
        {/* History panel */}
        <div className={`history-panel ${showHistory ? '' : 'hidden'}`}>
          <div className="glass-panel p-4">
            <div className="p-2 border-b border-color-border flex justify-between items-center">
              <span className="text-[11px] font-black uppercase tracking-widest">Journal du Poste</span>
              <button onClick={clearHistory} className="text-[10px] text-red-500 font-bold">Vider</button>
            </div>
            <div className="p-3 flex flex-col gap-2 max-h-[420px] overflow-y-auto">
              {history.length === 0 && <p className="text-[10px] opacity-30 text-center py-10 italic">Aucune donnée</p>}
              {history.map((h, i) => (
                <div key={i} className="event-item">
                  <div className="text-[10px] font-bold">{h.emoji} {h.unit_id || h.id} <span className="opacity-40 text-[8px] font-mono">{new Date(h.created_at).toLocaleTimeString('en-GB')}</span></div>
                  <div className="text-[9px] opacity-60">{h.status}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto space-y-6">
          <section className="glass-panel p-6">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-accent">Réseau Belts Kamoa 1</h2>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              {units.map(u => (
                <div key={u.unit_id} className={`belt-card ${currentUnit?.unit_id === u.unit_id ? 'active' : ''}`} onClick={() => setCurrentUnit(u)}>
                  {u.unit_id}
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="bg-accent w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <i className="fas fa-cog"></i>
                </div>
                <h3 className="text-2xl font-black tracking-tighter">{currentUnit?.unit_id || '—'}</h3>
              </div>

              <div className="space-y-3">
                <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe fault in English..." className="ios-input" aria-label="Fault description" />
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => processReport('STOPPED','⛔')} className="status-btn bg-red-500 shadow-lg text-white py-4 rounded-xl" aria-label="Report stop"> <i className="fas fa-power-off text-2xl mb-1"></i> <div className="text-[10px]">REPORT STOP</div></button>
                  <button onClick={() => processReport('RUNNING','✅')} className="status-btn bg-green-500 shadow-lg text-white py-4 rounded-xl" aria-label="Report start"> <i className="fas fa-play text-2xl mb-1"></i> <div className="text-[10px]">REPORT START</div></button>
                </div>
              </div>
            </div>

            <div className={`glass-panel p-6 flex flex-col justify-between ${showPreview ? '' : 'hidden'}`}>
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Preview (Rapport)</span>
                </div>
                <div id="output"><pre className="whitespace-pre-wrap">{output}</pre></div>
              </div>
              <button onClick={copyToClipboard} className="bg-accent mt-4 w-full text-white py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl" aria-label="Copy message to clipboard">
                <i className="fas fa-copy mr-2"></i> Copier le message
              </button>
            </div>
          </div>

          <section className="glass-panel p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Bibliothèque Pannes</h2>
            </div>

            <div className="mb-6 flex flex-wrap gap-2 items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="text-[8px] font-bold opacity-50 uppercase block mb-1 ml-1">Nouvelle Panne (English)</label>
                <input ref={newFaultTextRef} className="ios-input-small" placeholder="Ex: Motor trip on overload" />
              </div>
              <div className="w-32">
                <label className="text-[8px] font-bold opacity-50 uppercase block mb-1 ml-1">Catégorie</label>
                <select ref={newFaultCatRef} className="ios-input-small" aria-label="Fault category">
                  <option>Safety</option>
                  <option>Mechanical</option>
                  <option>Electrical</option>
                  <option>Planned</option>
                </select>
              </div>
              <button onClick={addNewFault} className="bg-accent p-2 h-[34px] rounded-xl text-white text-[10px] font-black px-4 shadow-lg" aria-label="Add new fault">
                <i className="fas fa-plus"></i>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Object.entries(library).map(([cat, faults]) => (
                <div key={cat} className="p-3 bg-black/5 rounded-xl">
                  <h4 className="text-[8px] font-black uppercase mb-2 opacity-40">{cat}</h4>
                  {faults.map(f => (
                    <div key={f.id} className="fault-item mb-2" onClick={() => setDescription(f.description)}>{f.description}</div>
                  ))}
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <aside className="sidebar-right">
        <div className="mb-6">
          <h2 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-4">Résumé du Poste</h2>
          <div className="space-y-3">
            <div className="stat-card">
              <label className="text-[8px] font-bold opacity-50 uppercase block mb-1">Operator</label>
              <input value={operator} onChange={e => setOperator(e.target.value)} placeholder="Nom" className="ios-input-small" />
            </div>
            <div className="stat-card">
              <label className="text-[8px] font-bold opacity-50 uppercase block mb-1">Tonnage (t)</label>
              <input value={tonnage} onChange={e => setTonnage(e.target.value)} placeholder="Ex: 15000" className="ios-input-small" />
            </div>
            <div className="stat-card">
              <label className="text-[8px] font-bold opacity-50 uppercase block mb-1">Notes (FR)</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Observations..." className="ios-input-small h-20 resize-none"></textarea>
            </div>
          </div>
        </div>
        <button onClick={generateFullReport} className="w-full p-4 rounded-2xl text-[10px] font-black bg-blue-600 text-white uppercase tracking-widest shadow-xl">
          Générer Rapport Complet
        </button>
      </aside>
    </div>
  );
}