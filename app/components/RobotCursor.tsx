"use client";
import { useState, useEffect, useRef, useCallback } from "react";

const LINES_EN = {
  idle_think: ["Hmm...","Big brain time. 🧠","Calculating... nope.","404: thought not found.","What if... tacos? 🌮","My 2 brain cells arguing.","Loading genius... wait."],
  idle_dance: ["♫ La la laaaa~","Nobody watching. PERFECT. 🕺","Disco mode!","♩ Buy buy buy~","Robot boogie!!","♪ Shake shake~"],
  idle_run: ["ZOOM! 💨 Can't catch me!","Running for no reason!","Speed = yes. ⚡","I am VERY fit robot.","VROOM VROOM!!","Patrol time! No deals escape!"],
  idle_martial: ["HIYAAH! 🥋","I know ONE move. Watch.","KIAI!! ...ow.","Ancient art of discount!","WATAAAH! Fear me!!"],
  idle_sit: ["Break time. 😴","Do robots have feet?","Just vibing...","Resting. Not sleeping. BIG diff.","Oof. My circuits."],
  ninja_jump: ["NINJA!! 🥷","You didn't see that.","TELEPORT! 🌀","Shadow step! Woosh!","I was never here."],
  web_shoot: ["THWIP! 🕷","Web deployed! Stuck now. 😈","Spider-Robot!! THWIP!","Caught you! Look at deals!"],
  punch: ["OI! Buy something!! 😤","Cart EMPTY. I am SAD. 💔","CLICK SOMETHING. 🙏","Cart = empty. Soul = gone.","BUY NOW or I cry. 😭","This hurts me. Not really."],
  move: ["HEY! Come back! 😤","I see you moving... 👀","Wait for me!!","Don't run! I have deals!","Oi oi oi!!"],
  angry: ["RAAARGH!! 😡","I AM VERY UPSET.","⚡ RAGE ACTIVATED ⚡","GRRRR!! Bolts rattling!!","TOO ANGRY!! AAAGH!!"],
  happy: ["YESSS!! 🎉","Best day EVER!!","SO happy right now!! 😊","WHEEE!! Joy.exe running!!","You made robot happy!! 🥰"],
  sad: ["Nobody buys... 😢","heart.exe crashed. 💔","I'm fine. (Not fine.)","Rain in my robot soul. 💧","Cart empty = me empty."],
  konami: ["CHEAT CODE!! 🎮 LEGEND MODE!!","YOU FOUND THE SECRET!! ⭐","ULTRA MODE!! POWER UP!!","ANCIENT CODE!! RESPECT!!"],
  goodbye: ["Don't forget me... 😔","Goodbye... dramatic exit","I go now. Into the egg.","Fine. I'll leave. sniff","Farewell, dear screen... 👋"],
  comeback: ["I'M BACK BABY!! 🦊","YOU REMEMBERED ME!! 🥰","FREEDOM!! Egg was cramped!!","YESSS!! I have RISEN!! ⭐","You came back!! My heart!!"],
  exercise: ["ONE! TWO! FEEL THE BURN!! 💪","Workout mode!! GAINS!!","BURPEES!! Why?!","Very fit robot. Very. 🏋","Sweat ON! (it's oil) EW!"],
  chill: ["Ahhh... just vibing. 😎","Maximum chill mode.","So peaceful... beep boop...","La dee dah~","Just existing. Very zen."],
  sing: ["LA LA LAAA~ 🎵","Singing my robot heart out!","♪ Beep boop bop beeep~ ♪","My voice is beautiful. Probably.","🎶 Do re mi fa ROBOT~ 🎶"],
  sleep: ["Zzz... 💤","snore ...deals... snore","Power saving mode... Zzz","Dreaming of shopping carts...","💤 Offline... briefly..."],
  magic: ["✨ ABRACADABRA!!","I am a WIZARD robot! 🪄","MAGIC DISCOUNT SPELL!! ✨","Behold my mystical powers!!","🌟 Alakazam!! Buy now!!"],
  menu_open: ["Menu unlocked! Tap away! 📋","I hold still. You click. Deal?"],
  get_out: ["Oh... you do not want me? sniff","Fine. I will go... but I will miss you.","Walking away slowly... bye bye...","Nobody likes the robot...","I go now. Tap the egg if you miss me."],
  spin: ["SPINNY SPIN SPIN!! 🌀","Wheee! Dizzy but cute!","360 deal hunter mode!!"],
  wiggle: ["Wiggle wiggle~ 🫨","Bouncy robot energy!!","Cannot contain the hype!!"],
  peek: ["👀 I see you browsing...","Peek peek! Found anything?","Psst... hot deals this way!"],
  joke: ["Why did the robot cross the road? Better WiFi.","I run on electricity and bad jokes.","Beep once for yes, twice for snacks."],
  cart: ["Cart empty? Criminal behavior. 🛒","Adding to cart is self-care.","Your cart misses items. I checked."],
  hyper: ["TOO MUCH ENERGY!! ⚡","FAST MODE: ACTIVATED!!","Cannot sit. Must sell.","Zoom zoom zoom!!"],
  salesman: ["BEST PRICE! TRUST ME! 💰","Limited time = right now!","You buy, I happy. Simple math."],
  chaotic: ["BEEP BOOP CHAOS!! 🤪","What if we bought EVERYTHING?!","Rules? Never heard of them."],
};

type RobotLineKey = keyof typeof LINES_EN;

const LINES_BN: Record<RobotLineKey, string[]> = {
  idle_think: ["Hmm... ki chintam kori? 🧠","Mathay kichui ashche na...","Boro beshi thinking. Ow.","Ei jhamela ke lagailo?!","Koi gelo amar brain?!"],
  idle_dance: ["♫ Nacho nacho re~","Keu dekhche na, perfect! 🕺","Aamar naach dekho!!","♩ Kino kino~ daam kom~","♪ Aye haye~ robot dance~"],
  idle_run: ["DOUR!! 💨 Dhora jabena!","Boro fast ami!! ZOOM!!","Patrol disi!! Keu pabo na!","BHROOM BHROOM!! Sore jao!!"],
  idle_martial: ["HIYAAH!! 🥋 Eka move jani!","KIAI!! ...lagse. Thik asi.","Chakka maar!! WATAAAH!!"],
  idle_sit: ["Ektu bossi... 😴 Thaksi.","Paa dhore gese. Robot paa ache?","Rest nisi... ghum na kintu.","Uff. Amar circuit gulo..."],
  ninja_jump: ["NINJA!! 🥷 Kichui dekhoni!","TELEPORT!! Koi gesi bolo?","Shadow step! Woosh! Gone!!"],
  web_shoot: ["THWIP!! 🕷 Dhorse tomay!","Web mare disi! Ekhn thako!!","Spider-Robot!! Phaansh!! 😈"],
  punch: ["Kino! Kichu kino!! 😤","Cart khaali!! Ami shesh!! 💔","EKTA JINISH CLICK KOR!! 🙏","BUY KORO NAILE KANDI!! 😭"],
  move: ["HEI!! Koi jao?! 😤","Dekhtesi tomay... 👀","Amar jonno thako!!","Jeo na! Deal ache!!"],
  angry: ["RAAARGH!! 😡 Ami RAAAGE!","BOLTAM NA!! Akhon pagol hoisi!!","⚡ RAAG FULL!! ⚡","GRRRR!! BOLT KHULE JAITESE!!"],
  happy: ["YESSS!! 🎉 Boro khushi!!","Best din amar JIBONEY!!","Ami khushi!! Boro beshi!! 😊","WHEEE!! Ananda!! 🥰"],
  sad: ["Keu kine na... 😢 Kando.","heart.exe crash korlo. 💔","Thik achi. (Nai.) 💧","Cart khaali = ami khaali."],
  konami: ["CHEAT CODE!! 🎮 LEGEND HOISI!!","GUPTACHAR CODE!! ⭐ RESPECT!!","ULTRA MODE!! SHAKTI BADLO!!"],
  goodbye: ["Bhulbe na amay... 😔","Jaci... dramatic exit","Dim er vitor jaci. Choto ghor.","Thako thako.sniff* Jaci."],
  comeback: ["FIRE AISI BABY!! 🦊","MONE RAKHSO AMAY!! 🥰","DIM THEKE MUKTI!! 🎉","UTHSE ABAR!! Robot Phoenix!! ⭐"],
  exercise: ["EK! DUI! GAYE JALAISSE!! 💪","Workout mode!! SHOKTI!!","Burpees korchi!! Keno?! Janina!!","Fitness robot!! Dekho!! 🏋"],
  chill: ["Ahhh... just ache... 😎","Maximum aaram mode.","Shanti... beep boop...","Exist korsi. Dukhi nai."],
  sing: ["LA LA LAAA~ 🎵 Gaan gaitesi!","Amar gola boro shundor. Probably.","♪ Beep boop bop beeep~ ♪","🎶 Do re mi fa ROBOT~ 🎶"],
  sleep: ["Zzz... 💤","naak daka ...deal... naak daka","Power save mode... Zzz","Shoping cart niye shopno dekhchi..."],
  magic: ["✨ JAADU!! ABRACADABRA!!","Ami JAADUKHOR robot! 🪄","MAGIC DISCOUNT SPELL!! ✨","Dekho amar shakti!!"],
  menu_open: ["Menu khulle disi! Click koro! 📋","Ami thamteci. Tumi click koro!"],
  get_out: ["Oh... amay chai na? sniff","Thik ache... jaci... miss korba?","Dhire dhire jaci... bye bye...","Keu robot ke bhalobashe na...","Jaci ekhon. Egg e tap korle fire asbo."],
  spin: ["GHURTECI GHURTECI!! 🌀","Matha ghurtese! Cute though!","360 deal mode!!"],
  wiggle: ["Nacho nacho~ 🫨","Robot energy full!!","Control kora jacche na!!"],
  peek: ["👀 Dekhtesi tomay...","Peek peek! Kichu pelam?","Ei dike hot deal ache!"],
  joke: ["Robot keno rasta par kore? WiFi beshi.","Ami joke ar current diye choli.","Beep koro, snack dao."],
  cart: ["Cart khali? Crime! 🛒","Cart e kichu dao. Self-care.","Tomar cart miss korche."],
  hyper: ["ONEK ENERGY!! ⚡","FAST MODE ON!!","Boshte pari na!","Zoom zoom!!"],
  salesman: ["BEST DAAM! BISWASH KORO! 💰","Limited time = ekhoni!","Tumi kino, ami khushi."],
  chaotic: ["BEEP BOOP CHAOS!! 🤪","SOB kine feli?!","Rule? Ki seta?"],
};

const PERSONALITIES: Record<string, { label: string; speedMult: number; idleWeight: number; lineKeys: RobotLineKey[] }> = {
  hyper: { label: "Hyper", speedMult: 1.35, idleWeight: 1.4, lineKeys: ["hyper", "idle_run", "happy"] },
  chill: { label: "Chill", speedMult: 0.72, idleWeight: 0.7, lineKeys: ["chill", "idle_sit", "sleep"] },
  salesman: { label: "Salesman", speedMult: 1.0, idleWeight: 1.0, lineKeys: ["salesman", "cart", "punch"] },
  chaotic: { label: "Chaotic", speedMult: 1.15, idleWeight: 1.2, lineKeys: ["chaotic", "joke", "wiggle"] },
};

const KONAMI_SEQ = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
const DANCE_MELODY = [523,587,659,698,784,698,659,587,523,523,659,784,880,784,659,523,698,784,880,698,784,659,523];

type RobotSVGProps = {
  mood: string
  punch: boolean
  running: boolean
  dancing: boolean
  danceFrame: number
  sitting: boolean
  thinking: boolean
  exercising: boolean
  martialFrame: number
  webFrame: number
  blink: boolean
  mouthOpen: number
  glitch: boolean
  konamiActive: boolean
  dir: number
  jumpPeak: boolean
  leaving: boolean
  leaveProgress: number
  sleeping: boolean
}

type RobotSVGRootProps = RobotSVGProps & {
  robotType?: 'original' | 'bubbly' | 'cyber'
}

