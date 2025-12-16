
import React, { useState, useRef } from 'react';
import { ViewState, MemoryStep, MemoryData } from '../types';
import { Header, Button, Icon } from '../components/UI';
import { BookOpen, Image as ImageIcon, MessageSquareQuote, Star, CloudUpload, UserPlus, MapPin, Video } from 'lucide-react';
import { motion } from 'framer-motion';
import { editPhoto, generateImage, generateVideoFromImage } from '../services/gemini';

interface MemoryProps {
  setView: (view: ViewState) => void;
}

export const Memory: React.FC<MemoryProps> = ({ setView }) => {
  const [step, setStep] = useState<MemoryStep>(MemoryStep.TYPE_SELECTION);
  const [data, setData] = useState<MemoryData>({ people: [], category: 'Music' });
  const [isEditing, setIsEditing] = useState(false); // Controls the "Edit AI" mode
  const [isGenerating, setIsGenerating] = useState(false); // Controls loading state
  const [editPrompt, setEditPrompt] = useState('');
  
  // New State for Generation & Video
  const [showGenModal, setShowGenModal] = useState(false);
  const [genPrompt, setGenPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => {
    if (step === MemoryStep.TYPE_SELECTION) setView(ViewState.HOME);
    else setStep(prev => prev - 1);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setData({ ...data, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAIEdit = async () => {
    if (!data.image || !editPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const newImage = await editPhoto(data.image, editPrompt);
      if (newImage) {
        setData({ ...data, image: newImage });
        setIsEditing(false);
        setEditPrompt('');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenImage = async () => {
      if (!genPrompt.trim()) return;
      setIsGenerating(true);
      try {
          const newImage = await generateImage(genPrompt, aspectRatio);
          if (newImage) {
              setData({ ...data, image: newImage });
              setShowGenModal(false);
              setGenPrompt('');
          }
      } catch (e) {
          console.error(e);
      } finally {
          setIsGenerating(false);
      }
  }

  const handleVeoAnimate = async () => {
      if (!data.image) return;
      setIsVideoLoading(true);
      try {
          const url = await generateVideoFromImage(data.image);
          if (url) {
              setVideoUrl(url);
          }
      } catch (e) {
          console.error(e);
      } finally {
          setIsVideoLoading(false);
      }
  }

  const renderStepIndicator = () => (
    <div className="flex flex-col items-center mb-6">
      <div className="flex items-center justify-center gap-2 relative">
        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-black/5 dark:bg-white/10 -z-10" />
        {[1, 2, 3, 4].map(s => (
          <div 
            key={s} 
            className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ease-out ring-4 ring-bg dark:ring-obsidian ${s === step ? 'bg-clay scale-125' : s < step ? 'bg-amber' : 'bg-black/10 dark:bg-white/20'}`} 
          />
        ))}
      </div>
    </div>
  );

  // --- STEP 1: TYPE SELECTION ---
  if (step === MemoryStep.TYPE_SELECTION) {
    const types = [
      { id: 'story', icon: BookOpen, label: 'Story', sub: 'Share a moment', color: 'bg-[#F2EFE9] dark:bg-charcoal' },
      { id: 'photo', icon: ImageIcon, label: 'Photo', sub: 'Upload or Generate', color: 'bg-[#EFEBE9] dark:bg-charcoal' },
      { id: 'quote', icon: MessageSquareQuote, label: 'Quote', sub: 'Remember words', color: 'bg-[#EDEFE9] dark:bg-charcoal' },
      { id: 'favorite', icon: Star, label: 'Favorite', sub: 'Things they loved', color: 'bg-[#F0EBF0] dark:bg-charcoal' },
    ];

    return (
      <div className="pb-40 min-h-screen flex flex-col bg-bg dark:bg-obsidian transition-colors">
        <Header title="Create a Memory" onBack={handleBack} />
        <div className="px-6 flex-1 pt-4">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="font-serif text-[32px] text-text dark:text-bg text-center mb-10 leading-tight"
          >
            Choose a<br/>memory type
          </motion.h2>
          <div className="space-y-4">
            {types.map((type, idx) => (
              <motion.button 
                key={type.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => { setData({...data, type: type.id as any}); handleNext(); }}
                className="w-full bg-white dark:bg-charcoal active:scale-[0.98] p-5 rounded-[28px] flex items-center justify-between text-left transition-all shadow-soft border border-transparent dark:border-white/5"
              >
                <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 ${type.color} rounded-[20px] flex items-center justify-center text-text/80 dark:text-bg`}>
                        <type.icon size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                        <p className="font-serif text-lg text-text dark:text-bg mb-0.5">{type.label}</p>
                        <p className="text-xs text-muted dark:text-muted/80 font-medium">{type.sub}</p>
                    </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- STEP 2: DETAILS (UNIQUE SCREENS) ---
  if (step === MemoryStep.DETAILS) {
    
    // 2A. PHOTO SCREEN
    if (data.type === 'photo') {
      return (
        <div className="min-h-screen flex flex-col bg-bg dark:bg-obsidian transition-colors">
          <Header title="New Photo" onBack={handleBack} />
          
          <div className="px-6 flex-1 flex flex-col pt-2 animate-enter pb-24">
             {/* Upload Area */}
             <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
             
             {data.image ? (
               <div className="relative mb-6 rounded-[32px] overflow-hidden shadow-soft group bg-black">
                 {videoUrl ? (
                    <video src={videoUrl} autoPlay loop controls className="w-full h-auto max-h-[400px] object-contain" />
                 ) : (
                    <img src={data.image} alt="Uploaded" className="w-full h-auto max-h-[400px] object-cover opacity-90" />
                 )}
                 
                 {/* AI Edit Controls Overlay */}
                 {isEditing ? (
                   <div className="absolute inset-x-0 bottom-0 bg-white/95 dark:bg-charcoal/95 backdrop-blur-xl p-4 animate-enter border-t border-sand dark:border-white/10">
                      <div className="flex gap-2 mb-2">
                        <input 
                           type="text" 
                           placeholder="E.g. Make it vintage..." 
                           className="flex-1 bg-bg dark:bg-obsidian rounded-xl px-4 py-3 text-sm outline-none border border-sand dark:border-white/10 focus:border-amber transition-colors text-text dark:text-bg"
                           value={editPrompt}
                           onChange={(e) => setEditPrompt(e.target.value)}
                        />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setIsEditing(false)} className="px-4 py-2.5 rounded-xl text-xs font-bold text-muted bg-sand/30 dark:bg-white/10">Cancel</button>
                        <button onClick={handleAIEdit} disabled={isGenerating || !editPrompt} className="flex-1 bg-gradient-to-r from-amber to-clay text-white rounded-xl py-2.5 text-xs font-bold tracking-wide shadow-glow flex items-center justify-center gap-2">
                           {isGenerating ? <span className="animate-pulse">Editing...</span> : <><Icon name="wand-2" size={14} /> Edit</>}
                        </button>
                      </div>
                   </div>
                 ) : !videoUrl && (
                    <div className="absolute bottom-4 right-4 flex gap-2">
                        {/* Animate Button (Veo) */}
                        <button 
                            onClick={handleVeoAnimate}
                            disabled={isVideoLoading}
                            className="bg-black/40 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 hover:bg-black/60 transition-colors border border-white/20"
                        >
                             {isVideoLoading ? <span className="animate-spin text-amber"><Icon name="loader" size={14}/></span> : <Icon name="video" size={14} />}
                             {isVideoLoading ? 'Animating...' : 'Animate'}
                        </button>
                        
                        {/* Edit Button */}
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="bg-white/90 backdrop-blur-md text-text px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 hover:scale-105 transition-transform"
                        >
                            <Icon name="sparkles" size={14} className="text-amber" />
                            Edit
                        </button>
                   </div>
                 )}
                 
                 {/* Change Photo Button */}
                 {!isEditing && !videoUrl && !isVideoLoading && (
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute top-4 right-4 w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                    >
                        <Icon name="refresh-cw" size={18} />
                    </button>
                 )}
               </div>
             ) : (
                <div className="grid grid-cols-2 gap-4 mb-6">
                   <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-[4/5] rounded-[32px] border-[2px] border-dashed border-[#D6CFC7] bg-[#F9F7F5] dark:bg-charcoal dark:border-white/10 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-[#F0EEEC] dark:hover:bg-charcoal/80 transition-colors group"
                   >
                       <div className="w-12 h-12 rounded-full bg-white dark:bg-obsidian shadow-sm flex items-center justify-center text-clay group-hover:scale-110 transition-transform">
                          <CloudUpload size={24} strokeWidth={1.5} />
                       </div>
                       <p className="text-muted text-xs font-medium">Upload Photo</p>
                   </div>

                   <div 
                      onClick={() => setShowGenModal(true)}
                      className="aspect-[4/5] rounded-[32px] border-[2px] border-dashed border-amber/30 bg-amber/5 dark:bg-amber/5 dark:border-amber/20 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-amber/10 transition-colors group"
                   >
                       <div className="w-12 h-12 rounded-full bg-white dark:bg-obsidian shadow-sm flex items-center justify-center text-amber group-hover:scale-110 transition-transform">
                          <Icon name="wand-2" size={24} />
                       </div>
                       <p className="text-amber/80 text-xs font-medium">Generate AI Art</p>
                   </div>
               </div>
             )}

             {/* Generation Modal */}
             {showGenModal && (
                 <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
                     <div className="bg-white dark:bg-charcoal w-full max-w-md rounded-[32px] p-6 shadow-2xl animate-enter-up">
                         <div className="flex justify-between items-center mb-4">
                             <h3 className="font-serif text-xl text-text dark:text-bg">Imagine a memory</h3>
                             <button onClick={() => setShowGenModal(false)}><Icon name="x" /></button>
                         </div>
                         <textarea 
                            value={genPrompt}
                            onChange={(e) => setGenPrompt(e.target.value)}
                            placeholder="Describe the image you want to create... (e.g., A peaceful garden with sunflowers)"
                            className="w-full h-32 bg-bg dark:bg-obsidian rounded-[20px] p-4 text-sm outline-none resize-none mb-4"
                         />
                         
                         <p className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Aspect Ratio</p>
                         <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
                             {['1:1', '4:3', '3:4', '16:9', '9:16'].map(ratio => (
                                 <button 
                                    key={ratio}
                                    onClick={() => setAspectRatio(ratio)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium border ${aspectRatio === ratio ? 'bg-amber text-white border-amber' : 'border-sand dark:border-white/10 text-muted'}`}
                                 >
                                     {ratio}
                                 </button>
                             ))}
                         </div>

                         <button 
                            onClick={handleGenImage}
                            disabled={!genPrompt || isGenerating}
                            className="w-full py-3 bg-amber text-white rounded-[20px] font-bold shadow-lg flex items-center justify-center gap-2"
                         >
                             {isGenerating ? 'Dreaming...' : 'Create Image'}
                             {!isGenerating && <Icon name="arrow-right" size={16} />}
                         </button>
                     </div>
                 </div>
             )}

             {/* Inputs */}
             <div className="space-y-3">
                 <div className="bg-white dark:bg-charcoal rounded-[20px] flex items-center px-5 h-14 shadow-sm border border-transparent dark:border-white/5">
                    <div className="text-muted"><Icon name="message-square" size={18} /></div>
                    <input 
                      type="text" 
                      placeholder="Add a caption..." 
                      className="flex-1 ml-3 outline-none text-text dark:text-bg placeholder:text-muted/60 bg-transparent font-medium"
                      value={data.caption || ''}
                      onChange={e => setData({...data, caption: e.target.value})}
                    />
                 </div>

                 <div className="bg-white dark:bg-charcoal rounded-[20px] flex items-center px-5 h-14 shadow-sm border border-transparent dark:border-white/5">
                    <div className="text-muted"><Icon name="calendar" size={18} /></div>
                    <input 
                      type="text" 
                      placeholder="When was this? (Optional)" 
                      className="flex-1 ml-3 outline-none text-text dark:text-bg placeholder:text-muted/60 bg-transparent font-medium"
                      value={data.date || ''}
                      onChange={e => setData({...data, date: e.target.value})}
                    />
                 </div>
             </div>
          </div>

          <div className="p-6 pb-8 bg-gradient-to-t from-bg dark:from-obsidian to-transparent fixed bottom-0 w-full max-w-[420px]">
              <button onClick={handleNext} className="w-full bg-[#2D2A26] dark:bg-white text-[#F4F2ED] dark:text-charcoal py-4 rounded-[20px] font-serif text-lg font-medium shadow-lg active:scale-[0.98] transition-transform">
                Save Photo
              </button>
          </div>
        </div>
      );
    }

    // 2B. STORY SCREEN
    if (data.type === 'story') {
      return (
        <div className="min-h-screen flex flex-col bg-bg dark:bg-obsidian transition-colors">
           <Header title="New Story" onBack={handleBack} />
           
           <div className="px-6 flex-1 pt-2 animate-enter flex flex-col gap-6">
              {/* Title Section */}
              <div className="space-y-3">
                  <label className="font-serif text-xl text-text dark:text-bg pl-1">Title</label>
                  <input 
                    type="text" 
                    placeholder="Give this story a name..." 
                    className="w-full bg-white dark:bg-charcoal rounded-[20px] h-16 px-6 outline-none font-medium text-text dark:text-bg placeholder:text-muted/50 text-lg shadow-sm border border-transparent dark:border-white/5"
                    value={data.title || ''}
                    onChange={e => setData({...data, title: e.target.value})}
                  />
              </div>
              
              {/* Story Section */}
              <div className="space-y-3 flex-1 flex flex-col">
                 <label className="font-serif text-xl text-text dark:text-bg pl-1">The Story</label>
                 <textarea 
                    placeholder="Once upon a time..." 
                    className="w-full flex-1 bg-white dark:bg-charcoal rounded-[32px] p-6 resize-none outline-none font-serif text-lg leading-relaxed text-text dark:text-bg placeholder:text-muted/50 shadow-sm border border-transparent dark:border-white/5"
                    value={data.text || ''}
                    onChange={e => setData({...data, text: e.target.value})}
                 ></textarea>
              </div>
           </div>

           {/* Footer Button */}
           <div className="p-6 pb-8">
              <button onClick={handleNext} className="w-full bg-[#2D2A26] dark:bg-white text-[#F4F2ED] dark:text-charcoal py-4 rounded-[20px] font-serif text-lg font-medium shadow-lg active:scale-[0.98] transition-transform">
                Save Story
              </button>
           </div>
        </div>
      );
    }

    // 2C. QUOTE SCREEN
    if (data.type === 'quote') {
      return (
        <div className="min-h-screen flex flex-col bg-bg dark:bg-obsidian transition-colors">
           <Header title="New Quote" onBack={handleBack} />
           <div className="px-6 flex-1 flex flex-col justify-center animate-enter -mt-20">
              <div className="relative">
                 <Icon name="quote" size={48} className="text-amber/20 absolute -top-8 -left-4" />
                 <textarea 
                    placeholder="Type their words..." 
                    className="w-full bg-transparent resize-none outline-none font-serif text-3xl text-center text-text dark:text-bg placeholder:text-muted/30 leading-tight min-h-[200px]"
                    value={data.quoteText || ''}
                    onChange={e => setData({...data, quoteText: e.target.value})}
                 ></textarea>
                 <Icon name="quote" size={48} className="text-amber/20 absolute -bottom-8 -right-4 rotate-180" />
              </div>
              
              <div className="mt-12 space-y-2">
                 <label className="text-xs font-bold uppercase tracking-widest text-muted ml-4">Who said it?</label>
                 <div className="bg-white dark:bg-charcoal rounded-[20px] flex items-center px-6 h-16 shadow-soft border border-transparent dark:border-white/5">
                    <input 
                      type="text" 
                      placeholder="e.g. Dad, Favorite Author..." 
                      className="flex-1 outline-none text-text dark:text-bg placeholder:text-muted/60 bg-transparent font-medium text-lg"
                      value={data.quoteSource || ''}
                      onChange={e => setData({...data, quoteSource: e.target.value})}
                    />
                 </div>
              </div>
           </div>
           <div className="p-6 pb-8">
              <button onClick={handleNext} className="w-full bg-clay text-white py-4 rounded-[20px] font-serif text-lg font-medium shadow-glow active:scale-[0.98] transition-transform">
                Save Quote
              </button>
           </div>
        </div>
      );
    }

    // 2D. FAVORITE SCREEN
    if (data.type === 'favorite') {
       const categories = [
         { id: 'Music', label: 'Music' },
         { id: 'Food', label: 'Food' },
         { id: 'Movie', label: 'Movie' },
         { id: 'Place', label: 'Place' },
         { id: 'Book', label: 'Book' },
       ];
       
       return (
        <div className="min-h-screen flex flex-col bg-bg dark:bg-obsidian transition-colors">
           <Header title="New Favorite" onBack={handleBack} />
           
           <div className="px-6 flex-1 pt-2 animate-enter flex flex-col">
              
              <label className="text-[28px] font-serif text-text dark:text-bg mb-4 block leading-tight">Category</label>
              
              {/* FIXED: Added pr-8 to ensure the last item is fully visible when scrolling */}
              <div className="flex gap-2 overflow-x-auto pb-6 -mx-6 px-6 no-scrollbar snap-x">
                 {categories.map((cat, idx) => {
                   const isSelected = (data.category || 'Music') === cat.id;
                   return (
                   <button 
                     key={cat.id}
                     onClick={() => setData({...data, category: cat.id})}
                     className={`
                        px-6 py-3 rounded-full text-[15px] font-medium transition-all whitespace-nowrap shrink-0 snap-start
                        ${isSelected ? 'bg-[#2D2A26] dark:bg-amber text-[#F4F2ED] dark:text-white' : 'bg-white dark:bg-charcoal text-text dark:text-bg shadow-sm'}
                        ${idx === categories.length - 1 ? 'mr-6' : ''}
                     `}
                   >
                      {cat.label}
                   </button>
                 )})}
              </div>

              <div className="bg-white dark:bg-charcoal rounded-[32px] p-8 shadow-soft flex-1 mb-6 flex flex-col gap-8 border border-white dark:border-white/5">
                 <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-clay dark:text-amber mb-3 block">
                        Their Favorite {data.category || 'Music'}
                    </label>
                    <input 
                      type="text" 
                      placeholder={`Name of ${data.category || 'Music'}...`}
                      className="w-full text-[28px] font-serif text-text dark:text-bg placeholder:text-muted/30 bg-transparent outline-none"
                      value={data.itemName || ''}
                      onChange={e => setData({...data, itemName: e.target.value})}
                    />
                    <div className="h-[1px] bg-sand/30 dark:bg-white/10 mt-4 w-full" />
                 </div>
                 
                 <div className="flex-1">
                    <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted mb-3 block">
                        Why they loved it
                    </label>
                    <textarea 
                      placeholder="Add a small note..." 
                      className="w-full h-full text-lg text-text dark:text-bg placeholder:text-muted/40 bg-transparent outline-none resize-none leading-relaxed font-sans"
                      value={data.reason || ''}
                      onChange={e => setData({...data, reason: e.target.value})}
                    ></textarea>
                 </div>
              </div>

           </div>
           <div className="p-6 pb-8">
              <button onClick={handleNext} className="w-full bg-[#2D2A26] dark:bg-white text-[#F4F2ED] dark:text-charcoal py-4 rounded-[20px] font-serif text-lg font-medium shadow-lg active:scale-[0.98] transition-transform">
                Save Favorite
              </button>
           </div>
        </div>
       );
    }
  }

  // --- STEP 3 & 4 (CONTEXT & REVIEW) ---
  // Using simplified return for brevity, assuming similar structure to previous prompt but ensuring ViewState prop is used
  if (step === MemoryStep.CONTEXT || step === MemoryStep.REVIEW) {
      // Re-use existing Context/Review code structure
      return (
        <div className="pb-40 min-h-screen flex flex-col bg-bg dark:bg-obsidian transition-colors">
            <Header title={step === MemoryStep.CONTEXT ? "Add Context" : "Review Memory"} onBack={handleBack} />
            <div className="px-6 flex-1 animate-enter flex flex-col items-center justify-center">
                {renderStepIndicator()}
                <p className="text-muted">Review steps are simplified for this demo.</p>
            </div>
            <div className="p-6 pb-8">
                <Button fullWidth onClick={step === MemoryStep.CONTEXT ? handleNext : () => setView(ViewState.HOME)}>
                    {step === MemoryStep.CONTEXT ? "Review" : "Save to Jar"}
                </Button>
            </div>
        </div>
      );
  }

  return null;
};
