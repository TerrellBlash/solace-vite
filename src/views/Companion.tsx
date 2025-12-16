
import React, { useEffect, useState, useRef } from 'react';
import { ViewState } from '../types';
import { BackButton, Icon, Toggle, BreathingLoader } from '../components/UI';
import { generateCompanionResponse, transcribeAudio, generateSpeech } from '../services/gemini';

interface CompanionProps {
  setView: (view: ViewState) => void;
}

interface Message {
    role: 'user' | 'model';
    text: string;
}

export const Companion: React.FC<CompanionProps> = ({ setView }) => {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', text: "Hello Michelle. How is your heart feeling today?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [deepReflection, setDeepReflection] = useState(false);
    
    // Audio State
    const [isRecording, setIsRecording] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [playingId, setPlayingId] = useState<number | null>(null);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSend = async () => {
        if (!input.trim()) return;
        
        const userMsg: Message = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const streamResult = await generateCompanionResponse(messages, input, deepReflection);
            
            let fullText = "";
            let isFirstChunk = true;

            for await (const chunk of streamResult) {
                // Correctly use the .text property accessor, do not call it as a method
                const chunkText = chunk.text || "";
                fullText += chunkText;
                
                setMessages(prev => {
                    const newArr = [...prev];
                    if (isFirstChunk) {
                         // Remove loader state implicitly by adding first model message
                         setIsLoading(false);
                         return [...newArr, { role: 'model', text: fullText }];
                    } else {
                        newArr[newArr.length - 1].text = fullText;
                        return newArr;
                    }
                });
                isFirstChunk = false;
            }
        } catch (error) {
            console.error("Failed to generate response", error);
            setIsLoading(false);
            setMessages(prev => [...prev, { role: 'model', text: "I'm having a little trouble connecting right now. Please try again in a moment." }]);
        }
    };

    const toggleRecording = async () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const mimeType = mediaRecorder.mimeType || 'audio/webm';
                const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
                
                const reader = new FileReader();
                reader.readAsDataURL(audioBlob);
                reader.onloadend = async () => {
                    const base64Audio = reader.result as string;
                    setIsTranscribing(true);
                    try {
                        const text = await transcribeAudio(base64Audio);
                        if (text) {
                            console.log("Transcription result:", text);
                            setInput(text);
                        } else {
                            console.warn("Transcription returned empty or null");
                            alert("Couldn't transcribe audio. Please try typing instead.");
                        }
                    } catch (error) {
                        console.error("Transcription failed", error);
                        alert("Couldn't transcribe audio. Please try typing instead.");
                    } finally {
                        setIsTranscribing(false);
                    }
                };
                
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (e) {
            console.error("Mic error", e);
            alert("Could not access microphone. Please allow permissions.");
        }
    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
        setIsRecording(false);
    };

    const playMessage = async (text: string, idx: number) => {
        if (playingId === idx) {
            setPlayingId(null); 
            return; 
        }

        setPlayingId(idx);
        const audioData = await generateSpeech(text);
        if (audioData) {
            const audio = new Audio(audioData);
            audio.onended = () => setPlayingId(null);
            audio.play();
        } else {
            setPlayingId(null);
        }
    };

    return (
        <div className={`h-full flex flex-col relative transition-colors duration-700 ${deepReflection ? 'bg-[#F9F5FF] dark:bg-[#1A1523]' : 'bg-bg dark:bg-obsidian'}`}>
            {/* Header */}
            <div className="pt-12 px-6 pb-4 flex items-center justify-between bg-white/50 dark:bg-obsidian/50 backdrop-blur-md border-b border-white/50 dark:border-white/5 z-20">
                <div className="flex items-center gap-3">
                    <BackButton onClick={() => setView(ViewState.HOME)} />
                    <div>
                        <h2 className="font-serif text-xl text-text dark:text-bg">Solace</h2>
                        <div className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${deepReflection ? 'bg-purple-400' : 'bg-sage'}`}></span>
                            <span className={`text-[10px] uppercase font-bold tracking-wider ${deepReflection ? 'text-purple-400' : 'text-sage'}`}>
                                {deepReflection ? 'Deep Reflection' : 'Compassionate AI'}
                            </span>
                        </div>
                    </div>
                </div>
                
                {/* Deep Reflection Toggle */}
                <div className="flex items-center gap-2" title="Enable Thinking Mode for deeper, complex support">
                     <span className="text-[10px] font-bold text-muted uppercase tracking-wider hidden sm:block">Deep Mode</span>
                     <Toggle 
                        active={deepReflection} 
                        onToggle={() => setDeepReflection(!deepReflection)} 
                        color="bg-purple-500"
                     />
                </div>
            </div>
            
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 scroll-smooth">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-enter`}>
                        <div className={`max-w-[85%] p-5 text-[15px] leading-relaxed shadow-sm relative group transition-all duration-300
                            ${msg.role === 'user' 
                                ? 'bg-[#2D2A26] dark:bg-amber text-[#F4F2ED] rounded-[24px] rounded-tr-sm' 
                                : 'bg-white dark:bg-charcoal border border-white dark:border-white/5 text-text dark:text-bg rounded-[24px] rounded-tl-sm shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
                            }`}
                        >
                            {msg.text}
                            
                            {/* TTS Button for Model Messages */}
                            {msg.role === 'model' && (
                                <button 
                                    onClick={() => playMessage(msg.text, idx)}
                                    className={`absolute -right-10 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-opacity ${playingId === idx ? 'opacity-100 text-amber' : 'opacity-0 group-hover:opacity-100 text-muted/50 hover:text-text dark:hover:text-white'}`}
                                >
                                    <Icon name={playingId === idx ? 'volume-2' : 'volume-1'} size={16} className={playingId === idx ? 'animate-pulse' : ''} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                
                {/* Thinking / Loading State */}
                {isLoading && (
                     <div className="flex justify-start animate-enter">
                        <div className="bg-white dark:bg-charcoal p-5 rounded-[24px] rounded-tl-sm border border-white dark:border-white/5 shadow-sm flex flex-col gap-2 items-start">
                             <BreathingLoader />
                            {deepReflection && (
                                <span className="text-[10px] text-purple-400 font-bold tracking-wide animate-pulse mt-1">Thinking deeply...</span>
                            )}
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            
            {/* Input Area */}
            <div className={`p-4 backdrop-blur-xl border-t mb-[80px] transition-colors ${deepReflection ? 'bg-purple-50/50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-900/20' : 'bg-white/80 dark:bg-charcoal/80 border-white dark:border-white/5'}`}>
                <div className="flex items-center gap-2 bg-[#F4F2ED] dark:bg-obsidian p-1.5 rounded-[32px] border border-sand/50 dark:border-white/5 shadow-inner relative transition-shadow focus-within:ring-2 focus-within:ring-amber/20">
                    
                    {/* Recording Visualizer (Simple Overlay) */}
                    {isRecording && (
                        <div className="absolute inset-0 bg-red-500/10 rounded-[32px] flex items-center justify-center animate-pulse z-10">
                            <span className="text-xs font-bold text-red-500 tracking-wider">Listening...</span>
                        </div>
                    )}
                    
                    {/* Mic Button */}
                    <button 
                        onClick={toggleRecording}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all z-20 ${isRecording ? 'bg-red-500 text-white shadow-glow scale-110' : 'text-muted hover:bg-black/5 dark:hover:bg-white/10'}`}
                    >
                         {isTranscribing ? <Icon name="loader" size={18} className="animate-spin" /> : <Icon name={isRecording ? "mic-off" : "mic"} size={20} />}
                    </button>

                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={isTranscribing ? "Transcribing..." : (deepReflection ? "Ask something complex..." : "Share your thoughts...")} 
                        disabled={isRecording || isTranscribing}
                        className="flex-1 bg-transparent border-none outline-none px-2 py-3 text-text dark:text-bg placeholder:text-muted/50 text-sm font-medium z-20" 
                    />
                    
                    <button 
                        onClick={handleSend}
                        disabled={!input.trim()}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 z-20 active:scale-95 ${input.trim() ? (deepReflection ? 'bg-purple-500 text-white shadow-glow' : 'bg-amber text-white shadow-glow') : 'bg-sand/50 dark:bg-white/10 text-muted/50'}`}
                    >
                        <Icon name="arrow-up" size={20} strokeWidth={2.5} />
                    </button>
                </div>
            </div>
        </div>
    );
};