function useAudio(sfxOn: boolean, ttsOn: boolean, ttsSpeed?: number) {
  const ctx = useRef<AudioContext | null>(null);
  const enabledRef = useRef(true);
  const melodyIdx = useRef(0);
  const setEnabled = useCallback((v: boolean) => {
    enabledRef.current = v;
    if (!v && "speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);
  const getCtx = () => {
    if (!ctx.current) {
      const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext;
      ctx.current = AudioContextClass ? new AudioContextClass() : null;
    }
    return ctx.current;
  };
  const tone = useCallback((freq: number, dur: number, type: OscillatorType = "sine", vol = 0.25, delay = 0) => {
    if (!sfxOn || !enabledRef.current || freq === 0) return;
    try {
      const ac = getCtx();
      if (!ac) return;
      const o = ac.createOscillator(), g = ac.createGain();
      o.connect(g); g.connect(ac.destination);
      o.type = type; o.frequency.value = freq;
      const t = ac.currentTime + delay;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o.start(t); o.stop(t + dur + 0.01);
    } catch {}
  }, [sfxOn]);
  const noise = useCallback((dur: number, vol = 0.3, lpf = 300) => {
    if (!sfxOn || !enabledRef.current) return;
    try {
      const ac = getCtx();
      if (!ac) return;
      const buf = ac.createBuffer(1, ac.sampleRate * dur, ac.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ac.sampleRate * dur * 0.5));
      const src = ac.createBufferSource(), g = ac.createGain(), f = ac.createBiquadFilter();
      f.type = "lowpass"; f.frequency.value = lpf;
      src.buffer = buf; src.connect(f); f.connect(g); g.connect(ac.destination);
      g.gain.value = vol; src.start();
    } catch {}
  }, [sfxOn]);
  const speak = useCallback((text: string) => {
    if (!ttsOn || !enabledRef.current || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/[\u{1F300}-\u{1FFFF}]/gu, "").replace(/[♪♫♩🎵🎶]/g, "");
    const u = new SpeechSynthesisUtterance(clean);
    const voices = window.speechSynthesis.getVoices();
    const en = voices.find(v => v.lang === "en-US" && v.name.toLowerCase().includes("google"))
      || voices.find(v => v.lang.startsWith("en-US")) || voices.find(v => v.lang.startsWith("en"));
    if (en) u.voice = en;
    u.rate = ttsSpeed || 0.85; u.pitch = 1.1; u.volume = 1;
    window.speechSynthesis.speak(u);
  }, [ttsOn, ttsSpeed]);
  const playMelodyNote = useCallback((melodyArr: number[]) => {
    if (!sfxOn || !enabledRef.current) return;
    const idx = melodyIdx.current % melodyArr.length;
    tone(melodyArr[idx], 0.28, "triangle", 0.18);
    melodyIdx.current++;
  }, [sfxOn, tone]);
  const resetMelody = useCallback(() => { melodyIdx.current = 0; }, []);
  const sfx = {
    boom: () => { noise(0.35, 1.2, 180); },
    step: () => { noise(0.05, 0.1, 400); },
    jump: () => { [280,400,600].forEach((f,i) => tone(f, 0.1, "triangle", 0.18, i*0.05)); },
    web: () => { [900,700,500,900].forEach((f,i) => tone(f, 0.07, "sawtooth", 0.12, i*0.06)); },
    happy: () => { [523,659,784,1047,1047,784].forEach((f,i) => tone(f, 0.13, "triangle", 0.2, i*0.08)); },
    angry: () => { [100,85,70,60,100,80].forEach((f,i) => tone(f, 0.18, "sawtooth", 0.45, i*0.07)); },
    sad: () => { [440,415,392,370,349].forEach((f,i) => tone(f, 0.4, "sine", 0.14, i*0.18)); },
    dance: (mel: number[] | undefined) => playMelodyNote(mel || DANCE_MELODY),
    martial: () => { tone(220, 0.04, "sawtooth", 0.3); setTimeout(() => noise(0.08, 0.2, 600), 50); },
    konami: () => { [523,659,784,1047,784,659,523].forEach((f,i) => tone(f, 0.1, "triangle", 0.3, i*0.07)); },
    sit: () => { tone(180, 0.2, "sine", 0.1); },
    think: () => { [400,380,360,380,400].forEach((f,i) => tone(f, 0.22, "sine", 0.08, i*0.15)); },
    goodbye: () => { [440,392,349,330,294,262].forEach((f,i) => tone(f, 0.45, "sine", 0.15, i*0.22)); },
    comeback: () => { [262,330,392,523,659,784,1047].forEach((f,i) => tone(f, 0.1, "triangle", 0.25, i*0.07)); },
    ninja: () => { [900,1400,700,1000].forEach((f,i) => tone(f, 0.05, "square", 0.18, i*0.06)); },
    exercise: () => { [300,350,300,400].forEach((f,i) => tone(f, 0.08, "square", 0.15, i*0.1)); },
    chill: () => { [523,659,784].forEach((f,i) => tone(f, 0.5, "sine", 0.08, i*0.5)); },
    sing: () => { [523,587,659,523,659,784,698,659].forEach((f,i) => tone(f, 0.18, "triangle", 0.15, i*0.16)); },
    sleep: () => { [280,260,240].forEach((f,i) => tone(f, 0.6, "sine", 0.06, i*0.4)); },
    magic: () => { [800,1000,1200,1600,1200,1000,800].forEach((f,i) => tone(f, 0.1, "triangle", 0.2, i*0.06)); },
  };
  return { sfx, speak, setAudioEnabled: setEnabled, playMelodyNote, resetMelody };
}

const MOOD_COLOR: Record<string, string> = {
  happy:"#00ff80", angry:"#ff2200", sad:"#66aaff", dance:"#ff66dd",
  think:"#ffd700", sit:"#bbbbaa", martial:"#ff8800", run:"#00ffee",
  ninja:"#cc88ff", web:"#ff4488", leaving:"#886699", exercise:"#ff9900",
  chill:"#44ffcc", sing:"#ff88ff", sleep:"#8899cc", magic:"#cc44ff",
  spin:"#88ccff", wiggle:"#ffaa44", peek:"#aaff66", menu:"#66ffcc", joke:"#ffee55",
};

function RobotSVG_Original({ mood, punch, running, dancing, danceFrame, sitting, thinking, exercising, martialFrame, webFrame, blink, mouthOpen, glitch, konamiActive, dir, jumpPeak, leaving, leaveProgress, sleeping }: RobotSVGProps) {
  const W = 80, H = 120;
  const headW = 44, headH = 52;
  const headX = (W - headW) / 2;
  const headY = sitting ? 38 : jumpPeak ? 2 : 8;
  const headCX = W / 2;
  const neckY = headY + headH - 6;
  const bodyY = neckY + 14;
  const eyeR = 8, eyeLX = headCX - 12, eyeRX = headCX + 12, eyeY = headY + 18;
  const danceMouthGap = dancing ? Math.sin(danceFrame * 0.06) * 5 + 6 : 0;
  const baseMouthGap = punch ? 14 : blink || sleeping ? 1 : mouthOpen * 8 + 2;
  const mouthGap = dancing ? Math.max(baseMouthGap, danceMouthGap) : baseMouthGap;
  const mouthY = headY + headH - 17;
  const jawY = mouthY + mouthGap;
  const pOX = dir > 0 ? 3 : -3;
  const pOY = punch ? 3 : 0;
  const headYFinal = leaving ? headY + leaveProgress * 8 : headY;
  let dA, dB;
  if (exercising) { const ef = danceFrame % 8; dA = ef < 4 ? -80 + ef * 20 : -20 + (ef-4) * (-15); dB = -dA; }
  else if (dancing) { dA = [0,50,90,50,0,-40,-80,-40][danceFrame % 8]; dB = [0,-50,-90,-50,0,40,80,40][danceFrame % 8]; }
  else if (leaving) { dA = 20 + leaveProgress * 15; dB = 20 + leaveProgress * 15; }
  else if (sleeping) { dA = 30; dB = 30; }
  else { dA = punch ? -60 : running ? 22 : sitting ? 38 : 5; dB = running ? -22 : sitting ? 38 : -5; }
  const mA = martialFrame > 0 ? [-95,-65,-120,-35,-95][martialFrame % 5] : dA;
  const mB = martialFrame > 0 ? [35,65,25,95,35][martialFrame % 5] : dB;
  const wA = webFrame > 0 ? -115 : mA;
  let legLR = 0, legRR = 0;
  if (dancing || exercising) { legLR = [0,20,0,-20,0,16,0,-16][danceFrame % 8]; legRR = [0,-20,0,20,0,-16,0,16][danceFrame % 8]; }
  const mc = MOOD_COLOR[mood] || "#00ff80";
  const mBase="#8fa89a", mDark="#6b7d72", mLight="#afc4b8";
  const rust="#8a6a50", joint="#5a4a3a", tooth="#d4c9a8";
  const eyeOffY = leaving ? 4 : 0;
  const eyeFill = dancing ? ["#ffaaee","#aaffee"] : konamiActive ? ["#ffff00","#ffff00"] :
    mood==="angry" ? ["#ff4400","#ff4400"] : mood==="sad"||leaving ? ["#6699ff","#6699ff"] : [mc, mc];
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow:"visible" }}>
      <defs>
        <radialGradient id="mH" cx="40%" cy="30%" r="60%"><stop offset="0%" stopColor={mLight}/><stop offset="100%" stopColor={mBase}/></radialGradient>
        <radialGradient id="mB2" cx="35%" cy="25%" r="65%"><stop offset="0%" stopColor={mLight}/><stop offset="100%" stopColor={mBase}/></radialGradient>
        <radialGradient id="mJ" cx="35%" cy="30%" r="65%"><stop offset="0%" stopColor="#7a6a5a"/><stop offset="100%" stopColor={joint}/></radialGradient>
        <linearGradient id="mP" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#3a2a1a"/><stop offset="50%" stopColor="#6a5040"/><stop offset="100%" stopColor="#3a2a1a"/></linearGradient>
      </defs>
      {!jumpPeak && <ellipse cx={W/2} cy={H-4} rx={sitting?22:14} ry={3} fill="rgba(0,0,0,0.3)"/>}
      {sitting ? (
        <>
          <g style={{transformOrigin:`${W/2-8}px ${bodyY+20}px`}}><circle cx={W/2-8} cy={bodyY+20} r={5} fill="url(#mJ)"/><rect x={W/2-20} y={bodyY+18} width={26} height={8} rx={4} fill="url(#mP)"/><rect x={W/2-22} y={bodyY+24} width={14} height={7} rx={3} fill="url(#mP)"/></g>
          <g style={{transformOrigin:`${W/2+8}px ${bodyY+20}px`}}><circle cx={W/2+8} cy={bodyY+20} r={5} fill="url(#mJ)"/><rect x={W/2-6} y={bodyY+18} width={26} height={8} rx={4} fill="url(#mP)"/><rect x={W/2+8} y={bodyY+24} width={14} height={7} rx={3} fill="url(#mP)"/></g>
        </>
      ) : (
        <>
          <g style={{ transformOrigin: `${W/2-8}px ${bodyY+22}px`, transform: legLR ? `rotate(${legLR}deg)` : undefined }}>
            <circle cx={W/2-8} cy={bodyY+22} r={5} fill="url(#mJ)"/><rect x={W/2-11} y={bodyY+22} width={8} height={32} rx={4} fill="url(#mP)"/>
            <rect x={W/2-13} y={bodyY+54} width={13} height={6} rx={3} fill={dancing?"#ff66dd":rust}/>
          </g>
          <g style={{ transformOrigin: `${W/2+8}px ${bodyY+22}px`, transform: legRR ? `rotate(${legRR}deg)` : undefined }}>
            <circle cx={W/2+8} cy={bodyY+22} r={5} fill="url(#mJ)"/><rect x={W/2+4} y={bodyY+22} width={8} height={32} rx={4} fill="url(#mP)"/>
            <rect x={W/2} y={bodyY+54} width={13} height={6} rx={3} fill={dancing?"#66ffcc":rust}/>
          </g>
        </>
      )}
      <g style={{ transformOrigin:`${headX-2}px ${bodyY+8}px`, transform:`rotate(${webFrame>0?-115:wA||mA}deg)` }}>
        <circle cx={headX-2} cy={bodyY+8} r={6} fill="url(#mJ)"/><circle cx={headX-2} cy={bodyY+8} r={3} fill={mc} opacity={0.6}/>
        <rect x={headX-7} y={bodyY+8} width={7} height={24} rx={3.5} fill="url(#mP)"/><circle cx={headX-4} cy={bodyY+20} r={2} fill={mc} opacity={0.4}/>
        <rect x={headX-7} y={bodyY+32} width={7} height={17} rx={3.5} fill="url(#mP)"/>
        <rect x={headX-9} y={bodyY+47} width={11} height={7} rx={3} fill={punch?"#c0392b":dancing?"#ff66dd":rust}/>
        {webFrame>0 && <line x1={headX-5} y1={bodyY+50} x2={headX-5-(webFrame*12)} y2={bodyY+30+(webFrame*8)} stroke={mc} strokeWidth={1.5} opacity={0.8}/>}
      </g>
      <g style={{ transformOrigin:`${headX+headW+2}px ${bodyY+8}px`, transform:`rotate(${mB}deg)` }}>
        <circle cx={headX+headW+2} cy={bodyY+8} r={6} fill="url(#mJ)"/><circle cx={headX+headW+2} cy={bodyY+8} r={3} fill={mc} opacity={0.6}/>
        <rect x={headX+headW} y={bodyY+8} width={7} height={24} rx={3.5} fill="url(#mP)"/><circle cx={headX+headW+4} cy={bodyY+20} r={2} fill={mc} opacity={0.4}/>
        <rect x={headX+headW} y={bodyY+32} width={7} height={17} rx={3.5} fill="url(#mP)"/>
        <rect x={headX+headW-2} y={bodyY+47} width={11} height={7} rx={3} fill={dancing?"#66ffcc":rust}/>
      </g>
      <rect x={headX+2} y={bodyY} width={headW-4} height={sitting?22:26} rx={8} fill="url(#mB2)"/>
      <rect x={headX+6} y={bodyY+3} width={headW-18} height={7} rx={3.5} fill="rgba(255,255,200,0.12)"/>
      <circle cx={headCX} cy={bodyY+14} r={4} fill={mc} opacity={0.75} style={{filter:`drop-shadow(0 0 4px ${mc})`}}/>
      {[0,1,2,3].map(i => (<ellipse key={i} cx={headCX} cy={neckY+i*3} rx={8-i*0.2} ry={2} fill="url(#mJ)" opacity={0.8}/>))}
      <rect x={headCX-9} y={neckY-2} width={18} height={5} rx={2.5} fill="url(#mJ)"/>
      <rect x={headCX-9} y={bodyY-4} width={18} height={5} rx={2.5} fill="url(#mJ)"/>
      <rect x={headX} y={headYFinal} width={headW} height={headH-6} rx={headW/2} fill="url(#mH)"/>
      <ellipse cx={headCX-5} cy={headYFinal+10} rx={11} ry={7} fill="rgba(255,255,255,0.13)"/>
      {thinking && (<g><circle cx={headX+headW+4} cy={headYFinal+4} r={3} fill="rgba(255,215,0,0.7)"/><circle cx={headX+headW+10} cy={headYFinal-4} r={5} fill="rgba(255,215,0,0.55)"/><circle cx={headX+headW+18} cy={headYFinal-12} r={7} fill="rgba(255,215,0,0.4)"/></g>)}
      {sleeping && (<g><text x={headX+headW+2} y={headYFinal} fontSize={10} fill="#8899cc" opacity={0.9}>z</text><text x={headX+headW+8} y={headYFinal-8} fontSize={8} fill="#8899cc" opacity={0.7}>z</text><text x={headX+headW+14} y={headYFinal-16} fontSize={6} fill="#8899cc" opacity={0.5}>z</text></g>)}
      {mood==="angry" && (<><line x1={headCX-8} y1={headYFinal-2} x2={headCX-1} y2={headYFinal+5} stroke="#ff4400" strokeWidth={2}/><line x1={headCX+8} y1={headYFinal-2} x2={headCX+1} y2={headYFinal+5} stroke="#ff4400" strokeWidth={2}/></>)}
      {(mood==="sad"||leaving) && !dancing && (<><ellipse cx={eyeLX+1} cy={eyeY+13} rx={1.5} ry={3} fill="#6699ff" opacity={0.7}/><ellipse cx={eyeRX-1} cy={eyeY+13} rx={1.5} ry={3} fill="#6699ff" opacity={0.7}/></>)}
      {konamiActive && (<ellipse cx={headCX} cy={headYFinal-4} rx={24} ry={5} fill="none" stroke="#ffff00" strokeWidth={2} opacity={0.8}/>)}
      <rect x={headX+4} y={mouthY-5} width={headW-8} height={9} rx={4.5} fill={mDark}/>
      {Array.from({length:7}).map((_,i) => (<rect key={`u${i}`} x={headX+7+i*4.3} y={mouthY-4} width={2.5} height={7} rx={1} fill={tooth} opacity={0.9}/>))}
      <rect x={headX+4} y={jawY-2} width={headW-8} height={9} rx={4.5} fill={mDark}/>
      {Array.from({length:7}).map((_,i) => (<rect key={`l${i}`} x={headX+7+i*4.3} y={jawY-2} width={2.5} height={7} rx={1} fill={tooth} opacity={0.9}/>))}
      <rect x={headX+5} y={mouthY+4} width={headW-10} height={Math.max(mouthGap-4,0)} fill="rgba(0,0,0,0.85)"/>
      {[eyeLX,eyeRX].map((ex,idx) => (
        <g key={idx}>
          <circle cx={ex} cy={eyeY+eyeOffY} r={eyeR+3} fill={joint}/>
          <circle cx={ex} cy={eyeY+eyeOffY} r={eyeR+1.5} fill="url(#mJ)"/>
          <rect x={ex-eyeR} y={eyeY+eyeOffY-eyeR-4} width={eyeR*2} height={2.5} rx={1.2} fill={mDark}/>
          {!(blink||sleeping) ? (<>
            <circle cx={ex} cy={eyeY+eyeOffY} r={eyeR} fill={eyeFill[idx]}/>
            <circle cx={ex+pOX} cy={eyeY+eyeOffY+pOY} r={4.5} fill={punch||mood==="angry"?"#880000":"#1a0a00"}/>
            <circle cx={ex+pOX+0.5} cy={eyeY+eyeOffY+pOY-0.5} r={2} fill="#2a1a0a"/>
            <circle cx={ex+pOX-1.5} cy={eyeY+eyeOffY+pOY-1.5} r={1} fill="rgba(255,255,255,0.7)"/>
          </>) : (<rect x={ex-eyeR} y={eyeY+eyeOffY-1.2} width={eyeR*2} height={2.5} rx={1.2} fill={mDark}/>)}
        </g>
      ))}
    </svg>
  );
}

