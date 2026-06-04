import { useState, useRef, useCallback, useEffect } from "react";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const AVATAR_TYPES = [
  { id:"male",    label:"Male",              emoji:"🧑‍💼", desc:"Professional male presenter" },
  { id:"female",  label:"Female",            emoji:"👩‍💼", desc:"Elegant female presenter" },
  { id:"cartoon", label:"Cartoon",           emoji:"🧑‍🎨", desc:"Animated cartoon character" },
  { id:"biz",     label:"Business",          emoji:"👔",   desc:"Corporate business presenter" },
  { id:"news",    label:"News Anchor",       emoji:"📺",   desc:"Professional news anchor" },
  { id:"teacher", label:"Teacher",           emoji:"👩‍🏫", desc:"Educational presenter" },
  { id:"doctor",  label:"Doctor",            emoji:"👨‍⚕️", desc:"Medical professional" },
  { id:"celeb",   label:"Celebrity Style",   emoji:"🌟",   desc:"Glamorous celebrity look" },
];

const VOICE_LANGS = [
  { code:"hi", label:"Hindi", flag:"🇮🇳" },
  { code:"en", label:"English", flag:"🇬🇧" },
  { code:"ur", label:"Urdu", flag:"🇵🇰" },
  { code:"pa", label:"Punjabi", flag:"🟠" },
  { code:"ta", label:"Tamil", flag:"🟡" },
  { code:"te", label:"Telugu", flag:"🔵" },
  { code:"mr", label:"Marathi", flag:"🟤" },
  { code:"bn", label:"Bengali", flag:"🟢" },
];
const VOICE_STYLES = [
  { id:"news",       label:"News",       icon:"📰" },
  { id:"soft",       label:"Soft",       icon:"🌸" },
  { id:"dramatic",   label:"Dramatic",   icon:"🎭" },
  { id:"motivate",   label:"Motivational",icon:"💪" },
  { id:"child",      label:"Child",      icon:"🧒" },
  { id:"elder",      label:"Elder",      icon:"👴" },
  { id:"robot",      label:"Robot AI",   icon:"🤖" },
  { id:"whisper",    label:"Whisper",    icon:"🤫" },
];

const MUSIC_CATS = [
  { id:"sad",         label:"Sad / Emotional",      icon:"😢", color:"#6366f1" },
  { id:"romantic",    label:"Romantic",              icon:"❤️",  color:"#e11d48" },
  { id:"motivate",    label:"Motivational",          icon:"🔥",  color:"#f97316" },
  { id:"docu",        label:"Documentary",           icon:"🎥",  color:"#0891b2" },
  { id:"school",      label:"School Ad",             icon:"🏫",  color:"#16a34a" },
  { id:"realestate",  label:"Real Estate",           icon:"🏠",  color:"#ca8a04" },
  { id:"festival",    label:"Festival / Celebration",icon:"🎉",  color:"#dc2626" },
  { id:"corporate",   label:"Corporate",             icon:"💼",  color:"#475569" },
  { id:"wedding",     label:"Wedding",               icon:"💍",  color:"#db2777" },
  { id:"political",   label:"Political Campaign",    icon:"🗳️",  color:"#7c3aed" },
];

const TEMPLATES = [
  { id:"school",    label:"School Advertisement",    icon:"🏫", tag:"Education",   color:"#16a34a" },
  { id:"hospital",  label:"Hospital Promotion",      icon:"🏥", tag:"Healthcare",  color:"#0891b2" },
  { id:"realestate",label:"Real Estate Project",     icon:"🏘️", tag:"Property",    color:"#ca8a04" },
  { id:"ytintro",   label:"YouTube Intro",           icon:"▶️",  tag:"Social Media",color:"#dc2626" },
  { id:"wedding",   label:"Wedding Invitation",      icon:"💍",  tag:"Personal",   color:"#db2777" },
  { id:"political", label:"Political Campaign",      icon:"🗳️", tag:"Campaign",    color:"#7c3aed" },
  { id:"product",   label:"Product Promotion",       icon:"📦",  tag:"Commerce",   color:"#f97316" },
  { id:"social",    label:"Social Media Marketing",  icon:"📱",  tag:"Digital",    color:"#0ea5e9" },
  { id:"corporate", label:"Corporate Presentation",  icon:"💼",  tag:"Business",   color:"#475569" },
  { id:"festival",  label:"Festival Celebration",    icon:"🎉",  tag:"Events",     color:"#eab308" },
];

const PIPELINE_STEPS = [
  { id:"story",     label:"Story",     icon:"📖" },
  { id:"script",    label:"Script",    icon:"📝" },
  { id:"character", label:"Character", icon:"🎭" },
  { id:"voice",     label:"Voice",     icon:"🎙️" },
  { id:"music",     label:"Music",     icon:"🎵" },
  { id:"video",     label:"Video",     icon:"🎬" },
  { id:"download",  label:"Download",  icon:"⬇️" },
];

const MAIN_TOOLS = [
  { id:"txt2vid",   label:"Text to Video",      icon:"📝➡️🎬", color:"#f59e0b", desc:"Likho aur video banao" },
  { id:"img2vid",   label:"Image to Video",     icon:"🖼️➡️🎬", color:"#10b981", desc:"Photo se video banao" },
  { id:"story2film",label:"Story to Film",      icon:"📖➡️🎞️", color:"#6366f1", desc:"Kahani se poori film" },
  { id:"adcreator", label:"AI Ad Creator",      icon:"📣",      color:"#f43f5e", desc:"Business ad auto-generate" },
  { id:"avatar",    label:"Talking Avatar",     icon:"🤖",      color:"#0891b2", desc:"Apna talking avatar banao" },
  { id:"voice",     label:"AI Voice Generator", icon:"🎙️",      color:"#8b5cf6", desc:"Text se voice banao" },
];

// ─── THEME ───────────────────────────────────────────────────────────────────
const T = {
  bg:       "#070810",
  bg2:      "#0d0e1a",
  bg3:      "#111325",
  border:   "#1c1f3a",
  border2:  "#252849",
  gold:     "#e8b84b",
  goldDim:  "#c9a84c",
  red:      "#ff4444",
  accent:   "#4f6ef7",
  text:     "#dde2ff",
  textDim:  "#7880b0",
  textFaint:"#3a3f6a",
  font:     "'Cinzel', 'Georgia', serif",
  fontBody: "'Palatino Linotype', 'Book Antiqua', serif",
};

