
'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

declare global {
  interface Window {
    Chart: any;
  }
}

export function MoodPlayer() {
  const isInitialized = useRef(false);
  const barChartRef = useRef<any>(null);
  const pieChartRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState('home');

  // ===================== DATA =====================
  const MOOD_DEFS: Record<string, any> = {
    happy: {
      title: 'Happy — Sunny Vibes',
      subtitle: 'Bright, feel-good tracks to lift you up',
      accent: '#f59e0b',
      bg: 'linear-gradient(135deg,#fff1c1 0%, #ffd194 40%, #ffb347 100%)',
      emoji: '😊',
      coverTint: '#ffd786'
    },
    joyful: {
      title: 'Joyful — Energetic Beats',
      subtitle: 'High-energy songs — perfect for smiles and movement',
      accent: '#ec4899',
      bg: 'linear-gradient(135deg,#ffe0f2 0%, #ffb2e3 40%, #ff86c8 100%)',
      emoji: '🤩',
      coverTint: '#ffc2e9'
    },
    sad: {
      title: 'Sad — Melancholy',
      subtitle: 'Slow, emotional tracks to reflect',
      accent: '#60a5fa',
      bg: 'linear-gradient(135deg,#b6ccff 0%, #7aa2ff 40%, #4b6cff 100%)',
      emoji: '😢',
      coverTint: '#9fb8ff'
    },
    depression: {
      title: 'Depression — Ambient & Soothing',
      subtitle: 'Ambient textures and slow soundscapes',
      accent: '#94a3b8',
      bg: 'linear-gradient(135deg,#6b7a83 0%, #3a4348 50%, #2a3136 100%)',
      emoji: '😔',
      coverTint: '#7b8a92'
    }
  };

  const SAMPLE_TRACKS = (baseIdx=1) => Array.from({length:10}, (_,i)=>({
    title: ['Sunny Days','Golden Hour','Sparkle','Warm Breeze','Lemonade','Candy Skies','Bloom','Brightside','Hummingbird','Radiant'][i],
    artist: ['MoodyO Mix','Acoustic','Indie Pop','Lo-Fi','Electro Pop','Indie','Bedroom Pop','Folk','Chillhop','Dance'][i],
    src: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${(baseIdx+i)%16 + 1}.mp3`,
    cover: `https://picsum.photos/seed/h${baseIdx+i}/600/600`
  }));

  const TRACKS: Record<string, any> = {
    happy: SAMPLE_TRACKS(0),
    joyful: SAMPLE_TRACKS(4),
    sad: SAMPLE_TRACKS(8),
    depression: SAMPLE_TRACKS(12)
  };

  const moodEmoji: Record<string, string> = {happy:'😊',joyful:'🤩',sad:'😢',depression:'😔'};

  // ===================== HELPERS =====================
  const getStore = (key: string, fallback: any) => {
    if (typeof window === 'undefined') return fallback;
    try { 
      const raw = localStorage.getItem(key); 
      return raw ? JSON.parse(raw) : fallback 
    } catch(e) { 
      return fallback 
    }
  }
  const setStore = (key: string, value: any) => { 
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value)) 
  }

  const getHistory = () => getStore('moodyo_history', []);
  const saveHistory = (arr: any[]) => setStore('moodyo_history', arr);

  const renderRecent = () => {
    const recentEl = document.getElementById('recentPlays');
    if (!recentEl) return;
    const hist = getHistory().slice(-12).reverse();
    recentEl.innerHTML = hist.map((h: any)=>{
      const when = new Date(h.date).toLocaleString();
      return `<li>${h.type==='play'?'▶':'📝'} <b>${h.mood}</b> ${h.title?('· '+h.title):''} <span style="opacity:.7">— ${when}</span></li>`
    }).join('');
  }

  const aggregateCounts = () => {
    const hist = getHistory();
    const counts: Record<string, number> = {happy:0,joyful:0,sad:0,depression:0};
    const plays: Record<string, number> = {happy:0,joyful:0,sad:0,depression:0};
    const lastN = hist.slice(-50);
    lastN.forEach((item: any)=>{
      if(counts[item.mood] !== undefined){
        if(item.type === 'mood') counts[item.mood]++;
        if(item.type === 'play') plays[item.mood]++;
      }
    })
    return {counts, plays};
  }
  
  const updateCharts = () => {
    if (!document.getElementById('barChart') || !document.getElementById('pieChart') || !window.Chart) return;
    
    const {counts, plays} = aggregateCounts();
    const labels = ['Happy','Joyful','Sad','Depression'];
    const barData = [counts.happy,counts.joyful,counts.sad,counts.depression];
    const pieData = [plays.happy,plays.joyful,plays.sad,plays.depression];

    const barCtx = (document.getElementById('barChart') as HTMLCanvasElement).getContext('2d');
    const pieCtx = (document.getElementById('pieChart') as HTMLCanvasElement).getContext('2d');
    
    if (!barCtx || !pieCtx) return;

    if(!barChartRef.current){
      barChartRef.current = new window.Chart(barCtx,{ type:'bar', data:{ labels, datasets:[{ label:'Mood logs (last 50)', data:barData }] }, options:{ responsive:true, plugins:{legend:{display:false}}, scales:{y:{beginAtZero:true}} }});
    } else { 
      barChartRef.current.data.datasets[0].data = barData; 
      barChartRef.current.update(); 
    }

    if(!pieChartRef.current){
      pieChartRef.current = new window.Chart(pieCtx,{ type:'pie', data:{ labels, datasets:[{ label:'Song plays (last 50)', data:pieData }] }, options:{ responsive:true } });
    } else { 
      pieChartRef.current.data.datasets[0].data = pieData; 
      pieChartRef.current.update(); 
    }

    gsap.fromTo('#barChart',{scale:0.98},{duration:.5,scale:1,ease:'elastic.out(1,0.6)'});
    gsap.fromTo('#pieChart',{scale:0.98},{duration:.5,scale:1,ease:'elastic.out(1,0.6)'});
  }

  const recordMood = (mood?: string) => {
    if(!mood) mood = (document.getElementById('moodSelect') as HTMLSelectElement)?.value;
    if (!mood) return;
    const hist = getHistory();
    hist.push({date: new Date().toISOString(), mood, type:'mood'})
    saveHistory(hist);
    const trackerEmoji = document.getElementById('trackerEmoji');
    if (trackerEmoji) {
      trackerEmoji.textContent = moodEmoji[mood] || '🙂';
    }
    updateCharts();
  }
  
  const recordPlay = (mood: string, title: string) => {
    const hist = getHistory();
    hist.push({date: new Date().toISOString(), mood, title, type:'play'})
    saveHistory(hist);
    updateCharts();
    renderRecent();
  }
  
  const applyTheme = (mood: string) => {
    if(!MOOD_DEFS[mood] || typeof document === 'undefined') return;
    const def = MOOD_DEFS[mood];
    (document.body.style as any).background = def.bg;
    document.documentElement.style.setProperty('--page-accent', def.accent);
    gsap.fromTo('body',{backgroundPosition:'60% 60%'},{duration:.8,backgroundPosition:'40% 40%',ease:'power2.out'});
  }

  const openPage = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
        gsap.fromTo(target, { autoAlpha: 0, y: 20 }, { duration: .6, autoAlpha: 1, y: 0, ease: 'power3.out' });
    }
    setCurrentPage(id);
    if (MOOD_DEFS[id]) {
        applyTheme(id);
        recordMood(id);
    }
  }

  const openTracker = () => {
    const trackerEl = document.getElementById('tracker');
    if (!trackerEl) return;
    trackerEl.style.display='block';
    gsap.fromTo(trackerEl,{y:40,autoAlpha:0},{duration:.6,y:0,autoAlpha:1,ease:'power3.out'});
    updateCharts();
    renderRecent();
  }

  const closeTracker = () => {
    const trackerEl = document.getElementById('tracker');
    if (!trackerEl) return;
    gsap.to(trackerEl,{duration:.4,y:40,autoAlpha:0,onComplete:()=>trackerEl.style.display='none'});
  }

  const playTile = (id: string, mood: string, title: string) => {
    const me = document.getElementById(id) as HTMLAudioElement;
    if (!me) return;
    document.querySelectorAll('audio').forEach(a=>{ if(a!==me) a.pause() });
    me.play();
    recordPlay(mood,title);
    const tile = me.closest('.tile');
    if (tile) {
      gsap.fromTo(tile,{scale:.98},{duration:.4,scale:1,ease:'back.out(1.7)'});
    }
  }
  
  const renderTile = (mood: string, t: any, idx: number) => {
    const id = `${mood}-aud-${idx}`;
    return (
      <div className="tile" data-mood={mood} data-title={t.title} key={id}>
        <img className="cover" src={t.cover} alt={`${t.title} cover`} />
        <button className="play-small" onClick={() => playTile(id, mood, t.title)}>▶</button>
        <div className="tile-content">
          <div className="song-title">{t.title}</div>
          <div className="song-artist">{t.artist}</div>
          <audio id={id} preload="none" controls>
            <source src={t.src} type="audio/mpeg" />
          </audio>
        </div>
      </div>
    );
  }

  const renderMoodPage = (mood: string) => {
    const def = MOOD_DEFS[mood];
    return (
      <div className="glass">
        <div className="page-header">
          <div>
            <h2>{def.title} <span className="badge">{def.emoji}</span></h2>
            <small>{def.subtitle}</small>
          </div>
          <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
            <button className="nav-btn glass" onClick={openTracker}>Open Emotion Tracker</button>
          </div>
        </div>
        <div className="song-grid">{TRACKS[mood].map((t: any, i: number) => renderTile(mood, t, i))}</div>
      </div>
    )
  }

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const moodSelect = document.getElementById('moodSelect') as HTMLSelectElement;
    if (moodSelect) {
        moodSelect.addEventListener('change', (e)=>{
          const trackerEmoji = document.getElementById('trackerEmoji');
          if (trackerEmoji) {
            trackerEmoji.textContent = moodEmoji[(e.target as HTMLSelectElement).value];
          }
        });
    }
    
    document.getElementById('saveMoodBtn')?.addEventListener('click', () => recordMood());
    document.getElementById('closeTrackerBtn')?.addEventListener('click', closeTracker);

    gsap.from('.logo',{duration:1,y:-10,autoAlpha:0,stagger:.05,ease:'power2.out'});
    gsap.from('.emotion-card',{duration:0.9,stagger:0.12,scale:0.96,autoAlpha:0,y:18,ease:'back.out(1.2)'});

  }, []);

  return (
    <div className="app">
      <header>
        <div className="logo glass">
          <div className="dot"></div>
          MoodyO
        </div>
        <nav>
          <button className="nav-btn glass" onClick={() => openPage('home')}>Home</button>
          <button className="nav-btn glass" onClick={() => openPage('happy')}>Happy</button>
          <button className="nav-btn glass" onClick={() => openPage('joyful')}>Joyful</button>
          <button className="nav-btn glass" onClick={() => openPage('sad')}>Sad</button>
          <button className="nav-btn glass" onClick={() => openPage('depression')}>Depression</button>
        </nav>
      </header>
      
      <section id="home" className={`page ${currentPage === 'home' ? 'active' : ''}`}>
        <div className="glass">
          <h2>How are you feeling today?</h2>
          <p style={{opacity: 0.85}}>Tap a mood to explore curated songs and vibes. Each page has its own theme ✨</p>
          <div className="grid" id="moodGrid">
            <div className="emotion-card happy" onClick={() => openPage('happy')}>
              <div className="emoji">😊</div>
              <div className="title">Happy</div>
              <div className="subtitle">Bright, upbeat tracks</div>
            </div>

            <div className="emotion-card joyful" onClick={() => openPage('joyful')}>
              <div className="emoji">🤩</div>
              <div className="title">Joyful</div>
              <div className="subtitle">Bubbly & energetic</div>
            </div>

            <div className="emotion-card sad" onClick={() => openPage('sad')}>
              <div className="emoji">😢</div>
              <div className="title">Sad</div>
              <div className="subtitle">Melancholic, mellow tunes</div>
            </div>

            <div className="emotion-card depression" onClick={() => openPage('depression')}>
              <div className="emoji">😔</div>
              <div className="title">Depression</div>
              <div className="subtitle">Soothing & ambient</div>
            </div>
          </div>
        </div>
      </section>
      
      {Object.keys(MOOD_DEFS).map(mood => (
        <section key={mood} id={mood} className={`page ${currentPage === mood ? 'active' : ''}`}>
          {currentPage === mood && renderMoodPage(mood)}
        </section>
      ))}

      <footer>
        <small>Made with ❤️ MoodyO — mood based audio UI demo</small>
      </footer>
        
      <div className="tracker-panel glass" id="tracker" style={{display:'none'}}>
        <div className="tracker-open">
          <div style={{fontWeight:700}}>Emotion Tracker</div>
          <button className="tracker-toggle" id="closeTrackerBtn">Close</button>
        </div>
        <div className="tracker-body">
          <div className="charts">
            <canvas id="barChart" height="200"></canvas>
            <canvas id="pieChart" height="200"></canvas>
          </div>
          <div style={{marginTop:'10px',display:'flex',gap:'8px',alignItems:'center',justifyContent:'space-between'}}>
            <div>
              <small>Record today's mood</small>
              <select id="moodSelect">
                <option value="happy">Happy</option>
                <option value="joyful">Joyful</option>
                <option value="sad">Sad</option>
                <option value="depression">Depression</option>
              </select>
              <button id="saveMoodBtn" style={{marginLeft:'8px',padding:'6px 10px',borderRadius:'8px',border:'none',cursor:'pointer'}}>Save</button>
            </div>
            <div style={{textAlign:'right'}}>
              <small>Emoji</small>
              <div id="trackerEmoji" style={{fontSize:'24px'}}>😊</div>
            </div>
          </div>
          <div className="recent-list">
            <small style={{opacity:.8}}>Recent plays</small>
            <ul id="recentPlays"></ul>
          </div>
        </div>
      </div>
    </div>
  );
}

    