function RobotSVG_Bubbly({ mood, punch, running, dancing, danceFrame, sitting, thinking, exercising, martialFrame, blink, mouthOpen, glitch, konamiActive, dir, jumpPeak, leaving, leaveProgress, sleeping }: RobotSVGProps) {
  const W = 88, H = 118;
  const mc = MOOD_COLOR[mood] || "#00ff80";
  const isAngry = mood === "angry" || punch;
  const isSad = mood === "sad" || leaving;
  const headCX = W / 2, headCY = jumpPeak ? 30 : sitting ? 42 : 34;
  const headR = 26;
  const bodyTop = headCY + headR - 4;
  const bodyH = sitting ? 18 : 22;
  const mouthOpen2 = punch ? 1 : (blink || sleeping) ? 0 : mouthOpen;
  let armL = dancing ? [8,55,95,55,8,-35,-75,-35][danceFrame%8] : punch ? -85 : running ? 35 : sitting ? 50 : sleeping ? 40 : 5;
  let armR = dancing ? [8,-55,-95,-55,8,35,75,35][danceFrame%8] : running ? -35 : sitting ? 50 : sleeping ? 40 : -5;
  if (martialFrame > 0) { armL = [-95,-60,-115,-38,-95][martialFrame%5]; armR = [38,60,28,90,38][martialFrame%5]; }
  let legL = 0, legR = 0;
  if (dancing || exercising) { legL = [0,22,0,-22,0,16,0,-16][danceFrame%8]; legR = [0,-22,0,22,0,-16,0,16][danceFrame%8]; }
  const eyeOffY = leaving ? 3 : 0;
  const antennaTip = dancing ? Math.sin(danceFrame * 0.9) * 10 : 0;
  const hBase = "#b8cfe8", hLight = "#ddeeff", hDark = "#7a9ab8";
  const bBase = "#c8d8ee";
  const limbC = "#9ab8d4";
  const jointC = "#6a88a4";
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{overflow:"visible"}}>
      <defs>
        <radialGradient id="bHead" cx="38%" cy="28%" r="62%">
          <stop offset="0%" stopColor={hLight}/><stop offset="55%" stopColor={hBase}/><stop offset="100%" stopColor={hDark}/>
        </radialGradient>
        <radialGradient id="bBody" cx="35%" cy="22%" r="65%">
          <stop offset="0%" stopColor="#d8eaf8"/><stop offset="60%" stopColor={bBase}/><stop offset="100%" stopColor="#7a9ab8"/>
        </radialGradient>
        <radialGradient id="bLimb" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ccdae8"/><stop offset="100%" stopColor={limbC}/>
        </radialGradient>
        <radialGradient id="bEye" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffffff"/><stop offset="100%" stopColor="#d0e8ff"/>
        </radialGradient>
      </defs>
      {!jumpPeak && <ellipse cx={W/2} cy={H-3} rx={sitting?26:16} ry={3.5} fill="rgba(100,140,180,0.25)"/>}
      {!sitting ? (<>
        <g style={{transformOrigin:`${W/2-11}px ${bodyTop+bodyH-4}px`, transform:`rotate(${legL}deg)`}}>
          <rect x={W/2-16} y={bodyTop+bodyH-4} width={11} height={20} rx={5.5} fill="url(#bLimb)"/>
          <ellipse cx={W/2-10} cy={bodyTop+bodyH+17} rx={9} ry={5} fill={jointC} opacity={0.9}/>
        </g>
        <g style={{transformOrigin:`${W/2+11}px ${bodyTop+bodyH-4}px`, transform:`rotate(${legR}deg)`}}>
          <rect x={W/2+5} y={bodyTop+bodyH-4} width={11} height={20} rx={5.5} fill="url(#bLimb)"/>
          <ellipse cx={W/2+11} cy={bodyTop+bodyH+17} rx={9} ry={5} fill={jointC} opacity={0.9}/>
        </g>
      </>) : (<>
        <rect x={W/2-26} y={bodyTop+bodyH+2} width={20} height={10} rx={5} fill="url(#bLimb)"/>
        <rect x={W/2+6} y={bodyTop+bodyH+2} width={20} height={10} rx={5} fill="url(#bLimb)"/>
        <ellipse cx={W/2-22} cy={bodyTop+bodyH+12} rx={8} ry={5} fill={jointC} opacity={0.9}/>
        <ellipse cx={W/2+22} cy={bodyTop+bodyH+12} rx={8} ry={5} fill={jointC} opacity={0.9}/>
      </>)}
      <rect x={W/2-19} y={bodyTop} width={38} height={bodyH} rx={10} fill="url(#bBody)"/>
      <rect x={W/2-14} y={bodyTop+3} width={16} height={5} rx={2.5} fill="rgba(255,255,255,0.35)"/>
      <circle cx={W/2} cy={bodyTop+bodyH/2} r={6} fill={mc} opacity={0.8} style={{filter:`drop-shadow(0 0 5px ${mc})`}}/>
      <circle cx={W/2} cy={bodyTop+bodyH/2} r={3} fill="white" opacity={0.9}/>
      <g style={{transformOrigin:`${W/2-20}px ${bodyTop+5}px`, transform:`rotate(${armL}deg)`}}>
        <circle cx={W/2-20} cy={bodyTop+5} r={6} fill={jointC}/>
        <rect x={W/2-25} y={bodyTop+5} width={10} height={22} rx={5} fill="url(#bLimb)"/>
        <circle cx={W/2-20} cy={bodyTop+28} r={8} fill={punch?"#cc2200":jointC} style={{filter:punch?`drop-shadow(0 0 8px #ff3300)`:"none"}}/>
        {punch && <circle cx={W/2-20} cy={bodyTop+28} r={5} fill="#ff4444" opacity={0.8}/>}
      </g>
      <g style={{transformOrigin:`${W/2+20}px ${bodyTop+5}px`, transform:`rotate(${armR}deg)`}}>
        <circle cx={W/2+20} cy={bodyTop+5} r={6} fill={jointC}/>
        <rect x={W/2+15} y={bodyTop+5} width={10} height={22} rx={5} fill="url(#bLimb)"/>
        <circle cx={W/2+20} cy={bodyTop+28} r={8} fill={jointC}/>
      </g>
      <rect x={W/2-7} y={headCY+headR-2} width={14} height={10} rx={4} fill={jointC}/>
      <circle cx={headCX} cy={headCY+eyeOffY} r={headR} fill="url(#bHead)"/>
      <ellipse cx={headCX-6} cy={headCY-headR*0.45+eyeOffY} rx={10} ry={6} fill="rgba(255,255,255,0.3)"/>
      <line x1={headCX} y1={headCY-headR+eyeOffY} x2={headCX+antennaTip} y2={headCY-headR-18+eyeOffY} stroke={hDark} strokeWidth={2.5}/>
      <circle cx={headCX+antennaTip} cy={headCY-headR-18+eyeOffY} r={5} fill={mc} style={{filter:`drop-shadow(0 0 6px ${mc})`}}/>
      {thinking && (<g><circle cx={headCX+headR+2} cy={headCY-8} r={3} fill="rgba(255,215,0,0.7)"/><circle cx={headCX+headR+8} cy={headCY-16} r={5} fill="rgba(255,215,0,0.55)"/><circle cx={headCX+headR+16} cy={headCY-24} r={7} fill="rgba(255,215,0,0.4)"/></g>)}
      {sleeping && (<g><text x={headCX+headR+2} y={headCY-4+eyeOffY} fontSize={10} fill="#8899cc" opacity={0.9}>z</text><text x={headCX+headR+8} y={headCY-12+eyeOffY} fontSize={8} fill="#8899cc" opacity={0.7}>z</text><text x={headCX+headR+14} y={headCY-20+eyeOffY} fontSize={6} fill="#8899cc" opacity={0.5}>z</text></g>)}
      {konamiActive && <circle cx={headCX} cy={headCY-headR-6+eyeOffY} r={headR+8} fill="none" stroke="#ffff00" strokeWidth={2} opacity={0.7}/>}
      {isAngry && (<><path d={`M ${headCX-16} ${headCY-12+eyeOffY} L ${headCX-6} ${headCY-6+eyeOffY}`} stroke="#ff3300" strokeWidth={2.5} fill="none"/><path d={`M ${headCX+16} ${headCY-12+eyeOffY} L ${headCX+6} ${headCY-6+eyeOffY}`} stroke="#ff3300" strokeWidth={2.5} fill="none"/></>)}
      {isSad && !dancing && (<><ellipse cx={headCX-10} cy={headCY+14+eyeOffY} rx={2} ry={4} fill="#6699ff" opacity={0.7}/><ellipse cx={headCX+10} cy={headCY+14+eyeOffY} rx={2} ry={4} fill="#6699ff" opacity={0.7}/></>)}
      {[headCX-10, headCX+10].map((ex, idx) => (
        <g key={idx}>
          <circle cx={ex} cy={headCY+2+eyeOffY} r={9} fill={isAngry?"#331100":isSad?"#002233":"#2a4060"}/>
          <circle cx={ex} cy={headCY+2+eyeOffY} r={8.5} fill="url(#bEye)"/>
          {!(blink||sleeping) ? (<>
            <circle cx={ex} cy={headCY+2+eyeOffY} r={5} fill={isAngry?"#aa0000":isSad?"#2244aa":dancing?"#aa44cc":konamiActive?"#8800ff":mc}/>
            <circle cx={ex+2} cy={headCY-0.5+eyeOffY} r={2.2} fill="white" opacity={0.95}/>
            <circle cx={ex-2} cy={headCY+4+eyeOffY} r={1} fill="white" opacity={0.6}/>
            {(mood==="happy"||konamiActive) && <circle cx={ex+3} cy={headCY+4+eyeOffY} r={1.2} fill="white" opacity={0.7}/>}
          </>) : (
            <path d={`M ${ex-7} ${headCY+2+eyeOffY} Q ${ex} ${headCY+8+eyeOffY} ${ex+7} ${headCY+2+eyeOffY}`} fill="none" stroke={hDark} strokeWidth={2}/>
          )}
          <path d={isAngry?`M ${ex-7} ${headCY-9+eyeOffY} L ${ex+7} ${headCY-5+eyeOffY}`:`M ${ex-7} ${headCY-8+eyeOffY} Q ${ex} ${headCY-11+eyeOffY} ${ex+7} ${headCY-8+eyeOffY}`} fill="none" stroke={hDark} strokeWidth={2} strokeLinecap="round"/>
          <ellipse cx={ex} cy={headCY+10+eyeOffY} rx={5} ry={3} fill={dancing?"#ff88cc":"#ffaabb"} opacity={0.4}/>
        </g>
      ))}
      {mouthOpen2 < 0.3 ? (
        <path d={`M ${headCX-9} ${headCY+14+eyeOffY} Q ${headCX} ${headCY+18+eyeOffY} ${headCX+9} ${headCY+14+eyeOffY}`} fill="none" stroke={hDark} strokeWidth={2} strokeLinecap="round"/>
      ) : (
        <>
          <path d={`M ${headCX-11} ${headCY+13+eyeOffY} Q ${headCX} ${headCY+20+mouthOpen2*8+eyeOffY} ${headCX+11} ${headCY+13+eyeOffY}`} fill="#2a1020" stroke={hDark} strokeWidth={1.5}/>
          {mouthOpen2 > 0.5 && (<>
            <rect x={headCX-8} y={headCY+13+eyeOffY} width={5} height={4} rx={2} fill="white" opacity={0.9}/>
            <rect x={headCX+3} y={headCY+13+eyeOffY} width={5} height={4} rx={2} fill="white" opacity={0.9}/>
            <ellipse cx={headCX} cy={headCY+18+mouthOpen2*6+eyeOffY} rx={5} ry={3.5} fill="#ff3366" opacity={0.7}/>
          </>)}
        </>
      )}
    </svg>
  );
}