// ─── REUSABLE COMPONENTS ──────────────────────────────────────────────────────
const css = {
  card: {
    background:`linear-gradient(145deg,${T.bg2},${T.bg3})`,
    border:`1px solid ${T.border}`,borderRadius:14,padding:"22px 20px",marginBottom:16
  },
  cardTitle:{fontSize:16,fontWeight:700,color:T.gold,marginBottom:5,display:"flex",alignItems:"center",gap:8,fontFamily:T.font},
  cardDesc:{fontSize:12,color:T.textDim,marginBottom:16,letterSpacing:"0.03em"},
  input:{
    width:"100%",background:T.bg,border:`1px solid ${T.border2}`,borderRadius:9,
    padding:"11px 14px",color:T.text,fontSize:13,fontFamily:T.fontBody,
    outline:"none",boxSizing:"border-box",marginBottom:10
  },
  textarea:{
    width:"100%",minHeight:130,background:T.bg,border:`1px solid ${T.border2}`,
    borderRadius:9,padding:"13px 14px",color:T.text,fontSize:13,
    fontFamily:T.fontBody,outline:"none",boxSizing:"border-box",resize:"vertical",lineHeight:1.7
  },
  btnGold:{
    padding:"11px 24px",borderRadius:9,border:"none",
    background:`linear-gradient(135deg,${T.gold},#ff7e2f)`,
    color:"#080810",fontWeight:800,fontSize:13,cursor:"pointer",
    fontFamily:T.font,letterSpacing:"0.05em"
  },
  btnOutline:{
    padding:"9px 18px",borderRadius:9,
    border:`1px solid ${T.border2}`,background:"transparent",
    color:T.textDim,fontSize:12,cursor:"pointer",fontFamily:T.fontBody
  },
  label:{fontSize:11,color:T.textDim,marginBottom:5,display:"block",letterSpacing:"0.08em",textTransform:"uppercase"},
  badge:(c)=>({
    display:"inline-block",padding:"2px 9px",borderRadius:10,fontSize:10,
    fontWeight:700,background:`${c}22`,color:c,letterSpacing:"0.05em"
  }),
  progressBar:{height:6,background:T.border,borderRadius:6,overflow:"hidden",marginTop:6},
  progressFill:(p,c="#e8b84b")=>({
    height:"100%",width:`${Math.min(p,100)}%`,
    background:`linear-gradient(90deg,${c},${T.gold})`,borderRadius:6,transition:"width 0.35s ease"
  }),
};

function Pill({label,active,onClick,color}){
  const c = color||T.gold;
  return(
    <button onClick={onClick} style={{
      padding:"6px 13px",borderRadius:20,fontSize:11,fontWeight:600,cursor:"pointer",
      border:active?`1px solid ${c}`:`1px solid ${T.border}`,
      background:active?`${c}1a`:"transparent",color:active?c:T.textFaint,
      transition:"all 0.18s",letterSpacing:"0.04em"
    }}>{label}</button>
  );
}