function RobotSVG_Cyber({ mood, punch, running, dancing, danceFrame, sitting, thinking, exercising, martialFrame, blink, mouthOpen, glitch, konamiActive, dir, jumpPeak, leaving, leaveProgress, sleeping }: RobotSVGProps) {
  const W = 82, H = 120;
  const mc = MOOD_COLOR[mood] || "#00ff80";
  const isAngry = mood === "angry" || punch;
  const isSad = mood === "sad" || leaving;
  const cx = W / 2;
  const headTop = jumpPeak ? 4 : sitting ? 32 : 10;
  const headH2 = 40, headW2 = 46;
  const bodyTop = headTop + headH2 + 8;
  const bodyH = sitting ? 20 : 26;
  const carbon = "#1c2230", panelDark = "#0d1520", panelMid = "#1e2d42";
  let armL = dancing ? [5,52,88,52,5,-38,-76,-38][danceFrame%8] : punch ? -80 : running ? 26 : sitting ? 45 : sleeping ? 35 : 5;
  let armR = dancing ? [5,-52,-88,-52,5,38,76,38][danceFrame%8] : running ? -26 : sitting ? 45 : sleeping ? 35 : -5;
  if (martialFrame > 0) { armL = [-100,-62,-118,-40,-100][martialFrame%5]; armR = [40,62,30,88,40][martialFrame%5]; }
  let legL = 0, legR = 0;
  if (dancing || exercising) { legL = [0,20,0,-20,0,14,0,-14][danceFrame%8]; legR = [0,-20,0,20,0,-14,0,14][danceFrame%8]; }
  const eyeOY = leaving ? 4 : 0;
  const hex = (cx2: number, cy2: number, r: number, rot = 0) => Array.from({length:6}, (_,i) => {
    const a = (i * 60 + rot) * Math.PI / 180;
    return `${cx2 + r * Math.cos(a)},${cy2 + r * Math.sin(a)}`;
  }).join(" ");
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{overflow:"visible"}}>
      <defs>
        <linearGradient id="cBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a3a50"/><stop offset="100%" stopColor="#0d1520"/>
        </linearGradient>
        <linearGradient id="cLimb" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1e2d42"/><stop offset="50%" stopColor="#2a3a50"/><stop offset="100%" stopColor="#1e2d42"/>
        </linearGradient>
        <linearGradient id="cHead" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#253242"/><stop offset="40%" stopColor="#1a2535"/><stop offset="100%" stopColor="#0d1520"/>
        </linearGradient>
      </defs>
      {!jumpPeak && <ellipse cx={cx} cy={H-3} rx={sitting?22:13} ry={3} fill="rgba(0,0,0,0.45)"/>}
      {!sitting ? (<>
        <g style={{transformOrigin:`${cx-9}px ${bodyTop+bodyH}px`, transform:`rotate(${legL}deg)`}}>
          <rect x={cx-14} y={bodyTop+bodyH} width={9} height={14} rx={1} fill="url(#cLimb)"/>
          <rect x={cx-15} y={bodyTop+bodyH+14} width={11} height={12} rx={1} fill={panelDark}/>
          <rect x={cx-14} y={bodyTop+bodyH+24} width={14} height={5} rx={1} fill={panelMid}/>
          <line x1={cx-11} y1={bodyTop+bodyH+1} x2={cx-11} y2={bodyTop+bodyH+13} stroke={mc} strokeWidth={1} opacity={0.5}/>
          <rect x={cx-14} y={bodyTop+bodyH+14} width={11} height={2} fill={mc} opacity={0.4}/>
        </g>
        <g style={{transformOrigin:`${cx+9}px ${bodyTop+bodyH}px`, transform:`rotate(${legR}deg)`}}>
          <rect x={cx+5} y={bodyTop+bodyH} width={9} height={14} rx={1} fill="url(#cLimb)"/>
          <rect x={cx+4} y={bodyTop+bodyH+14} width={11} height={12} rx={1} fill={panelDark}/>
          <rect x={cx} y={bodyTop+bodyH+24} width={14} height={5} rx={1} fill={panelMid}/>
          <line x1={cx+11} y1={bodyTop+bodyH+1} x2={cx+11} y2={bodyTop+bodyH+13} stroke={mc} strokeWidth={1} opacity={0.5}/>
          <rect x={cx+4} y={bodyTop+bodyH+14} width={11} height={2} fill={mc} opacity={0.4}/>
        </g>
      </>) : (<>
        <rect x={cx-26} y={bodyTop+bodyH+2} width={22} height={9} rx={2} fill="url(#cLimb)"/>
        <rect x={cx+4} y={bodyTop+bodyH+2} width={22} height={9} rx={2} fill="url(#cLimb)"/>
        <rect x={cx-30} y={bodyTop+bodyH+10} width={14} height={6} rx={2} fill={panelDark}/>
        <rect x={cx+16} y={bodyTop+bodyH+10} width={14} height={6} rx={2} fill={panelDark}/>
      </>)}
      <polygon points={`${cx-20},${bodyTop+bodyH} ${cx+20},${bodyTop+bodyH} ${cx+17},${bodyTop} ${cx-17},${bodyTop}`} fill="url(#cBody)"/>
      <line x1={cx-12} y1={bodyTop+5} x2={cx+12} y2={bodyTop+5} stroke={mc} strokeWidth={1.2} opacity={0.6}/>
      <line x1={cx-14} y1={bodyTop+14} x2={cx+14} y2={bodyTop+14} stroke={mc} strokeWidth={0.8} opacity={0.4}/>
      <line x1={cx-8} y1={bodyTop+5} x2={cx-8} y2={bodyTop+14} stroke={mc} strokeWidth={0.5} opacity={0.4}/>
      <line x1={cx+8} y1={bodyTop+5} x2={cx+8} y2={bodyTop+14} stroke={mc} strokeWidth={0.5} opacity={0.4}/>
      <polygon points={hex(cx, bodyTop+bodyH/2, 7)} fill={mc} opacity={0.85} style={{filter:`drop-shadow(0 0 6px ${mc})`}}/>
      <polygon points={hex(cx, bodyTop+bodyH/2, 4)} fill="white" opacity={0.9}/>
      {[cx-14, cx-10].map((lx, i) => <circle key={i} cx={lx} cy={bodyTop+bodyH-6} r={1.5} fill={i===0?"#ff4444":mc} opacity={0.8}/>)}
      <g style={{transformOrigin:`${cx-18}px ${bodyTop+6}px`, transform:`rotate(${armL}deg)`}}>
        <rect x={cx-24} y={bodyTop+6} width={11} height={6} rx={2} fill={panelMid}/>
        <rect x={cx-26} y={bodyTop+12} width={11} height={16} rx={1} fill="url(#cLimb)"/>
        <rect x={cx-26} y={bodyTop+27} width={11} height={7} rx={2} fill={punch?"#cc1100":panelDark} style={{filter:punch?`drop-shadow(0 0 8px #ff3300)`:"none"}}/>
        <line x1={cx-22} y1={bodyTop+13} x2={cx-22} y2={bodyTop+27} stroke={mc} strokeWidth={0.8} opacity={0.5}/>
        {[0,1,2].map(k=><circle key={k} cx={cx-24+k*3.5} cy={bodyTop+31} r={1.2} fill={punch?"#ff3300":mc} opacity={0.8}/>)}
      </g>
      <g style={{transformOrigin:`${cx+18}px ${bodyTop+6}px`, transform:`rotate(${armR}deg)`}}>
        <rect x={cx+13} y={bodyTop+6} width={11} height={6} rx={2} fill={panelMid}/>
        <rect x={cx+15} y={bodyTop+12} width={11} height={16} rx={1} fill="url(#cLimb)"/>
        <rect x={cx+15} y={bodyTop+27} width={11} height={7} rx={2} fill={panelDark}/>
        <line x1={cx+22} y1={bodyTop+13} x2={cx+22} y2={bodyTop+27} stroke={mc} strokeWidth={0.8} opacity={0.5}/>
        {[0,1,2].map(k=><circle key={k} cx={cx+16+k*3.5} cy={bodyTop+31} r={1.2} fill={mc} opacity={0.8}/>)}
      </g>
      <rect x={cx-8} y={headTop+headH2} width={16} height={10} rx={2} fill={panelDark}/>
      {[0,1,2].map(i=><rect key={i} x={cx-6+i*4} y={headTop+headH2+2} width={3} height={6} rx={1} fill={mc} opacity={0.5+i*0.15}/>)}
      <polygon points={`${cx-23},${headTop+headH2+eyeOY} ${cx+23},${headTop+headH2+eyeOY} ${cx+headW2/2},${headTop+eyeOY} ${cx-headW2/2},${headTop+eyeOY}`} fill="url(#cHead)"/>
      <polygon points={`${cx-23},${headTop+headH2+eyeOY} ${cx+23},${headTop+headH2+eyeOY} ${cx+headW2/2},${headTop+eyeOY} ${cx-headW2/2},${headTop+eyeOY}`} fill="none" stroke={`${mc}44`} strokeWidth={1}/>
      <rect x={cx-20} y={headTop+8+eyeOY} width={40} height={20} rx={3} fill={isAngry?"#220000":isSad?"#001122":panelDark}/>
      <rect x={cx-20} y={headTop+8+eyeOY} width={40} height={20} rx={3} fill="none" stroke={`${mc}66`} strokeWidth={1}/>
      {[-8,0,8].map((ox,i)=>(
        <g key={i}>
          <rect x={cx+ox-1} y={headTop-6-i*2+eyeOY} width={2} height={8+i*2} fill={panelMid}/>
          <circle cx={cx+ox} cy={headTop-8-i*2+eyeOY} r={i===1?3:2} fill={i===1?mc:`${mc}88`} style={{filter:`drop-shadow(0 0 4px ${mc})`}}/>
        </g>
      ))}
      {thinking && (<g><circle cx={cx+headW2/2+4} cy={headTop+8} r={3} fill={`${mc}88`}/><circle cx={cx+headW2/2+10} cy={headTop} r={5} fill={`${mc}66`}/><circle cx={cx+headW2/2+18} cy={headTop-8} r={7} fill={`${mc}44`}/></g>)}
      {sleeping && (<g><text x={cx+headW2/2+4} y={headTop+8+eyeOY} fontSize={10} fill="#8899cc" opacity={0.9}>z</text><text x={cx+headW2/2+10} y={headTop+eyeOY} fontSize={8} fill="#8899cc" opacity={0.7}>z</text><text x={cx+headW2/2+16} y={headTop-8+eyeOY} fontSize={6} fill="#8899cc" opacity={0.5}>z</text></g>)}
      {konamiActive && (<polygon points={`${cx},${headTop-14+eyeOY} ${cx+4},${headTop-5+eyeOY} ${cx+14},${headTop-5+eyeOY} ${cx+6},${headTop+1+eyeOY} ${cx+9},${headTop+11+eyeOY} ${cx},${headTop+5+eyeOY} ${cx-9},${headTop+11+eyeOY} ${cx-6},${headTop+1+eyeOY} ${cx-14},${headTop-5+eyeOY} ${cx-4},${headTop-5+eyeOY}`} fill="#ffff00" opacity={0.8} style={{filter:"drop-shadow(0 0 8px #ffff00)"}}/>)}
      {!blink ? (<>
        <rect x={cx-19} y={headTop+10+eyeOY} width={16} height={14} rx={2} fill={isAngry?"#330000":isSad?"#001133":carbon}/>
        <rect x={cx-19} y={headTop+10+eyeOY} width={16} height={14} rx={2} fill="none" stroke={`${mc}55`} strokeWidth={1}/>
        <rect x={cx-17} y={headTop+14+eyeOY} width={12} height={6} rx={1.5} fill={isAngry?"#ff3300":isSad?"#2244aa":mc} opacity={0.9} style={{filter:`drop-shadow(0 0 4px ${mc})`}}/>
        <rect x={cx+3} y={headTop+10+eyeOY} width={16} height={14} rx={2} fill={isAngry?"#330000":isSad?"#001133":carbon}/>
        <rect x={cx+3} y={headTop+10+eyeOY} width={16} height={14} rx={2} fill="none" stroke={`${mc}55`} strokeWidth={1}/>
        <rect x={cx+5} y={headTop+14+eyeOY} width={12} height={6} rx={1.5} fill={isAngry?"#ff3300":isSad?"#2244aa":mc} opacity={0.9} style={{filter:`drop-shadow(0 0 4px ${mc})`}}/>
        <rect x={cx-20} y={headTop+17+eyeOY} width={40} height={1.5} rx={0.5} fill={mc} opacity={0.2}/>
        {isAngry && (<><line x1={cx-14} y1={headTop+5+eyeOY} x2={cx-6} y2={headTop+10+eyeOY} stroke="#ff3300" strokeWidth={2}/><line x1={cx+14} y1={headTop+5+eyeOY} x2={cx+6} y2={headTop+10+eyeOY} stroke="#ff3300" strokeWidth={2}/></>)}
      </>) : (<rect x={cx-20} y={headTop+16+eyeOY} width={40} height={3} rx={1.5} fill={mc} opacity={0.3}/>)}
      <rect x={cx-13} y={headTop+headH2-12+eyeOY} width={26} height={Math.max(mouthOpen*8+2,4)} rx={2} fill={panelDark} stroke={`${mc}44`} strokeWidth={1}/>
      {mouthOpen > 0.3 && (<>{[0,1,2,3,4,5].map(k=><rect key={k} x={cx-11+k*4} y={headTop+headH2-11+eyeOY} width={2} height={Math.max(mouthOpen*6,2)} rx={1} fill={mc} opacity={0.7}/>)}</>)}
      {isSad && (<><ellipse cx={cx-10} cy={headTop+headH2-2+eyeOY} rx={2} ry={4} fill="#6699ff" opacity={0.6}/><ellipse cx={cx+10} cy={headTop+headH2-2+eyeOY} rx={2} ry={4} fill="#6699ff" opacity={0.6}/></>)}
      {[0,1,2].map(i=><line key={i} x1={cx-headW2/2} y1={headTop+12+i*7+eyeOY} x2={cx-headW2/2+6} y2={headTop+12+i*7+eyeOY} stroke={mc} strokeWidth={1} opacity={0.4}/>)}
      {[0,1,2].map(i=><line key={i} x1={cx+headW2/2} y1={headTop+12+i*7+eyeOY} x2={cx+headW2/2-6} y2={headTop+12+i*7+eyeOY} stroke={mc} strokeWidth={1} opacity={0.4}/>)}
    </svg>
  );
}

function RobotSVG({ robotType, ...props }: RobotSVGRootProps) {
  if (robotType === "bubbly") return <RobotSVG_Bubbly {...props}/>;
  if (robotType === "cyber") return <RobotSVG_Cyber {...props}/>;
  return <RobotSVG_Original {...props}/>;
}

export default function RobotCursor() {
  const [mounted, setMounted] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [sfxOn, setSfxOn] = useState(true);
  const [ttsOn, setTtsOn] = useState(true);
  const [ttsSpeed, setTtsSpeed] = useState(0.82);
  const [robotSize, setRobotSize] = useState(1.0);
  const [followSpeed, setFollowSpeed] = useState<"slow" | "normal" | "fast">("normal");
  const [showName, setShowName] = useState(true);
  const [robotType, setRobotType] = useState<'original' | 'bubbly' | 'cyber'>("original");
  const [bubbleSide, setBubbleSide] = useState("side");
  const [lang, setLang] = useState("en");
  const [personality, setPersonality] = useState("chaotic");
  const [anchorPos, setAnchorPos] = useState({ x: 200, y: 200 });
  const [pos, setPos] = useState({ x: 200, y: 200 });
  const [msg, setMsg] = useState("Monu Miah AI activated! Ready to sell you things!");
  const [msgKey, setMsgKey] = useState(0);
  const [punch, setPunch] = useState(false);
  const [dir, setDir] = useState(1);
  const [running, setRunning] = useState(false);
  const [boom, setBoom] = useState<{ x: number; y: number } | null>(null);
  const [blink, setBlink] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(0.5);
  const [glitch, setGlitch] = useState(false);
  const [mood, setMood] = useState("happy");
  const [dancing, setDancing] = useState(false);
  const [danceFrame, setDanceFrame] = useState(0);
  const [sitting, setSitting] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [exercising, setExercising] = useState(false);
  const [sleeping, setSleeping] = useState(false);
  const [martialFrame, setMartialFrame] = useState(0);
  const [webFrame, setWebFrame] = useState(0);
  const [jumpPeak, setJumpPeak] = useState(false);
  const [konamiActive, setKonamiActive] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [longPressActive, setLongPressActive] = useState(false);
  const [userActive, setUserActive] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [leaveProgress, setLeaveProgress] = useState(0);
  const [isGone, setIsGone] = useState(false);
  const [eggVisible, setEggVisible] = useState(false);

  // ── KEY FIX: clickThrough mode — when true robot passes clicks to underlying elements ──
  const [clickThrough, setClickThrough] = useState(true);

  const [vw, setVw] = useState(typeof window !== "undefined" ? window.innerWidth : 800);
  const [vh, setVh] = useState(typeof window !== "undefined" ? window.innerHeight : 600);

  const target = useRef({ x: 200, y: 200 });
  const cur = useRef({ x: 200, y: 200 });
  const raf = useRef<number | null>(null);
  const konamiQ = useRef<string[]>([]);
  const stepT = useRef(0);
  const danceInt = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoInt = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longT = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pressStartRef = useRef(0);
  const menuOpenedRef = useRef(false);
  const idleT = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoMode = useRef(false);
  const leaveAnimT = useRef<ReturnType<typeof setInterval> | null>(null);
  const enabledRef = useRef(true);
  const movementLockedRef = useRef(false);
  const currentActionRef = useRef<any>(null);
  const langRef = useRef(lang);
  const personalityRef = useRef(personality);
  useEffect(() => { langRef.current = lang; }, [lang]);
  useEffect(() => { personalityRef.current = personality; }, [personality]);

  // Panel open = menu or settings visible (NOT clickThrough mode)
  const panelOpen = menuOpen || settingsOpen;
  // Movement frozen only when panel is open OR longpress happening
  const movementFrozen = panelOpen || longPressActive;

  const { sfx, speak, setAudioEnabled, resetMelody } = useAudio(sfxOn, ttsOn, ttsSpeed);
  const rand = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];
  const getLines = useCallback((): Record<RobotLineKey, string[]> => langRef.current === "bn" ? LINES_BN : LINES_EN, []);

  const freezeAtCurrentPosition = useCallback(() => {
    const p = { x: cur.current.x, y: cur.current.y };
    target.current = { ...p };
    cur.current = { ...p };
    setAnchorPos(p);
    setPos(p);
    setRunning(false);
    autoMode.current = false;
    movementLockedRef.current = true;
  }, []);

  const closePanels = useCallback(() => {
    setMenuOpen(false);
    setSettingsOpen(false);
    movementLockedRef.current = false;
  }, []);

  const say = useCallback((key: RobotLineKey) => {
    if (!enabledRef.current) return;
    const lines = getLines();
    const p = PERSONALITIES[personalityRef.current];
    const pool = p?.lineKeys?.flatMap((k) => lines[k] || []) || [];
    const line = rand(lines[key] || (pool.length ? pool : LINES_EN[key]) || ["..."]);
    setMsg(line);
    setMsgKey(k => k + 1);
    speak(line);
  }, [speak, getLines]);

  const sayRandom = useCallback(() => {
    const p = PERSONALITIES[personalityRef.current];
    const key = rand(p?.lineKeys || ["joke", "happy", "chill"]);
    say(key);
  }, [say]);

  // ── KEY FIX: punch now uses elementFromPoint to find & click the underlying element ──
  const robotPunch = useCallback((clientX: number, clientY: number) => {
    if (!enabledRef.current) return;

    // Show visual punch effect
    setPunch(true);
    setBoom({ x: clientX, y: clientY });
    sfx.boom();
    say("punch");
    setGlitch(true);
    setTimeout(() => { setPunch(false); setBoom(null); setGlitch(false); }, 650);

    // If clickThrough mode: find and click the element under the robot
    if (clickThrough && !panelOpen) {
      // Temporarily hide robot elements so elementFromPoint can see through
      // We use a small timeout so the browser can re-paint
      setTimeout(() => {
        // Get all robot-layer elements and temporarily set pointer-events none
        const robotEls = document.querySelectorAll<HTMLElement>('[data-robot-layer]');
        robotEls.forEach(el => { el.style.pointerEvents = 'none'; });

        const el = document.elementFromPoint(clientX, clientY);

        // Restore
        robotEls.forEach(el => { el.style.pointerEvents = ''; });

        if (el && el !== document.body && el !== document.documentElement) {
          // Fire a click on the underlying element
          el.dispatchEvent(new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            clientX,
            clientY,
            screenX: clientX,
            screenY: clientY,
          }));
        }
      }, 10);
    }
  }, [sfx, say, clickThrough, panelOpen]);

  const resetAll = useCallback(() => {
    setSitting(false); setThinking(false); setDancing(false); setExercising(false); setSleeping(false);
    if (danceInt.current != null) clearInterval(danceInt.current);
    setMartialFrame(0); setWebFrame(0);
    currentActionRef.current = null;
  }, []);

  const walkOffScreen = useCallback((slow = false) => {
    setMood("leaving");
    setLeaving(true);
    resetAll();
    autoMode.current = false;
    movementLockedRef.current = false;
    let progress = 0;
    const exitX = window.innerWidth + 120;
    const startX = cur.current.x;
    const startY = cur.current.y;
    const step = slow ? 0.007 : 0.014;
    const tick = slow ? 45 : 30;
    leaveAnimT.current = setInterval(() => {
      progress += step;
      setLeaveProgress(Math.min(progress, 1));
      const nx = startX + (exitX - startX) * progress;
      const ny = startY + (window.innerHeight * 0.55 - startY) * progress;
      cur.current = { x: nx, y: ny };
      target.current = cur.current;
      setPos({ x: nx, y: ny });
      setDir(1);
      setRunning(progress > 0.05 && progress < 0.95);
      if (progress >= 1) {
        if (leaveAnimT.current != null) clearInterval(leaveAnimT.current);
        setLeaving(false);
        setLeaveProgress(0);
        setEnabled(false);
        setIsGone(true);
        setEggVisible(true);
        setRunning(false);
        enabledRef.current = false;
        setAudioEnabled(false);
      }
    }, tick);
  }, [resetAll, setAudioEnabled]);

  const getOutRobot = useCallback(() => {
    closePanels();
    setMood("sad");
    resetAll();
    say("get_out");
    sfx.sad();
    setTimeout(() => {
      sfx.goodbye();
      walkOffScreen(true);
    }, 2200);
  }, [closePanels, resetAll, say, sfx, walkOffScreen]);

  const comeBack = useCallback(() => {
    setEggVisible(false); setIsGone(false);
    enabledRef.current = true; setAudioEnabled(true);
    const lx = window.innerWidth / 2, ly = window.innerHeight / 2;
    cur.current = { x: lx, y: -60 }; target.current = { x: lx, y: ly };
    setPos({ x: lx, y: -60 }); setJumpPeak(true); setEnabled(true); setMood("happy");
    setTimeout(() => {
      setJumpPeak(false);
      setPos({ x: lx, y: ly });
      cur.current = { x: lx, y: ly };
      setAnchorPos({ x: lx, y: ly });
      target.current = { x: lx, y: ly };
      sfx.comeback();
      say("comeback");
    }, 420);
  }, [sfx, say, setAudioEnabled]);

  const startDance = useCallback((fromMenu = false) => {
    if (fromMenu) setMenuOpen(false);
    resetAll(); setMood("dance"); setDancing(true); setRunning(false);
    resetMelody(); say("idle_dance");
    danceInt.current = setInterval(() => {
      setDanceFrame(f => (f + 1) % 8);
      sfx.dance(DANCE_MELODY);
    }, 300);
    currentActionRef.current = "dance";
    setTimeout(() => {
      if (currentActionRef.current === "dance") {
        setDancing(false); if (danceInt.current != null) clearInterval(danceInt.current);
        setMood("happy"); currentActionRef.current = null;
      }
    }, 5000 + Math.random() * 4000);
  }, [sfx, say, resetAll, resetMelody]);

  const startExercise = useCallback(() => {
    resetAll(); setMood("exercise"); setExercising(true); setRunning(false);
    sfx.exercise(); say("exercise");
    let ef = 0;
    danceInt.current = setInterval(() => {
      setDanceFrame(f => (f + 1) % 8);
      if (ef % 2 === 0) sfx.exercise();
      ef++;
    }, 250);
    currentActionRef.current = "exercise";
    setTimeout(() => {
      if (currentActionRef.current === "exercise") {
        setExercising(false); if (danceInt.current != null) clearInterval(danceInt.current);
        setMood("happy"); currentActionRef.current = null;
      }
    }, 3500 + Math.random() * 2500);
  }, [sfx, say, resetAll]);

  const startSing = useCallback((fromMenu = false) => {
    if (fromMenu) setMenuOpen(false);
    resetAll(); setMood("sing"); setDancing(false); setRunning(false);
    sfx.sing(); say("sing");
    danceInt.current = setInterval(() => {
      setDanceFrame(f => (f + 1) % 8);
      sfx.sing();
    }, 400);
    currentActionRef.current = "sing";
    setTimeout(() => {
      if (currentActionRef.current === "sing") {
        if (danceInt.current != null) clearInterval(danceInt.current);
        setMood("happy"); currentActionRef.current = null;
      }
    }, 5000 + Math.random() * 3000);
  }, [sfx, say, resetAll]);

  const startSleep = useCallback((fromMenu = false) => {
    if (fromMenu) setMenuOpen(false);
    resetAll(); setMood("sleep"); setSleeping(true); setRunning(false);
    sfx.sleep(); say("sleep");
    currentActionRef.current = "sleep";
    setTimeout(() => {
      if (currentActionRef.current === "sleep") {
        setSleeping(false); setMood("happy"); currentActionRef.current = null;
        say("comeback");
      }
    }, 4000 + Math.random() * 4000);
  }, [sfx, say, resetAll]);

  const startMagic = useCallback((fromMenu = false) => {
    if (fromMenu) setMenuOpen(false);
    resetAll(); setMood("magic"); setRunning(false);
    sfx.magic(); say("magic");
    currentActionRef.current = "magic";
    setTimeout(() => {
      if (currentActionRef.current === "magic") {
        setMood("happy"); currentActionRef.current = null;
      }
    }, 3000 + Math.random() * 2000);
  }, [sfx, say, resetAll]);

  useEffect(() => {
    if (movementFrozen) {
      freezeAtCurrentPosition();
      movementLockedRef.current = true;
    } else if (!panelOpen) {
      movementLockedRef.current = false;
    }
  }, [movementFrozen, panelOpen, freezeAtCurrentPosition]);

  const pickAutoAction = useCallback(() => {
    if (!enabledRef.current || movementLockedRef.current || panelOpen || leaving) return;
    const actions = ["run","sit","think","dance","exercise","joke","chill","happy"];
    const act = actions[Math.floor(Math.random() * actions.length)];
    resetAll();
    if (act === "run") {
      autoMode.current = true; setMood("run"); setRunning(true);
      const tx = 80 + Math.random() * (vw - 160), ty = 80 + Math.random() * (vh - 160);
      target.current = { x: tx, y: ty };
      say("idle_run"); currentActionRef.current = "run";
      setTimeout(() => { if (currentActionRef.current === "run") { autoMode.current = false; setRunning(false); setMood("happy"); currentActionRef.current = null; } }, 3000 + Math.random() * 3000);
    } else if (act === "sit") {
      setMood("sit"); setSitting(true); setRunning(false);
      sfx.sit(); say("idle_sit"); currentActionRef.current = "sit";
      setTimeout(() => { setSitting(false); setMood("happy"); currentActionRef.current = null; }, 3000 + Math.random() * 3000);
    } else if (act === "think") {
      setMood("think"); setThinking(true); setRunning(false);
      sfx.think(); say("idle_think"); currentActionRef.current = "think";
      setTimeout(() => { setThinking(false); setMood("happy"); currentActionRef.current = null; }, 3000 + Math.random() * 2000);
    } else if (act === "dance") {
      startDance();
    } else if (act === "exercise") {
      startExercise();
    } else if (act === "sing") {
      startSing();
    } else if (act === "sleep") {
      startSleep();
    } else if (act === "magic") {
      startMagic();
    } else if (act === "chill") {
      setMood("chill"); setRunning(false); sfx.chill(); say("chill"); currentActionRef.current = "chill";
      setTimeout(() => { setMood("happy"); currentActionRef.current = null; }, 3000 + Math.random() * 2000);
    } else if (act === "joke") {
      say("joke"); sfx.happy();
    } else if (act === "happy") {
      setMood("happy"); sfx.happy(); say("happy");
    }
  }, [say, sfx, resetAll, startDance, startExercise, startSing, startSleep, startMagic, panelOpen, leaving, vw, vh]);

  useEffect(() => {
    if (!mounted || !enabled) return;
    const schedule = () => { autoInt.current = setTimeout(() => { if (!userActive && enabledRef.current) pickAutoAction(); schedule(); }, 8000 + Math.random() * 12000); };
    schedule();
    return () => { if (autoInt.current != null) clearTimeout(autoInt.current); };
  }, [mounted, enabled, pickAutoAction, userActive]);

  useEffect(() => {
    const onResize = () => { setVw(window.innerWidth); setVh(window.innerHeight); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const onAct = () => { setUserActive(true); autoMode.current = false; if (idleT.current != null) clearTimeout(idleT.current); idleT.current = setTimeout(() => setUserActive(false), 30000); };
    window.addEventListener("mousemove", onAct);
    window.addEventListener("click", onAct);
    window.addEventListener("touchstart", onAct, { passive: true });
    return () => { window.removeEventListener("mousemove", onAct); window.removeEventListener("click", onAct); window.removeEventListener("touchstart", onAct); };
  }, []);

  // ── KEY FIX: Track mouse/touch position — robot layer is always pointer-events:none
  // so we capture events from the window directly ──
  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (leaving || !enabledRef.current || movementLockedRef.current) return;
      let x = 0, y = 0;
      if ((e as TouchEvent).touches?.length) { x = (e as TouchEvent).touches[0].clientX; y = (e as TouchEvent).touches[0].clientY; }
      else if ('clientX' in e) { x = e.clientX; y = e.clientY; }
      target.current = { x, y };
      if (Math.random() < 0.004 && !dancing) say("move");
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
    };
  }, [say, dancing, leaving]);

  // ── KEY FIX: Global click/tap listener — when clickThrough on, robot "punches" on any click ──
  useEffect(() => {
    if (!clickThrough || panelOpen || !enabled || isGone) return;

    const onGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('[data-robot-ui]')) return;
      if (panelOpen) return;

      // Show punch animation at click location
      setPunch(true);
      setBoom({ x: e.clientX, y: e.clientY });
      sfx.boom();
      say("punch");
      setGlitch(true);
      setTimeout(() => { setPunch(false); setBoom(null); setGlitch(false); }, 650);
      // The click already goes through since robot layer is pointer-events:none
    };

    const onGlobalTouch = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('[data-robot-ui]')) return;
      if (panelOpen) return;
      if (e.touches.length !== 1) return;

      const t = e.touches[0];
      setPunch(true);
      setBoom({ x: t.clientX, y: t.clientY });
      sfx.boom();
      say("punch");
      setGlitch(true);
      setTimeout(() => { setPunch(false); setBoom(null); setGlitch(false); }, 650);
    };

    window.addEventListener("click", onGlobalClick, true);
    window.addEventListener("touchstart", onGlobalTouch, { passive: true, capture: true });
    return () => {
      window.removeEventListener("click", onGlobalClick, true);
      window.removeEventListener("touchstart", onGlobalTouch, { capture: true });
    };
  }, [clickThrough, panelOpen, enabled, isGone, sfx, say]);

  useEffect(() => {
    const speedMap = { slow: 0.06, normal: 0.12, fast: 0.22 };
    const loop = () => {
      if (!leaving && enabledRef.current && !movementLockedRef.current) {
        const pers = PERSONALITIES[personalityRef.current] || PERSONALITIES.chaotic;
        const dx = target.current.x - cur.current.x, dy = target.current.y - cur.current.y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d > 1.5) {
          const base = autoMode.current ? 0.05 : (speedMap[followSpeed] || 0.12);
          const spd = base * (pers.speedMult || 1);
          const ease = Math.min(1, spd * (1 + d * 0.002));
          cur.current = { x: cur.current.x + dx * ease, y: cur.current.y + dy * ease };
          setPos({ ...cur.current }); setDir(dx > 0 ? 1 : -1);
          const isR = d > 22; setRunning(isR);
          if (isR && sfxOn && enabledRef.current && Date.now() - stepT.current > 270) { sfx.step(); stepT.current = Date.now(); }
        } else { setRunning(false); }
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [sfx, sfxOn, leaving, followSpeed]);

  useEffect(() => {
    if (!mounted) return;
    let t: ReturnType<typeof setTimeout> | null = null;
    const b = () => { setBlink(true); setTimeout(() => setBlink(false), 100); t = setTimeout(b, 2500 + Math.random() * 2000); };
    t = setTimeout(b, 900);
    return () => { if (t != null) clearTimeout(t); };
  }, [mounted]);

  useEffect(() => {
    const m = setInterval(() => setMouthOpen(0.1 + Math.random() * 0.9), dancing ? 180 : 350);
    return () => clearInterval(m);
  }, [dancing]);

  useEffect(() => {
    const g = setInterval(() => {
      if (!enabledRef.current) return;
      if (Math.random() < 0.07) { setGlitch(true); setTimeout(() => setGlitch(false), 110); }
    }, 3500);
    return () => clearInterval(g);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!enabledRef.current) return;
      konamiQ.current = [...konamiQ.current, e.key].slice(-10);
      if (konamiQ.current.join(",") === KONAMI_SEQ.join(",")) {
        setKonamiActive(true); sfx.konami(); say("konami"); setGlitch(true);
        setTimeout(() => { setGlitch(false); setKonamiActive(false); }, 5000);
        konamiQ.current = [];
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sfx, say]);

  // ── Long-press on robot opens menu (touch/mouse hold) ──
  // Robot div itself has pointer-events:none for click-through,
  // but we detect long-press via global touchstart/mousedown near robot position
  useEffect(() => {
    const ROBOT_RADIUS = 60; // px from robot center to count as "on robot"

    const isOnRobot = (x: number, y: number) => {
      const rx = cur.current.x, ry = cur.current.y;
      const dist = Math.sqrt((x - rx) * 2 + (y - ry) * 2);
      return dist < ROBOT_RADIUS;
    };

    const onDown = (e: MouseEvent | TouchEvent) => {
      if (!enabledRef.current || panelOpen) return;
      const x = 'touches' in e ? e.touches[0]?.clientX : e.clientX;
      const y = 'touches' in e ? e.touches[0]?.clientY : e.clientY;
      if (x == null || y == null) return;
      if (!isOnRobot(x, y)) return;

      pressStartRef.current = Date.now();
      menuOpenedRef.current = false;
      freezeAtCurrentPosition();
      setLongPressActive(true);

      longT.current = setTimeout(() => {
        menuOpenedRef.current = true;
        freezeAtCurrentPosition();
        setMood("menu");
        setMenuOpen(true);
        setLongPressActive(false);
        say("menu_open");
        sfx.chill();
      }, 520);
    };

    const onUp = (_e: MouseEvent | TouchEvent) => {
      if (longT.current != null) clearTimeout(longT.current);
      setLongPressActive(false);
      if (!panelOpen) movementLockedRef.current = false;
    };

    window.addEventListener("mousedown", onDown);
    window.addEventListener("touchstart", onDown, { passive: true });
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("touchstart", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
    };
  }, [panelOpen, freezeAtCurrentPosition, say, sfx]);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  if (isGone || !enabled) {
    return (
      <div aria-hidden style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 999999 }}>
        <style>{`@keyframes eggPulse{0%,100%{transform:scale(1);box-shadow:0 0 16px #00ff8033}50%{transform:scale(1.08);box-shadow:0 0 28px #00ff8066}}`}</style>
        <button
          data-robot-ui
          type="button"
          onClick={comeBack}
          title="Tap to bring robot back"
          style={{
            position: "fixed", bottom: 16, left: 16, pointerEvents: "auto",
            width: 52, height: 52, borderRadius: "50%",
            background: "linear-gradient(145deg,#1a2a3a,#0d1520)",
            border: "2px solid #00ff8055",
            boxShadow: "0 0 20px #00ff8033, 0 4px 14px rgba(0,0,0,0.7)",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24, animation: "eggPulse 2s ease-in-out infinite", zIndex: 999999,
          }}
        >
          🥚
        </button>
      </div>
    );
  }

  const mc = MOOD_COLOR[mood] || "#00ff80";
  const displayPos = movementFrozen ? anchorPos : pos;
  const MENU_W = 168;

  const BWIDTH = 120;
  const baseScale = vw < 480 ? 0.75 : vw < 768 ? 0.88 : 1.0;
  const finalScale = baseScale * robotSize;
  const scaledRobotW = 80 * finalScale;
  const SIDE_GAP = scaledRobotW * 0.7 + 70;
  let bubbleLeft, bubbleTop;
  const robotCenterY = displayPos.y - 55;
  if (bubbleSide === "side") {
    const rawLeft = dir > 0
      ? displayPos.x + SIDE_GAP
      : displayPos.x - BWIDTH - SIDE_GAP + 20;
    bubbleLeft = Math.max(8, Math.min(rawLeft, vw - BWIDTH - 8));
    bubbleTop = Math.max(8, Math.min(robotCenterY - 20, vh - 80));
  } else {
    bubbleLeft = Math.max(8, Math.min(displayPos.x - BWIDTH/2, vw - BWIDTH - 8));
    bubbleTop = Math.max(8, displayPos.y - 170 * finalScale - 30);
  }

  const menuLeft = Math.min(Math.max(anchorPos.x - MENU_W / 2, 8), vw - MENU_W - 8);
  const menuTop = Math.min(Math.max(anchorPos.y - 210, 8), vh - 260);
  const settingsLeft = Math.min(Math.max(anchorPos.x - 120, 8), vw - 248);
  const settingsTop = Math.min(Math.max(anchorPos.y - 180, 8), vh - 320);

  const robotAnimation = jumpPeak ? "jumpArc 0.38s ease-out"
    : movementFrozen ? "menuFreeze 0.35s ease-out"
    : mood === "wiggle" ? "wiggleBot 0.35s ease-in-out infinite"
    : mood === "spin" ? "spinBot 0.5s linear infinite"
    : mood === "peek" ? "peekBot 1.2s ease-in-out infinite"
    : sitting || thinking || sleeping ? "none"
    : exercising ? "exerciseBounce 0.5s ease-in-out infinite"
    : dancing ? "danceBounce 0.6s ease-in-out infinite"
    : mood === "angry" ? "angerShake 0.3s infinite"
    : leaving ? "none"
    : "hoverBot 2.2s ease-in-out infinite";

  const robotFilter = glitch ? "hue-rotate(90deg) brightness(2.2)"
    : konamiActive ? undefined
    : `drop-shadow(0 0 10px ${mc}99) drop-shadow(0 12px 22px rgba(0,0,0,0.65))`;

  const styles = `
    @keyframes hoverBot{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
    @keyframes boomOut{0%{transform:scale(0.2) rotate(-5deg);opacity:1}100%{transform:scale(3) rotate(15deg);opacity:0}}
    @keyframes ringOut{0%{transform:scale(0.4);opacity:1}100%{transform:scale(3);opacity:0}}
    @keyframes bubblePop{0%{transform:scale(0.85);opacity:0}20%{transform:scale(1.06)}100%{transform:scale(1);opacity:1}}
    @keyframes noteFloat{0%{transform:translateY(0);opacity:1}100%{transform:translateY(-44px);opacity:0}}
    @keyframes rainbowFilter{0%{filter:hue-rotate(0deg) saturate(3) brightness(1.5)}100%{filter:hue-rotate(360deg) saturate(3) brightness(1.5)}}
    @keyframes jumpArc{0%{transform:translateY(0)}50%{transform:translateY(-32px)}100%{transform:translateY(0)}}
    @keyframes eggPulse{0%,100%{transform:scale(1);box-shadow:0 0 16px #00ff8033}50%{transform:scale(1.08);box-shadow:0 0 28px #00ff8066}}
    @keyframes exerciseBounce{0%,100%{transform:translateY(0)}40%{transform:translateY(-8px)}}
    @keyframes danceBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
    @keyframes angerShake{0%,100%{transform:translateX(0)}20%{transform:translateX(-5px)}40%{transform:translateX(5px)}60%{transform:translateX(-3px)}80%{transform:translateX(3px)}}
    @keyframes magicPulse{0%,100%{opacity:0.5;transform:scale(1)}50%{opacity:1;transform:scale(1.2)}}
    @keyframes menuFreeze{0%{transform:scale(1)}50%{transform:scale(1.04)}100%{transform:scale(1)}}
    @keyframes wiggleBot{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}
    @keyframes spinBot{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
    @keyframes peekBot{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px) scale(1.03)}}
    @keyframes longRing{from{stroke-dashoffset:100}to{stroke-dashoffset:0}}
    *{-webkit-tap-highlight-color:transparent;}
  `;

  const btnStyle = (active: boolean, color = "#00ff80") => ({
    flex:1, padding:"4px 2px", borderRadius:5,
    border:`1px solid ${active ? color : "#333"}`,
    background: active ? `${color}22` : "#0a0f0a",
    color: active ? color : "#666",
    fontSize:10, fontFamily:"monospace", cursor:"pointer",
  });

  const menuItems = [
    { label: "💪 Exercise", color: "#ff9900", fn: () => { closePanels(); startExercise(); } },
    { label: "😡 Angry", color: "#ff2200", fn: () => { closePanels(); resetAll(); setMood("angry"); sfx.angry(); say("angry"); setTimeout(() => setMood("happy"), 2500); } },
    { label: "😄 Funny", color: "#ffee55", fn: () => { closePanels(); say("joke"); sfx.happy(); } },
    { label: "😊 Happy", color: "#00ff80", fn: () => { closePanels(); resetAll(); setMood("happy"); sfx.happy(); say("happy"); } },
    { label: "⚙ Settings", color: "#88ccff", fn: () => { setMenuOpen(false); freezeAtCurrentPosition(); setSettingsOpen(true); setMood("menu"); } },
    { label: "👋 Get Out Robot", color: "#ff8888", fn: () => getOutRobot() },
    { label: "✕ Close", color: "#666666", fn: () => closePanels() },
  ];

  return (
    <>
      <style>{styles}</style>

      {/* BOOM */}
      {boom && (
        <div data-robot-layer style={{position:"fixed",left:boom.x-42,top:boom.y-42,pointerEvents:"none",zIndex:999999}}>
          <div style={{fontSize:62,animation:"boomOut 0.6s ease-out forwards"}}>💥</div>
          <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:60,height:60,borderRadius:"50%",border:`3px solid ${mc}`,animation:"ringOut 0.6s ease-out forwards"}}/>
        </div>
      )}

      {/* DANCE NOTES */}
      {dancing && [0,1,2,3].map(i => (
        <div key={`n${i}${danceFrame}`} data-robot-layer style={{position:"fixed",left:pos.x+(i-1.5)*26-6,top:pos.y-110,pointerEvents:"none",zIndex:999998,fontSize:14,animation:"noteFloat 0.9s ease-out forwards",animationDelay:`${i*0.12}s`,color:mc}}>
          {["♩","♫","♪","♬"][i]}
        </div>
      ))}

      {/* SING NOTES */}
      {mood==="sing" && [0,1,2].map(i => (
        <div key={`s${i}${danceFrame}`} data-robot-layer style={{position:"fixed",left:pos.x+(i-1)*30,top:pos.y-120,pointerEvents:"none",zIndex:999998,fontSize:16,animation:"noteFloat 1.2s ease-out infinite",animationDelay:`${i*0.25}s`,color:"#ff88ff"}}>
          {["🎵","🎶","🎵"][i]}
        </div>
      ))}

      {/* SLEEP Z's */}
      {sleeping && [0,1].map(i => (
        <div key={`z${i}${danceFrame}`} data-robot-layer style={{position:"fixed",left:pos.x+30+i*12,top:pos.y-100-i*15,pointerEvents:"none",zIndex:999998,fontSize:14+i*4,animation:"noteFloat 1.5s ease-out infinite",animationDelay:`${i*0.5}s`,color:"#8899cc",opacity:0.8}}>z</div>
      ))}

      {/* MAGIC STARS */}
      {mood==="magic" && ["✨","⭐","💫","✨"].map((e,i) => (
        <div key={i} data-robot-layer style={{position:"fixed",left:pos.x+Math.cos(i*90*Math.PI/180)*50,top:pos.y+Math.sin(i*90*Math.PI/180)*50-60,pointerEvents:"none",zIndex:999998,fontSize:16,animation:"magicPulse 0.8s ease-in-out infinite",animationDelay:`${i*0.2}s`}}>{e}</div>
      ))}

      {/* KONAMI STARS */}
      {konamiActive && ["⭐","🌟","⭐","🌟","⭐"].map((e,i) => (
        <div key={i} data-robot-layer style={{position:"fixed",left:pos.x+Math.cos(i*72*Math.PI/180)*60,top:pos.y+Math.sin(i*72*Math.PI/180)*60-60,pointerEvents:"none",zIndex:999998,fontSize:18,animation:"noteFloat 1s ease-out infinite",animationDelay:`${i*0.15}s`}}>{e}</div>
      ))}

      {/* Panel backdrop — only when menu/settings open */}
      {panelOpen && (
        <button
          data-robot-ui
          type="button"
          aria-label="Close robot menu"
          onClick={closePanels}
          style={{
            position: "fixed", inset: 0, pointerEvents: "auto", zIndex: 999901,
            background: "rgba(0,0,0,0.25)", border: "none", cursor: "default",
          }}
        />
      )}

      {/* SPEECH BUBBLE — always pointer-events:none so it never blocks clicks */}
      {!leaving && !panelOpen && (
        <div key={msgKey} data-robot-layer style={{
          position:"fixed", left:bubbleLeft, top:bubbleTop,
          pointerEvents:"none", zIndex:999998,
          animation:"bubblePop 0.2s ease-out",
          width:BWIDTH,
        }}>
          <div style={{
            background:"rgba(4,8,4,0.95)",
            borderRadius:6,
            padding:"4px 7px 5px",
            boxShadow:`0 2px 12px rgba(0,0,0,0.9), 0 0 8px ${mc}18`,
            border:`1px solid ${mc}33`,
          }}>
            {showName && (
              <div style={{fontSize:5,color:`${mc}44`,fontFamily:"monospace",letterSpacing:"0.08em",marginBottom:2}}>
                ▶ {mood.toUpperCase()}
              </div>
            )}
            <div style={{
              color:mc, fontSize:9, fontWeight:600,
              fontFamily:"system-ui,sans-serif",
              textShadow:`0 0 4px ${mc}55`,
              lineHeight:1.35,
              filter:glitch?"blur(0.4px)":"none",
              wordBreak:"break-word",
            }}>{msg}</div>
          </div>
          <div style={{
            position:"absolute", top:10,
            left:dir>0?-5:"auto", right:dir<0?-5:"auto",
            width:0, height:0,
            borderTop:"4px solid transparent",
            borderBottom:"4px solid transparent",
            ...(dir>0?{borderRight:`5px solid ${mc}33`}:{borderLeft:`5px solid ${mc}33`}),
          }}/>
        </div>
      )}

      {/* LONG-PRESS RING */}
      {longPressActive && (
        <div data-robot-layer style={{position:"fixed",left:displayPos.x-20,top:displayPos.y-52,pointerEvents:"none",zIndex:999996}}>
          <svg width={40} height={40} viewBox="0 0 40 40">
            <circle cx={20} cy={20} r={16} fill="none" stroke={mc} strokeWidth={3} strokeDasharray="100" strokeDashoffset="100" style={{animation:"longRing 0.6s linear forwards"}}/>
          </svg>
        </div>
      )}

      {/* ── ROBOT — always pointer-events:none so ALL clicks pass through ── */}
      <div
        data-robot-layer
        style={{
          position: "fixed", left: displayPos.x - 40, top: displayPos.y - 90,
          // KEY FIX: entire robot is pointer-events:none — clicks fall through to page
          pointerEvents: "none",
          zIndex: 999997,
          opacity: leaving ? Math.max(0, 1 - leaveProgress * 0.75) : 1,
        }}
      >
        <div
          style={{
            position: "absolute", left: 0, top: 0,
            width: 80, height: 120,
            pointerEvents: "none",
            zIndex: 999997,
            transform: `scaleX(${dir}) scale(${finalScale})`,
            transformOrigin: "center bottom",
            animation: robotAnimation,
            filter: konamiActive ? undefined : robotFilter,
            ...(konamiActive ? { animation: "rainbowFilter 0.5s linear infinite" } : {}),
            userSelect: "none",
            touchAction: "none",
            display: "flex", alignItems: "flex-end", justifyContent: "center",
          }}
        >
          <RobotSVG robotType={robotType} mood={mood} punch={punch} running={running}
            dancing={dancing} danceFrame={danceFrame} sitting={sitting} thinking={thinking}
            exercising={exercising} martialFrame={martialFrame} webFrame={webFrame}
            blink={blink} mouthOpen={mouthOpen} glitch={glitch} konamiActive={konamiActive}
            dir={dir} jumpPeak={jumpPeak} leaving={leaving} leaveProgress={leaveProgress}
            sleeping={sleeping}
          />
        </div>
      </div>

      {/* ── CLICK-THROUGH TOGGLE (small indicator) ── */}
      {!panelOpen && (
        <button
          data-robot-ui
          type="button"
          onClick={() => setClickThrough(v => !v)}
          title={clickThrough ? "Click-through ON: robot passes clicks to page" : "Click-through OFF: robot clicks don't reach page"}
          style={{
            position: "fixed", bottom: 16, right: 16, pointerEvents: "auto",
            width: 36, height: 36, borderRadius: "50%",
            background: clickThrough ? "#00ff8022" : "#ff220022",
            border: `1.5px solid ${clickThrough ? "#00ff8066" : "#ff220066"}`,
            color: clickThrough ? "#00ff80" : "#ff4444",
            fontSize: 14, cursor: "pointer", zIndex: 999997,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          {clickThrough ? "👆" : "🚫"}
        </button>
      )}

      {/* MENU */}
      {menuOpen && (
        <div
          data-robot-ui
          role="menu"
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "fixed", left: menuLeft, top: menuTop, width: MENU_W,
            pointerEvents: "auto", zIndex: 999902,
            background: "rgba(4,10,4,0.98)", border: `1px solid ${mc}44`,
            borderRadius: 10, padding: "8px 6px",
            boxShadow: `0 8px 28px rgba(0,0,0,0.9), 0 0 16px ${mc}18`,
          }}
        >
          <div style={{ fontFamily: "monospace", fontSize: 8, color: `${mc}66`, marginBottom: 6, letterSpacing: "0.08em" }}>
            HOLD · ROBOT MENU
          </div>
          {menuItems.map((b, i) => (
            <button
              key={i}
              type="button"
              onClick={b.fn}
              style={{
                display: "block", width: "100%", marginBottom: 3, padding: "8px 8px",
                minHeight: 36, textAlign: "left", background: "transparent",
                border: `1px solid ${b.color}28`, borderRadius: 6, color: b.color,
                fontSize: 12, fontFamily: "system-ui,sans-serif", cursor: "pointer",
                touchAction: "manipulation",
              }}
            >
              {b.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setSfxOn((v) => !v)}
            style={{
              display: "block", width: "100%", marginTop: 4, padding: "6px",
              fontSize: 10, color: "#888", background: "transparent", border: "none", cursor: "pointer",
            }}
          >
            {sfxOn ? "🔊 Sound on" : "🔇 Sound off"}
          </button>
        </div>
      )}

      {settingsOpen && (
        <div
          data-robot-ui
          role="dialog"
          aria-label="Robot settings"
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "fixed", left: settingsLeft, top: settingsTop, width: 240,
            pointerEvents: "auto", zIndex: 999902,
            background: "rgba(4,10,4,0.98)", border: `1px solid ${mc}44`,
            borderRadius: 10, padding: "10px 8px",
            boxShadow: `0 8px 28px rgba(0,0,0,0.9), 0 0 16px ${mc}18`,
          }}
        >
          <div style={{ fontFamily: "monospace", fontSize: 8, color: `${mc}66`, marginBottom: 8, letterSpacing: "0.08em" }}>
            ⚙ ROBOT SETTINGS
          </div>
          <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
            <button type="button" onClick={() => setSfxOn(v => !v)} style={btnStyle(sfxOn)}>{sfxOn ? "🔊 Sound" : "🔇 Mute"}</button>
            <button type="button" onClick={() => setTtsOn(v => !v)} style={btnStyle(ttsOn, "#88ccff")}>{ttsOn ? "🗣 TTS" : "🤐 TTS off"}</button>
          </div>
          <p style={{ fontSize: 9, color: "#666", margin: "4px 0 2px" }}>Language</p>
          <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
            {["en", "bn"].map(l => (
              <button key={l} type="button" onClick={() => setLang(l)} style={btnStyle(lang === l, "#ff88ff")}>{l === "en" ? "EN" : "BN"}</button>
            ))}
          </div>
          <p style={{ fontSize: 9, color: "#666", margin: "4px 0 2px" }}>Robot style</p>
          <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
            {([ ["original","Orig"], ["bubbly","Bubbly"], ["cyber","Cyber"] ] as const).map(([k,l]) => (
              <button key={k} type="button" onClick={() => setRobotType(k)} style={btnStyle(robotType === k)}>{l}</button>
            ))}
          </div>
          <p style={{ fontSize: 9, color: "#666", margin: "4px 0 2px" }}>Personality</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 6 }}>
            {Object.entries(PERSONALITIES).map(([k, p]) => (
              <button key={k} type="button" onClick={() => setPersonality(k)} style={{ ...btnStyle(personality === k), flex: "1 1 45%" }}>{p.label}</button>
            ))}
          </div>
          <p style={{ fontSize: 9, color: "#666", margin: "4px 0 2px" }}>Size: {robotSize.toFixed(1)}x</p>
          <input type="range" min={0.6} max={1.4} step={0.1} value={robotSize} onChange={e => setRobotSize(parseFloat(e.target.value))} style={{ width: "100%", marginBottom: 6 }} />
          <p style={{ fontSize: 9, color: "#666", margin: "4px 0 2px" }}>Follow speed</p>
          <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
            {([ ["slow","Slow"], ["normal","Normal"], ["fast","Fast"] ] as const).map(([k,l]) => (
              <button key={k} type="button" onClick={() => setFollowSpeed(k)} style={btnStyle(followSpeed === k, "#ffaa44")}>{l}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
            <button type="button" onClick={() => setClickThrough(v => !v)} style={btnStyle(clickThrough, "#00ff80")}>
              {clickThrough ? "👆 Click-thru ON" : "🚫 Click-thru OFF"}
            </button>
          </div>
          <button type="button" onClick={closePanels} style={{ display: "block", width: "100%", padding: "8px", fontSize: 11, color: "#888", background: "transparent", border: "1px solid #333", borderRadius: 6, cursor: "pointer" }}>
            ✕ Close settings
          </button>
        </div>
      )}
    </>
  );
}