function ProgressModal({title,steps,progress,done,onClose}){
  return(
    <div style={{
      position:"fixed",inset:0,background:"#000000cc",zIndex:1000,
      display:"flex",alignItems:"center",justifyContent:"center",padding:20
    }}>
      <div style={{...css.card,maxWidth:460,width:"100%",padding:32}}>
        <div style={{...css.cardTitle,fontSize:18,marginBottom:20}}>{title}</div>
        {steps.map((s,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
            <div style={{
              width:24,height:24,borderRadius:"50%",flexShrink:0,
              background:progress>(i+1)*(100/steps.length)?T.gold:T.border,
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:11,color:progress>(i+1)*(100/steps.length)?"#080810":T.textFaint,fontWeight:700
            }}>
              {progress>(i+1)*(100/steps.length)?"✓":i+1}
            </div>
            <span style={{fontSize:13,color:progress>(i+1)*(100/steps.length)?T.text:T.textFaint}}>{s}</span>
          </div>
        ))}
        <div style={css.progressBar}><div style={css.progressFill(progress)}/></div>
        <div style={{textAlign:"center",marginTop:8,fontSize:12,color:T.textDim}}>{Math.min(Math.round(progress),100)}%</div>
        {done&&(
          <div style={{textAlign:"center",marginTop:20}}>
            <div style={{fontSize:36,marginBottom:8}}>🎉</div>
            <div style={{fontSize:15,color:T.gold,fontWeight:700,marginBottom:16}}>Ready hai!</div>
            <button style={css.btnGold} onClick={onClose}>✓ Done</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function NewStarStudio(){
  const [page,setPage]=useState("dashboard");
  const [modal,setModal]=useState(null); // {title,steps}
  const [progress,setProgress]=useState(0);
  const [done,setDone]=useState(false);
  const [aiOutput,setAiOutput]=useState("");
  const [aiLoading,setAiLoading]=useState(false);

  // per-section state
  const [avatarType,setAvatarType]=useState(null);
  const [avatarPhoto,setAvatarPhoto]=useState(null);
  const [avatarScript,setAvatarScript]=useState("");
  const [avatarGenerated,setAvatarGenerated]=useState(false);

  const [imgPrompt,setImgPrompt]=useState("");
  const [imgGenerated,setImgGenerated]=useState(false);
  const [imgStyle,setImgStyle]=useState("Cinematic");
  const [t2iImages,setT2iImages]=useState([]);

  const [voiceLang,setVoiceLang]=useState("hi");
  const [voiceStyle,setVoiceStyle]=useState("news");
  const [voiceGender,setVoiceGender]=useState("female");
  const [voiceText,setVoiceText]=useState("");
  const [voiceEmotion,setVoiceEmotion]=useState("Neutral");
  const [voiceGenerated,setVoiceGenerated]=useState(false);
  const [cloneFile,setCloneFile]=useState(null);

  const [musicCat,setMusicCat]=useState(null);
  const [selectedTrack,setSelectedTrack]=useState(null);

  const [adType,setAdType]=useState("school");
  const [adDetails,setAdDetails]=useState("");
  const [adScript,setAdScript]=useState("");
  const [adGenerated,setAdGenerated]=useState(false);

  const [selectedTemplate,setSelectedTemplate]=useState(null);

  const [storySeed,setStorySeed]=useState("");
  const [storyExpanded,setStoryExpanded]=useState("");

  const [pipelineActive,setPipelineActive]=useState(false);
  const [pipelineStep,setPipelineStep]=useState(0);

  // pipeline data
  const [pipelineStory,setPipelineStory]=useState("");
  const [pipelineScript,setPipelineScript]=useState("");
  const [pipelineGenre,setPipelineGenre]=useState("Drama");
  const [pipelineAvatar,setPipelineAvatar]=useState(null);
  const [pipelineVoice,setPipelineVoice]=useState("female");
  const [pipelineMusic,setPipelineMusic]=useState(null);
  const [pipelineQuality,setPipelineQuality]=useState("1080p");
  const [pipelineFormat,setPipelineFormat]=useState("MP4");
  const [pipelineTitle,setPipelineTitle]=useState("");
  const [pipelineFinished,setPipelineFinished]=useState(false);

  const photoRef=useRef();
  const cloneRef=useRef();

  const runProgress=(steps,onDone)=>{
    setProgress(0);setDone(false);
    const iv=setInterval(()=>{
      setProgress(p=>{
        if(p>=100){clearInterval(iv);setDone(true);onDone&&onDone();return 100;}
        return p+Math.random()*7+3;
      });
    },220);
  };

  const callAI=useCallback(async(prompt,onResult)=>{
    setAiLoading(true);
    try{
      const r=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",max_tokens:1000,
          messages:[{role:"user",content:prompt}]
        })
      });
      const d=await r.json();
      const txt=d.content?.[0]?.text||"";
      onResult(txt);
    }catch{onResult("AI response unavailable. Please try again.");}
    setAiLoading(false);
  },[]);

  // ── DASHBOARD ──────────────────────────────────────────────────────────────
  const Dashboard=()=>(
    <div>
      {/* Hero */}
      <div style={{textAlign:"center",padding:"40px 0 32px",position:"relative"}}>
        <div style={{fontSize:11,letterSpacing:"0.4em",color:T.goldDim,marginBottom:10,fontFamily:T.font}}>✦ NEW STAR FILMS ✦</div>
        <h1 style={{
          fontSize:"clamp(30px,6vw,56px)",fontFamily:T.font,fontWeight:900,margin:"0 0 6px",
          background:"linear-gradient(135deg,#ffd700 0%,#e8b84b 40%,#ff6b35 100%)",
          WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",
          letterSpacing:"-0.02em"
        }}>AI Film Studio</h1>
        <p style={{color:T.textDim,fontSize:13,letterSpacing:"0.15em",marginBottom:0}}>STORY → SCRIPT → CHARACTER → VOICE → MUSIC → VIDEO → DOWNLOAD</p>
        {/* pipeline bar */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:0,marginTop:20,flexWrap:"wrap"}}>
          {PIPELINE_STEPS.map((s,i)=>(
            <div key={s.id} style={{display:"flex",alignItems:"center"}}>
              <div style={{
                padding:"5px 12px",borderRadius:20,fontSize:11,fontWeight:600,
                background:i===0?`${T.gold}22`:T.bg3,border:`1px solid ${i===0?T.gold:T.border}`,
                color:i===0?T.gold:T.textFaint,fontFamily:T.font
              }}>{s.icon} {s.label}</div>
              {i<PIPELINE_STEPS.length-1&&<div style={{width:16,height:1,background:T.border,margin:"0 2px"}}/>}
            </div>
          ))}
        </div>
      </div>

      {/* MAIN BIG BUTTON */}
      <div style={{
        ...css.card,
        background:"linear-gradient(135deg,#0d0e1a,#111325,#0d1428)",
        border:`2px solid ${T.gold}44`,padding:0,overflow:"hidden",marginBottom:20
      }}>
        <div style={{
          background:"linear-gradient(135deg,#e8b84b22,#ff6b3511)",
          padding:"28px 24px 8px",textAlign:"center"
        }}>
          <div style={{fontSize:11,letterSpacing:"0.3em",color:T.gold,marginBottom:8,fontFamily:T.font}}>MAIN ENTRY POINT</div>
          <button
            onClick={()=>setPage("pipeline")}
            style={{
              padding:"18px 48px",borderRadius:14,border:"none",cursor:"pointer",
              background:"linear-gradient(135deg,#e8b84b,#ff6b35,#e8b84b)",
              backgroundSize:"200% 200%",
              color:"#080810",fontWeight:900,fontSize:"clamp(16px,3vw,22px)",
              fontFamily:T.font,letterSpacing:"0.08em",
              boxShadow:"0 0 40px #e8b84b44,0 4px 20px #ff6b3522",
              marginBottom:20
            }}
          >
            ✦ GENERATE WITH AI ✦
          </button>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center",paddingBottom:24}}>
            {MAIN_TOOLS.map(t=>(
              <button key={t.id} onClick={()=>setPage(t.id)} style={{
                padding:"8px 16px",borderRadius:10,border:`1px solid ${t.color}44`,
                background:`${t.color}11`,color:t.color,fontSize:12,fontWeight:700,
                cursor:"pointer",fontFamily:T.fontBody
              }}>{t.icon} {t.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:12,marginBottom:20}}>
        {[
          {icon:"🤖",title:"AI Avatar Generator",desc:"Talking avatars with your photo",page:"avatar",c:"#0891b2"},
          {icon:"🖼️",title:"Text to Image",desc:"Generate images with AI",page:"t2i",c:"#10b981"},
          {icon:"🎙️",title:"AI Voice Studio",desc:"Multi-language voice cloning",page:"voice",c:"#8b5cf6"},
          {icon:"🎵",title:"Music Library",desc:"100+ background music tracks",page:"music",c:"#e11d48"},
          {icon:"📣",title:"AI Ad Generator",desc:"Auto-create business ads",page:"adcreator",c:"#f97316"},
          {icon:"🗂️",title:"Template Marketplace",desc:"Ready-made video templates",page:"templates",c:"#eab308"},
          {icon:"✨",title:"AI Story Expansion",desc:"One sentence → full film",page:"story2film",c:"#6366f1"},
          {icon:"🎬",title:"Full Pipeline",desc:"End-to-end video creation",page:"pipeline",c:"#e8b84b"},
        ].map(f=>(
          <div key={f.page} onClick={()=>setPage(f.page)} style={{
            ...css.card,cursor:"pointer",padding:"18px 16px",
            border:`1px solid ${f.c}33`,transition:"all 0.2s",
          }}>
            <div style={{fontSize:28,marginBottom:8}}>{f.icon}</div>
            <div style={{fontSize:13,fontWeight:700,color:f.c,marginBottom:4,fontFamily:T.font}}>{f.title}</div>
            <div style={{fontSize:11,color:T.textDim}}>{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── AVATAR ──────────────────────────────────────────────────────────────────
  const AvatarPage=()=>(
    <div>
      <div style={css.card}>
        <div style={css.cardTitle}>🤖 AI Avatar Generator</div>
        <div style={css.cardDesc}>Avatar type chunein, photo upload karein aur talking avatar banayein</div>
        <label style={css.label}>AVATAR TYPE</label>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(110px,1fr))",gap:10,marginBottom:16}}>
          {AVATAR_TYPES.map(a=>(
            <div key={a.id} onClick={()=>setAvatarType(a.id)} style={{
              padding:"12px 8px",borderRadius:10,textAlign:"center",cursor:"pointer",
              border:`1px solid ${avatarType===a.id?T.gold:T.border}`,
              background:avatarType===a.id?`${T.gold}11`:T.bg,transition:"all 0.18s"
            }}>
              <div style={{fontSize:28,marginBottom:5}}>{a.emoji}</div>
              <div style={{fontSize:11,fontWeight:600,color:avatarType===a.id?T.gold:T.text}}>{a.label}</div>
              <div style={{fontSize:10,color:T.textFaint,marginTop:2}}>{a.desc}</div>
            </div>
          ))}
        </div>
        <label style={css.label}>APNI PHOTO UPLOAD KAREIN (optional)</label>
        <div onClick={()=>photoRef.current?.click()} style={{
          border:`2px dashed ${T.border2}`,borderRadius:10,padding:"24px",
          textAlign:"center",cursor:"pointer",marginBottom:16
        }}>
          {avatarPhoto
            ?<div><img src={avatarPhoto} style={{width:80,height:80,objectFit:"cover",borderRadius:40,border:`2px solid ${T.gold}`}}/><div style={{fontSize:12,color:T.gold,marginTop:8}}>✓ Photo selected</div></div>
            :<div><div style={{fontSize:32}}>📸</div><div style={{fontSize:12,color:T.textDim}}>Click to upload your photo</div></div>
          }
        </div>
        <input ref={photoRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{
          const f=e.target.files[0];if(!f)return;
          const r=new FileReader();r.onload=ev=>setAvatarPhoto(ev.target.result);r.readAsDataURL(f);
        }}/>
        <label style={css.label}>AVATAR SCRIPT</label>
        <textarea style={css.textarea} placeholder="Yahan wo text likhein jo avatar bolega..." value={avatarScript} onChange={e=>setAvatarScript(e.target.value)}/>
        <button style={css.btnGold} onClick={()=>{
          if(!avatarType||!avatarScript.trim())return;
          setModal({title:"🤖 Avatar Generate Ho Raha Hai",steps:["Face mapping","Voice sync","Animation render","Lip sync","Final export"]});
          runProgress([],()=>setAvatarGenerated(true));
        }}>
          🤖 Talking Avatar Banao
        </button>
        {avatarGenerated&&(
          <div style={{marginTop:16,background:T.bg,borderRadius:10,padding:16,border:`1px solid ${T.gold}44`,textAlign:"center"}}>
            <div style={{fontSize:36,marginBottom:8}}>{AVATAR_TYPES.find(a=>a.id===avatarType)?.emoji}</div>
            <div style={{fontSize:14,color:T.gold,fontWeight:700}}>Talking Avatar Ready! 🎉</div>
            <div style={{display:"flex",gap:8,justifyContent:"center",marginTop:12,flexWrap:"wrap"}}>
              <button style={css.btnGold}>⬇️ MP4 Download</button>
              <button style={css.btnOutline}>🔗 Share Link</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // ── TEXT TO IMAGE ────────────────────────────────────────────────────────────
  const T2IPage=()=>{
    const styles=["Cinematic","Bollywood","Anime","Realistic","Oil Paint","Watercolor","Comic","3D Render"];
    return(
      <div>
        <div style={css.card}>
          <div style={css.cardTitle}>🖼️ Text to Image Generator</div>
          <div style={css.cardDesc}>Text likhein → AI image banayega → phir video mein convert karein</div>
          <label style={css.label}>IMAGE DESCRIPTION</label>
          <textarea style={css.textarea} placeholder="Describe the image: 'A beautiful Indian wedding ceremony at sunset with golden lights and flowers...'" value={imgPrompt} onChange={e=>setImgPrompt(e.target.value)}/>
          <label style={css.label}>IMAGE STYLE</label>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16}}>
            {styles.map(s=><Pill key={s} label={s} active={imgStyle===s} onClick={()=>setImgStyle(s)}/>)}
          </div>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            <button style={css.btnGold} onClick={()=>{
              if(!imgPrompt.trim())return;
              setModal({title:"🖼️ Images Generate Ho Rahi Hain",steps:["Prompt analysis","Style transfer","Image synthesis","Quality enhancement","Finalizing"]});
              runProgress([],()=>{
                setT2iImages([
                  {id:1,emoji:"🌄",label:"Scene 1"},
                  {id:2,emoji:"🏙️",label:"Scene 2"},
                  {id:3,emoji:"🎭",label:"Scene 3"},
                  {id:4,emoji:"🌟",label:"Scene 4"},
                ]);
                setImgGenerated(true);
              });
            }}>✨ Images Generate Karein</button>
          </div>
          {imgGenerated&&t2iImages.length>0&&(
            <div style={{marginTop:20}}>
              <div style={{fontSize:12,color:T.gold,marginBottom:10,letterSpacing:"0.05em"}}>GENERATED IMAGES</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10,marginBottom:14}}>
                {t2iImages.map(img=>(
                  <div key={img.id} style={{
                    height:100,borderRadius:10,background:`linear-gradient(135deg,${T.bg3},${T.bg2})`,
                    border:`1px solid ${T.border2}`,display:"flex",flexDirection:"column",
                    alignItems:"center",justifyContent:"center",cursor:"pointer"
                  }}>
                    <div style={{fontSize:36}}>{img.emoji}</div>
                    <div style={{fontSize:11,color:T.textDim,marginTop:4}}>{img.label}</div>
                  </div>
                ))}
              </div>
              <button style={css.btnGold} onClick={()=>{
                setModal({title:"🎬 Image to Video Convert",steps:["Keyframe extraction","Motion synthesis","Scene transitions","Audio sync","Final render"]});
                runProgress([]);
              }}>🎬 Video Mein Convert Karein</button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ── VOICE STUDIO ─────────────────────────────────────────────────────────────
  const VoicePage=()=>(
    <div>
      <div style={css.card}>
        <div style={css.cardTitle}>🎙️ AI Voice Studio</div>
        <div style={css.cardDesc}>Multi-language voices, emotions, aur voice cloning</div>
        <label style={css.label}>LANGUAGE</label>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:14}}>
          {VOICE_LANGS.map(l=>(
            <Pill key={l.code} label={`${l.flag} ${l.label}`} active={voiceLang===l.code} onClick={()=>setVoiceLang(l.code)}/>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
          <div>
            <label style={css.label}>GENDER</label>
            <div style={{display:"flex",gap:8}}>
              {["male","female"].map(g=>(
                <Pill key={g} label={g==="male"?"👨 Male":"👩 Female"} active={voiceGender===g} onClick={()=>setVoiceGender(g)}/>
              ))}
            </div>
          </div>
          <div>
            <label style={css.label}>EMOTION</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {["Neutral","Happy","Sad","Excited","Calm","Angry"].map(e=>(
                <Pill key={e} label={e} active={voiceEmotion===e} onClick={()=>setVoiceEmotion(e)}/>
              ))}
            </div>
          </div>
        </div>
        <label style={css.label}>VOICE STYLE</label>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(100px,1fr))",gap:8,marginBottom:14}}>
          {VOICE_STYLES.map(v=>(
            <div key={v.id} onClick={()=>setVoiceStyle(v.id)} style={{
              padding:"10px 8px",borderRadius:9,textAlign:"center",cursor:"pointer",
              border:`1px solid ${voiceStyle===v.id?T.gold:T.border}`,
              background:voiceStyle===v.id?`${T.gold}11`:T.bg
            }}>
              <div style={{fontSize:22}}>{v.icon}</div>
              <div style={{fontSize:11,color:voiceStyle===v.id?T.gold:T.text,marginTop:4}}>{v.label}</div>
            </div>
          ))}
        </div>
        <label style={css.label}>YOUR TEXT</label>
        <textarea style={css.textarea} placeholder="Yahan wo text paste karein jise voice mein convert karna hai..." value={voiceText} onChange={e=>setVoiceText(e.target.value)}/>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:20}}>
          <button style={css.btnGold} onClick={()=>{
            if(!voiceText.trim())return;
            setModal({title:"🎙️ Voice Generate Ho Rahi Hai",steps:["Text processing","Language model","Voice synthesis","Emotion overlay","Audio export"]});
            runProgress([],()=>setVoiceGenerated(true));
          }}>🎙️ Voice Generate Karein</button>
        </div>
        {voiceGenerated&&(
          <div style={{background:T.bg,borderRadius:10,padding:14,border:`1px solid ${T.gold}44`}}>
            <div style={{fontSize:12,color:T.gold,marginBottom:10}}>✓ VOICE READY</div>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <button style={{...css.btnGold,padding:"8px 16px",fontSize:12}}>▶ Play</button>
              <div style={{flex:1,height:4,background:T.border,borderRadius:4,position:"relative"}}>
                <div style={{position:"absolute",left:0,top:0,width:"60%",height:"100%",background:T.gold,borderRadius:4}}/>
              </div>
              <span style={{fontSize:11,color:T.textDim}}>0:34</span>
            </div>
            <div style={{display:"flex",gap:8,marginTop:12}}>
              <button style={css.btnOutline}>⬇️ MP3</button>
              <button style={css.btnOutline}>⬇️ WAV</button>
            </div>
          </div>
        )}
        <div style={{borderTop:`1px solid ${T.border}`,paddingTop:18,marginTop:18}}>
          <div style={{...css.cardTitle,fontSize:14,marginBottom:8}}>🔬 Voice Cloning</div>
          <div style={{fontSize:12,color:T.textDim,marginBottom:12}}>Apni awaaz upload karein — AI use clone karega</div>
          <button style={css.btnOutline} onClick={()=>cloneRef.current?.click()}>
            🎤 Apni Awaaz Upload Karein (30 sec)
          </button>
          <input ref={cloneRef} type="file" accept="audio/*" style={{display:"none"}} onChange={e=>setCloneFile(e.target.files[0]?.name||null)}/>
          {cloneFile&&<div style={{fontSize:12,color:T.gold,marginTop:8}}>✓ {cloneFile}</div>}
        </div>
      </div>
    </div>
  );

  // ── MUSIC LIBRARY ─────────────────────────────────────────────────────────────
  const MusicPage=()=>{
    const tracks={
      sad:["Dard Ka Ehsaas","Aansu Ki Baarish","Bichde Hue Log","Silent Pain","Broken Hearts"],
      romantic:["Pyaar Ka Rang","Ishq Mein Doobe","Mohabbat Ki Raah","Love in Moonlight","Dil Se"],
      motivate:["Rise Up","Junoon Ki Aag","Taqat Se Aage","Champion's March","Uthke Chal"],
      docu:["Journey Begins","Sach Ki Kahani","Real Stories","Documentary Score","Truth Unveiled"],
      school:["Vidya Ka Mandir","Seekhne Ka Josh","School Bells","Future Leaders","Bright Minds"],
      realestate:["Dream Home","Your Perfect Space","Luxury Living","New Beginnings","Home Sweet"],
      festival:["Rangilo Re","Dhamaal Hai","Celebration Mode","Festive Beats","Joy Unlimited"],
      corporate:["Professional Edge","Business Forward","Success Story","Corporate Sync","The Brand"],
      wedding:["Sehra Bandi","Dulhan Aaye","Wedding Waltz","Suhaag Raat","Pheras"],
      political:["Jai Hind","Awam Ki Awaaz","Change Is Now","Nation Rises","Vote For Future"],
    };
    const activeTracks=musicCat?(tracks[musicCat]||[]):[];
    return(
      <div>
        <div style={css.card}>
          <div style={css.cardTitle}>🎵 Background Music Library</div>
          <div style={css.cardDesc}>100+ tracks — category ke hisaab se perfect music chunein</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:10,marginBottom:16}}>
            {MUSIC_CATS.map(c=>(
              <div key={c.id} onClick={()=>setMusicCat(c.id)} style={{
                padding:"14px 10px",borderRadius:10,textAlign:"center",cursor:"pointer",
                border:`1px solid ${musicCat===c.id?c.color:T.border}`,
                background:musicCat===c.id?`${c.color}14`:T.bg,transition:"all 0.18s"
              }}>
                <div style={{fontSize:26,marginBottom:6}}>{c.icon}</div>
                <div style={{fontSize:11,fontWeight:600,color:musicCat===c.id?c.color:T.text}}>{c.label}</div>
              </div>
            ))}
          </div>
          {musicCat&&(
            <div>
              <div style={{fontSize:11,color:T.gold,letterSpacing:"0.08em",marginBottom:10}}>TRACKS</div>
              {activeTracks.map((t,i)=>(
                <div key={i} onClick={()=>setSelectedTrack(t)} style={{
                  display:"flex",alignItems:"center",gap:12,padding:"10px 12px",
                  borderRadius:9,cursor:"pointer",marginBottom:6,
                  border:`1px solid ${selectedTrack===t?T.gold:T.border}`,
                  background:selectedTrack===t?`${T.gold}0d`:T.bg,transition:"all 0.15s"
                }}>
                  <div style={{
                    width:28,height:28,borderRadius:"50%",
                    background:selectedTrack===t?T.gold:T.border2,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:12,color:selectedTrack===t?"#080810":T.textDim,fontWeight:700
                  }}>{selectedTrack===t?"▶":"▶"}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,color:selectedTrack===t?T.gold:T.text}}>{t}</div>
                    <div style={{fontSize:10,color:T.textFaint}}>2:{String(20+i*7).padStart(2,"0")} • 128kbps</div>
                  </div>
                  {selectedTrack===t&&<div style={{...css.badge(T.gold),fontSize:9}}>SELECTED</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // ── AD GENERATOR ─────────────────────────────────────────────────────────────
  const AdPage=()=>{
    const adTypes=[
      {id:"school",label:"School",icon:"🏫"},{id:"hospital",label:"Hospital",icon:"🏥"},
      {id:"product",label:"Product",icon:"📦"},{id:"realestate",label:"Real Estate",icon:"🏠"},
      {id:"restaurant",label:"Restaurant",icon:"🍽️"},{id:"political",label:"Political",icon:"🗳️"},
    ];
    return(
      <div>
        <div style={css.card}>
          <div style={css.cardTitle}>📣 AI Ad Generator</div>
          <div style={css.cardDesc}>Business details dein — AI script, voice, video, subtitles sab kuch auto-create karega</div>
          <label style={css.label}>AD TYPE</label>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16}}>
            {adTypes.map(t=>(
              <button key={t.id} onClick={()=>setAdType(t.id)} style={{
                padding:"8px 16px",borderRadius:9,cursor:"pointer",fontSize:12,
                border:`1px solid ${adType===t.id?T.gold:T.border}`,
                background:adType===t.id?`${T.gold}11`:T.bg,
                color:adType===t.id?T.gold:T.text
              }}>{t.icon} {t.label}</button>
            ))}
          </div>
          <label style={css.label}>BUSINESS / PRODUCT DETAILS</label>
          <textarea style={{...css.textarea,minHeight:100}} placeholder={`Example:\nSchool ka naam: Bright Future Academy\nLocation: Lucknow\nSpecial features: Smart classes, free transport\nTarget audience: Parents with children 5-15 years`} value={adDetails} onChange={e=>setAdDetails(e.target.value)}/>
          <button style={css.btnGold} disabled={aiLoading||!adDetails.trim()} onClick={()=>{
            callAI(
              `You are a professional Indian advertising copywriter. Create a 30-second advertisement script in Hinglish (Hindi+English mix) for the following:\n\nAd Type: ${adType}\nDetails: ${adDetails}\n\nProvide:\n1. Script/Voice-over text (30 seconds)\n2. 5 scene descriptions\n3. Suggested background music mood\n4. Key message/tagline\n\nKeep it engaging, emotional and persuasive. Format clearly with sections.`,
              txt=>{setAdScript(txt);setAdGenerated(true);}
            );
          }}>
            {aiLoading?"🤔 AI Script Likh Raha Hai...":"✨ AI Ad Generate Karein"}
          </button>
          {adGenerated&&adScript&&(
            <div style={{marginTop:16}}>
              <div style={{fontSize:12,color:T.gold,marginBottom:8,letterSpacing:"0.05em"}}>✓ AI-GENERATED AD SCRIPT</div>
              <div style={{
                background:T.bg,borderRadius:10,padding:"14px 16px",
                border:`1px solid ${T.border2}`,fontSize:12,color:T.text,
                lineHeight:1.8,maxHeight:300,overflowY:"auto",whiteSpace:"pre-wrap"
              }}>{adScript}</div>
              <div style={{display:"flex",gap:10,marginTop:14,flexWrap:"wrap"}}>
                <button style={css.btnGold} onClick={()=>{
                  setModal({title:"📣 Ad Video Ban Rahi Hai",steps:["Script finalizing","Voice-over recording","Scene generation","Subtitle overlay","Music mixing","Final export"]});
                  runProgress([]);
                }}>🎬 Full Ad Video Banao</button>
                <button style={css.btnOutline}>📋 Script Copy Karein</button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ── TEMPLATES ─────────────────────────────────────────────────────────────────
  const TemplatesPage=()=>(
    <div>
      <div style={css.card}>
        <div style={css.cardTitle}>🗂️ Template Marketplace</div>
        <div style={css.cardDesc}>Ready-made professional templates — customize karein aur use karein</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12}}>
          {TEMPLATES.map(t=>(
            <div key={t.id} onClick={()=>setSelectedTemplate(t.id)} style={{
              ...css.card,cursor:"pointer",padding:"18px 14px",marginBottom:0,
              border:`1px solid ${selectedTemplate===t.id?t.color:T.border}`,
              background:selectedTemplate===t.id?`${t.color}0d`:T.bg,transition:"all 0.2s"
            }}>
              <div style={{fontSize:30,marginBottom:8}}>{t.icon}</div>
              <div style={{fontSize:12,fontWeight:700,color:selectedTemplate===t.id?t.color:T.text,marginBottom:4}}>{t.label}</div>
              <div style={{...css.badge(t.color),marginBottom:10}}>{t.tag}</div>
              {selectedTemplate===t.id&&(
                <button style={{...css.btnGold,padding:"7px 14px",fontSize:11,width:"100%",marginTop:6}} onClick={e=>{
                  e.stopPropagation();
                  setModal({title:`🎬 ${t.label} Template`,steps:["Template loading","Customization","Scene assembly","Brand overlay","Export ready"]});
                  runProgress([]);
                }}>Use Template</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── STORY EXPANSION ───────────────────────────────────────────────────────────
  const StoryPage=()=>(
    <div>
      <div style={css.card}>
        <div style={css.cardTitle}>✨ AI Story Expansion</div>
        <div style={css.cardDesc}>Ek sentence likhein — AI poori film story, script, characters, voice, music aur video banayega</div>
        <label style={css.label}>APNA EK SENTENCE LIKHEIN</label>
        <textarea style={{...css.textarea,minHeight:70}} placeholder="Jaise: 'Ek garib ladka apni maa ke sapne poore karne ke liye sheher jaata hai...'" value={storySeed} onChange={e=>setStorySeed(e.target.value)}/>
        <button style={css.btnGold} disabled={aiLoading||!storySeed.trim()} onClick={()=>{
          callAI(
            `You are a master Bollywood/Indian filmmaker and storyteller. Take this one-line story seed and expand it into a complete film story.\n\nSeed: "${storySeed}"\n\nProvide in this exact format:\n\n🎬 FILM TITLE: (Creative title)\n\n📖 FULL STORY: (3-4 paragraphs, emotional, cinematic)\n\n🎭 CHARACTERS:\n- (3-4 main characters with description)\n\n🎞️ 5 KEY SCENES:\n1. (Scene description)\n2-5...\n\n🎙️ VOICE-OVER INTRO: (30 second narration)\n\n🎵 MUSIC MOOD: (Describe the background music style)\n\n💬 TAGLINE: (Memorable one-liner)\n\nMake it emotional, dramatic and cinematic in Hinglish style.`,
            txt=>setStoryExpanded(txt)
          );
        }}>
          {aiLoading?"🤔 Story Expand Ho Rahi Hai...":"✨ Poori Story Generate Karein"}
        </button>
        {storyExpanded&&(
          <div style={{marginTop:16}}>
            <div style={{fontSize:12,color:T.gold,marginBottom:8,letterSpacing:"0.05em"}}>✓ AI-EXPANDED FULL STORY</div>
            <div style={{
              background:T.bg,borderRadius:10,padding:"16px",
              border:`1px solid ${T.border2}`,fontSize:12,color:T.text,
              lineHeight:1.9,maxHeight:400,overflowY:"auto",whiteSpace:"pre-wrap",
              fontFamily:T.fontBody
            }}>{storyExpanded}</div>
            <div style={{display:"flex",gap:10,marginTop:14,flexWrap:"wrap"}}>
              <button style={css.btnGold} onClick={()=>{
                setModal({title:"🎞️ Story to Film",steps:["Script breakdown","Character design","Scene generation","Voice-over recording","Music composition","Video assembly","Final film export"]});
                runProgress([]);
              }}>🎬 Poori Film Banao</button>
              <button style={css.btnOutline} onClick={()=>setPipelineActive(true)}>
                🔄 Full Pipeline Mein Bhejen
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // ── FULL PIPELINE ─────────────────────────────────────────────────────────────
  const PipelinePage=()=>{
    const qualityOpts=[
      {label:"480p",c:"#a78bfa"},{label:"720p",c:"#f59e0b"},{label:"1080p",c:"#10b981"},{label:"4K",c:"#f43f5e"}
    ];
    return(
      <div>
        {/* step bar */}
        <div style={{display:"flex",alignItems:"center",overflowX:"auto",paddingBottom:8,marginBottom:20,gap:0}}>
          {PIPELINE_STEPS.map((s,i)=>(
            <div key={s.id} style={{display:"flex",alignItems:"center",flexShrink:0}}>
              <div onClick={()=>i<=pipelineStep&&setPipelineStep(i)} style={{
                padding:"7px 14px",borderRadius:20,fontSize:11,fontWeight:700,
                cursor:i<=pipelineStep?"pointer":"default",whiteSpace:"nowrap",
                background:i===pipelineStep?`linear-gradient(135deg,${T.gold},#ff6b35)`:i<pipelineStep?T.bg3:T.bg,
                border:i===pipelineStep?"none":i<pipelineStep?`1px solid ${T.gold}44`:`1px solid ${T.border}`,
                color:i===pipelineStep?"#080810":i<pipelineStep?T.gold:T.textFaint,
                fontFamily:T.font
              }}>{s.icon} {s.label}</div>
              {i<PIPELINE_STEPS.length-1&&<div style={{width:12,height:1,background:T.border,flexShrink:0}}/>}
            </div>
          ))}
        </div>

        {/* STEP 0: STORY */}
        {pipelineStep===0&&(
          <div style={css.card}>
            <div style={css.cardTitle}>📖 Step 1: Apni Story Likhein</div>
            <label style={css.label}>VIDEO TITLE</label>
            <input style={css.input} placeholder="Apni video ka naam..." value={pipelineTitle} onChange={e=>setPipelineTitle(e.target.value)}/>
            <label style={css.label}>GENRE</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:14}}>
              {["Drama","Action","Romance","Comedy","Thriller","Documentary","Educational","Religious"].map(g=>(
                <Pill key={g} label={g} active={pipelineGenre===g} onClick={()=>setPipelineGenre(g)}/>
              ))}
            </div>
            <label style={css.label}>STORY / SCRIPT</label>
            <textarea style={{...css.textarea,minHeight:150}} placeholder="Apni poori kahani likhein..." value={pipelineStory} onChange={e=>setPipelineStory(e.target.value)}/>
            <div style={{display:"flex",justifyContent:"flex-end",marginTop:8}}>
              <button style={css.btnGold} disabled={!pipelineTitle.trim()||!pipelineStory.trim()} onClick={()=>{
                callAI(
                  `Convert this story into a professional video script in Hinglish with scene breakdowns:\n\nTitle: ${pipelineTitle}\nGenre: ${pipelineGenre}\nStory: ${pipelineStory}\n\nProvide a clean script with 5 scenes, voice-over text, and camera directions. Keep it under 200 words.`,
                  txt=>{setPipelineScript(txt);setPipelineStep(1);}
                );
              }}>{aiLoading?"Script Likh Raha Hai...":"Script Generate → Next"}</button>
            </div>
          </div>
        )}

        {/* STEP 1: SCRIPT */}
        {pipelineStep===1&&(
          <div style={css.card}>
            <div style={css.cardTitle}>📝 Step 2: Script Ready</div>
            <div style={{background:T.bg,borderRadius:10,padding:14,border:`1px solid ${T.border2}`,fontSize:12,color:T.text,lineHeight:1.8,maxHeight:250,overflowY:"auto",whiteSpace:"pre-wrap",marginBottom:14}}>
              {pipelineScript||"Script yahan dikhegi..."}
            </div>
            <div style={{display:"flex",gap:10,justifyContent:"space-between",flexWrap:"wrap"}}>
              <button style={css.btnOutline} onClick={()=>setPipelineStep(0)}>← Back</button>
              <button style={css.btnGold} onClick={()=>setPipelineStep(2)}>Character Chunein →</button>
            </div>
          </div>
        )}

        {/* STEP 2: CHARACTER */}
        {pipelineStep===2&&(
          <div style={css.card}>
            <div style={css.cardTitle}>🎭 Step 3: Character / Avatar</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(100px,1fr))",gap:8,marginBottom:14}}>
              {AVATAR_TYPES.map(a=>(
                <div key={a.id} onClick={()=>setPipelineAvatar(a.id)} style={{
                  padding:"10px 6px",borderRadius:9,textAlign:"center",cursor:"pointer",
                  border:`1px solid ${pipelineAvatar===a.id?T.gold:T.border}`,
                  background:pipelineAvatar===a.id?`${T.gold}11`:T.bg
                }}>
                  <div style={{fontSize:24}}>{a.emoji}</div>
                  <div style={{fontSize:10,color:pipelineAvatar===a.id?T.gold:T.text,marginTop:3}}>{a.label}</div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:10,justifyContent:"space-between",flexWrap:"wrap"}}>
              <button style={css.btnOutline} onClick={()=>setPipelineStep(1)}>← Back</button>
              <button style={css.btnGold} disabled={!pipelineAvatar} onClick={()=>setPipelineStep(3)}>Voice Studio →</button>
            </div>
          </div>
        )}

        {/* STEP 3: VOICE */}
        {pipelineStep===3&&(
          <div style={css.card}>
            <div style={css.cardTitle}>🎙️ Step 4: Voice Chunein</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
              <div>
                <label style={css.label}>GENDER</label>
                <div style={{display:"flex",gap:8}}>
                  {["male","female"].map(g=>(
                    <Pill key={g} label={g==="male"?"👨 Male":"👩 Female"} active={pipelineVoice===g} onClick={()=>setPipelineVoice(g)}/>
                  ))}
                </div>
              </div>
              <div>
                <label style={css.label}>LANGUAGE</label>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                  {VOICE_LANGS.slice(0,4).map(l=>(
                    <Pill key={l.code} label={l.flag} active={voiceLang===l.code} onClick={()=>setVoiceLang(l.code)}/>
                  ))}
                </div>
              </div>
            </div>
            <div style={{display:"flex",gap:10,justifyContent:"space-between",flexWrap:"wrap"}}>
              <button style={css.btnOutline} onClick={()=>setPipelineStep(2)}>← Back</button>
              <button style={css.btnGold} onClick={()=>setPipelineStep(4)}>Music Chunein →</button>
            </div>
          </div>
        )}

        {/* STEP 4: MUSIC */}
        {pipelineStep===4&&(
          <div style={css.card}>
            <div style={css.cardTitle}>🎵 Step 5: Background Music</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:8,marginBottom:14}}>
              {MUSIC_CATS.slice(0,6).map(c=>(
                <div key={c.id} onClick={()=>setPipelineMusic(c.id)} style={{
                  padding:"12px 8px",borderRadius:9,textAlign:"center",cursor:"pointer",
                  border:`1px solid ${pipelineMusic===c.id?c.color:T.border}`,
                  background:pipelineMusic===c.id?`${c.color}11`:T.bg
                }}>
                  <div style={{fontSize:22}}>{c.icon}</div>
                  <div style={{fontSize:10,color:pipelineMusic===c.id?c.color:T.text,marginTop:4}}>{c.label}</div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:10,justifyContent:"space-between",flexWrap:"wrap"}}>
              <button style={css.btnOutline} onClick={()=>setPipelineStep(3)}>← Back</button>
              <button style={css.btnGold} disabled={!pipelineMusic} onClick={()=>setPipelineStep(5)}>Quality & Format →</button>
            </div>
          </div>
        )}

        {/* STEP 5: VIDEO QUALITY */}
        {pipelineStep===5&&(
          <div style={css.card}>
            <div style={css.cardTitle}>🎬 Step 6: Quality & Format</div>
            <label style={css.label}>QUALITY</label>
            <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10,marginBottom:14}}>
              {qualityOpts.map(q=>(
                <div key={q.label} onClick={()=>setPipelineQuality(q.label)} style={{
                  padding:"14px",borderRadius:9,cursor:"pointer",textAlign:"center",
                  border:`1px solid ${pipelineQuality===q.label?q.c:T.border}`,
                  background:pipelineQuality===q.label?`${q.c}11`:T.bg
                }}>
                  <div style={{fontSize:16,fontWeight:700,color:pipelineQuality===q.label?q.c:T.text}}>{q.label}</div>
                </div>
              ))}
            </div>
            <label style={css.label}>FORMAT</label>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
              {["MP4","MOV","AVI","WEBM","GIF"].map(f=>(
                <Pill key={f} label={f} active={pipelineFormat===f} onClick={()=>setPipelineFormat(f)} color="#ff6b35"/>
              ))}
            </div>
            <div style={{display:"flex",gap:10,justifyContent:"space-between",flexWrap:"wrap"}}>
              <button style={css.btnOutline} onClick={()=>setPipelineStep(4)}>← Back</button>
              <button style={css.btnGold} onClick={()=>setPipelineStep(6)}>Preview →</button>
            </div>
          </div>
        )}

        {/* STEP 6: DOWNLOAD */}
        {pipelineStep===6&&(
          <div style={css.card}>
            <div style={css.cardTitle}>⬇️ Step 7: Generate & Download</div>
            {!pipelineFinished?(
              <>
                <div style={{background:T.bg,borderRadius:10,padding:14,border:`1px solid ${T.border2}`,marginBottom:16}}>
                  <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
                    {[
                      {l:"Title",v:pipelineTitle||"—"},
                      {l:"Genre",v:pipelineGenre},
                      {l:"Avatar",v:AVATAR_TYPES.find(a=>a.id===pipelineAvatar)?.label||"—"},
                      {l:"Voice",v:pipelineVoice},
                      {l:"Quality",v:pipelineQuality},
                      {l:"Format",v:pipelineFormat},
                    ].map(r=>(
                      <div key={r.l} style={{textAlign:"center",minWidth:70}}>
                        <div style={{fontSize:11,color:T.textDim}}>{r.l}</div>
                        <div style={{fontSize:13,color:T.gold,fontWeight:700}}>{r.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <button style={{...css.btnGold,width:"100%",padding:16,fontSize:16}} onClick={()=>{
                  setModal({title:"🎬 Final Video Render",steps:["Story compilation","Script processing","Avatar animation","Voice synthesis","Music overlay","Subtitle generation","Color grading","Final export"]});
                  runProgress([],()=>setPipelineFinished(true));
                }}>
                  🚀 FINAL VIDEO GENERATE KAREIN
                </button>
              </>
            ):(
              <div style={{textAlign:"center",padding:"20px 0"}}>
                <div style={{fontSize:48,marginBottom:12}}>🎬</div>
                <div style={{fontSize:20,color:T.gold,fontWeight:700,fontFamily:T.font,marginBottom:4}}>{pipelineTitle}</div>
                <div style={{fontSize:13,color:T.textDim,marginBottom:20}}>{pipelineQuality} • {pipelineFormat} • {pipelineGenre}</div>
                <button style={{...css.btnGold,padding:"14px 32px",fontSize:15,marginBottom:16}}>
                  ⬇️ {pipelineFormat} Download Karein
                </button>
                <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",marginBottom:20}}>
                  {[["📱 WhatsApp","#25D366"],["📷 Instagram","#E1306C"],["▶️ YouTube","#FF0000"],["💼 LinkedIn","#0A66C2"]].map(([l,c])=>(
                    <button key={l} style={{padding:"7px 14px",borderRadius:16,border:"none",background:c,color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer"}}>{l}</button>
                  ))}
                </div>
                <button style={css.btnOutline} onClick={()=>{
                  setPipelineStep(0);setPipelineFinished(false);
                  setPipelineStory("");setPipelineScript("");setPipelineTitle("");
                  setPipelineAvatar(null);setPipelineMusic(null);
                }}>🔄 Naya Video Banayein</button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // ── NAV ────────────────────────────────────────────────────────────────────
  const navItems=[
    {id:"dashboard",icon:"🏠",label:"Home"},
    {id:"pipeline",icon:"🎬",label:"Studio"},
    {id:"avatar",icon:"🤖",label:"Avatar"},
    {id:"t2i",icon:"🖼️",label:"Images"},
    {id:"voice",icon:"🎙️",label:"Voice"},
    {id:"music",icon:"🎵",label:"Music"},
    {id:"adcreator",icon:"📣",label:"Ads"},
    {id:"templates",icon:"🗂️",label:"Templates"},
    {id:"story2film",icon:"✨",label:"Story"},
  ];

  const pageComponents={
    dashboard:<Dashboard/>,
    pipeline:<PipelinePage/>,
    avatar:<AvatarPage/>,
    t2i:<T2IPage/>,
    voice:<VoicePage/>,
    music:<MusicPage/>,
    adcreator:<AdPage/>,
    templates:<TemplatesPage/>,
    story2film:<StoryPage/>,
    txt2vid:<PipelinePage/>,
    img2vid:<T2IPage/>,
    story2film2:<StoryPage/>,
  };

  const pageTitle={
    dashboard:"Dashboard",pipeline:"Full Pipeline Studio",avatar:"AI Avatar Generator",
    t2i:"Text to Image",voice:"AI Voice Studio",music:"Music Library",
    adcreator:"AI Ad Generator",templates:"Template Marketplace",story2film:"AI Story Expansion",
    txt2vid:"Text to Video",img2vid:"Image to Video",
  };

  return(
    <div style={{
      minHeight:"100vh",
      background:`radial-gradient(ellipse at 20% 20%,#0d0e22 0%,${T.bg} 60%)`,
      color:T.text,fontFamily:T.fontBody,
      paddingBottom:80
    }}>
      {/* top bar */}
      <div style={{
        position:"sticky",top:0,zIndex:100,
        background:"#070810ee",backdropFilter:"blur(12px)",
        borderBottom:`1px solid ${T.border}`,
        padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"
      }}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {page!=="dashboard"&&(
            <button onClick={()=>setPage("dashboard")} style={{
              background:"transparent",border:`1px solid ${T.border}`,borderRadius:7,
              padding:"5px 10px",color:T.textDim,fontSize:11,cursor:"pointer"
            }}>← Home</button>
          )}
          <div style={{fontSize:13,fontWeight:700,color:T.gold,fontFamily:T.font,letterSpacing:"0.05em"}}>
            {page==="dashboard"?"✦ NEW STAR FILMS":pageTitle[page]||page}
          </div>
        </div>
        <div style={{fontSize:10,color:T.textFaint,letterSpacing:"0.1em"}}>AI STUDIO</div>
      </div>

      {/* content */}
      <div style={{maxWidth:860,margin:"0 auto",padding:"20px 14px"}}>
        {pageComponents[page]||<Dashboard/>}
      </div>

      {/* bottom nav */}
      <div style={{
        position:"fixed",bottom:0,left:0,right:0,
        background:"#070810f0",backdropFilter:"blur(16px)",
        borderTop:`1px solid ${T.border}`,
        display:"flex",overflowX:"auto",padding:"8px 4px",zIndex:100
      }}>
        {navItems.map(n=>(
          <button key={n.id} onClick={()=>setPage(n.id)} style={{
            flex:"0 0 auto",display:"flex",flexDirection:"column",alignItems:"center",
            gap:3,padding:"6px 12px",background:"transparent",border:"none",
            cursor:"pointer",borderRadius:9,transition:"background 0.15s",
            background:page===n.id?`${T.gold}14`:"transparent"
          }}>
            <span style={{fontSize:18}}>{n.icon}</span>
            <span style={{fontSize:9,color:page===n.id?T.gold:T.textFaint,fontWeight:page===n.id?700:400,letterSpacing:"0.04em"}}>
              {n.label}
            </span>
          </button>
        ))}
      </div>

      {/* progress modal */}
      {modal&&(
        <ProgressModal
          title={modal.title}
          steps={modal.steps}
          progress={progress}
          done={done}
          onClose={()=>{setModal(null);setProgress(0);setDone(false);}}
        />
      )}
    </div>
  );
}
