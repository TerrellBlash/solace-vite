
import React, { useState } from 'react';
import { ViewState } from '../types';
import { BackButton, Icon, Avatar, Button } from '../components/UI';
import { motion, AnimatePresence } from 'framer-motion';

interface CirclesProps {
  setView: (view: ViewState) => void;
}

export const CirclesList: React.FC<CirclesProps> = ({ setView }) => {
    const [selectedCircleId, setSelectedCircleId] = useState<number | null>(null);
    const [joinedCircles, setJoinedCircles] = useState<number[]>([]);

    const circles = [
        { 
            id: 1, 
            title: "Loss of Partner", 
            members: 24, 
            active: true, 
            desc: "A safe space for those navigating life after losing a spouse or partner.", 
            icon: "flower-2",
            iconBg: "bg-[#F5E6E0]",
            iconColor: "text-clay",
            feed: [
                { user: "Sarah J.", time: "2h ago", text: "Today would have been our 15th anniversary. I lit a candle and listened to his favorite jazz album. It hurts, but it feels peaceful." },
                { user: "Mark D.", time: "5h ago", text: "Found an old grocery list in a jacket pocket. It's the little things that catch you off guard." }
            ]
        },
        { 
            id: 2, 
            title: "Loss of Pet", 
            members: 18, 
            active: true, 
            desc: "Connect with others who understand the deep bond with our animal companions.", 
            icon: "dog",
            iconBg: "bg-[#E6E8E6]",
            iconColor: "text-muted",
             feed: [
                { user: "Jenny P.", time: "1d ago", text: "Walking the usual route without Buster feels so empty. Does it get easier?" }
            ]
        },
        { 
            id: 3, 
            title: "Loss of Family", 
            members: 42, 
            active: true, 
            desc: "Supporting one another through the loss of parents, siblings, and children.", 
            icon: "home",
            iconBg: "bg-[#E0E7F1]",
            iconColor: "text-[#6A7A85]",
            feed: [
                { user: "Elena R.", time: "30m ago", text: "Missing Mom's sunday calls." },
                { user: "David K.", time: "4h ago", text: "My brother was the only one who understood my jokes. I miss laughing with him." }
            ]
        },
        { 
            id: 4, 
            title: "Loss of Friend", 
            members: 29, 
            active: true, 
            desc: "Honoring the chosen family who walked beside us through life's chapters.", 
            icon: "star",
            iconBg: "bg-[#FDF3E6]",
            iconColor: "text-amber",
            feed: [
                { user: "Alex T.", time: "6h ago", text: "Visited our favorite coffee spot today. Ordered two coffees out of habit." }
            ]
        },
    ];

    const selectedCircle = circles.find(c => c.id === selectedCircleId);
    const isJoined = selectedCircle ? joinedCircles.includes(selectedCircle.id) : false;

    const toggleJoin = (id: number) => {
        setJoinedCircles(prev => {
            if (prev.includes(id)) {
                return prev.filter(c => c !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    // --- LIST VIEW ---
    if (!selectedCircle) {
        return (
            <div className="h-full flex flex-col bg-bg dark:bg-obsidian pt-12 transition-colors">
                <div className="px-6 mb-8">
                    <BackButton onClick={() => setView(ViewState.HOME)} />
                    <h1 className="font-serif text-[36px] text-text dark:text-bg mt-6 mb-1 leading-tight">Community Circles</h1>
                    <p className="text-[11px] font-bold text-clay tracking-[0.15em] uppercase">Find your space to heal together</p>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar px-6 space-y-4 pb-32">
                    {circles.map((circle, idx) => {
                        const isCircleJoined = joinedCircles.includes(circle.id);
                        return (
                            <div 
                                key={circle.id} 
                                onClick={() => setSelectedCircleId(circle.id)}
                                className="bg-white dark:bg-charcoal rounded-[32px] p-6 shadow-soft animate-enter border border-transparent dark:border-white/5 transition-colors cursor-pointer active:scale-[0.98]" 
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                <div className="flex gap-4 mb-4">
                                    <div className={`w-14 h-14 rounded-[20px] ${circle.iconBg} dark:bg-obsidian flex items-center justify-center ${circle.iconColor} shrink-0`}>
                                        <Icon name={circle.icon} size={24} />
                                    </div>
                                    <div className="py-1">
                                        <h3 className="font-serif text-[22px] text-text dark:text-bg leading-tight mb-2">{circle.title}</h3>
                                        <div className="flex items-center gap-3">
                                            {circle.active ? (
                                                <div className="px-2.5 py-1 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 flex items-center gap-1.5">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                                    <span className="text-[9px] font-bold text-green-700 dark:text-green-400 uppercase tracking-wide">Active Now</span>
                                                </div>
                                            ) : (
                                                <div className="px-2.5 py-1 rounded-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                                                    <span className="text-[9px] font-bold text-gray-400 dark:text-muted uppercase tracking-wide">Closed</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1 text-muted text-xs font-medium">
                                                <Icon name="users" size={12} />
                                                <span>{circle.members + (isCircleJoined ? 1 : 0)} members</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <p className="text-text/70 dark:text-bg/70 text-[15px] leading-relaxed mb-6">
                                    {circle.desc}
                                </p>

                                <div className="flex items-center justify-between pointer-events-none">
                                    <div className="flex -space-x-2 pl-2">
                                        {[1,2,3].map(i => (
                                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-charcoal bg-gray-200 -ml-2 overflow-hidden">
                                                <img src={`https://i.pravatar.cc/100?img=${i + circle.id * 10}`} className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pointer-events-auto">
                                        {isCircleJoined ? (
                                             <span className="px-6 py-2.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/30 rounded-[14px] text-sm font-semibold inline-block">
                                                Joined ✓
                                             </span>
                                        ) : (
                                            circle.active ? (
                                                <span className="px-6 py-2.5 bg-text dark:bg-bg text-white dark:text-charcoal rounded-[14px] text-sm font-semibold hover:bg-black dark:hover:bg-white/90 transition-colors inline-block">
                                                    Visit
                                                </span>
                                            ) : (
                                                <span className="px-6 py-2.5 bg-white dark:bg-white/5 border border-sand dark:border-white/10 text-text dark:text-bg rounded-[14px] text-sm font-semibold hover:bg-gray-50 dark:hover:bg-white/10 transition-colors inline-block">
                                                    Details
                                                </span>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // --- DETAIL VIEW ---
    return (
        <div className="h-full flex flex-col bg-bg dark:bg-obsidian relative transition-colors">
             {/* Header Image / Pattern */}
             <div className={`absolute top-0 left-0 right-0 h-64 ${selectedCircle.iconBg} dark:bg-charcoal/50 z-0 mask-gradient-b`}></div>
             
             <div className="relative z-10 flex flex-col h-full">
                {/* Navbar */}
                <div className="pt-12 px-6 flex items-center justify-between">
                    <BackButton onClick={() => setSelectedCircleId(null)} />
                    <button className="w-10 h-10 rounded-full bg-white/50 dark:bg-white/10 backdrop-blur-md flex items-center justify-center">
                        <Icon name="more-horizontal" size={20} className="text-text dark:text-bg" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar pt-4 pb-32">
                    {/* Circle Info */}
                    <div className="px-6 mb-8 text-center flex flex-col items-center animate-enter">
                         <div className={`w-20 h-20 rounded-[32px] ${selectedCircle.iconBg} dark:bg-obsidian border-4 border-white dark:border-charcoal shadow-xl flex items-center justify-center ${selectedCircle.iconColor} mb-4`}>
                                <Icon name={selectedCircle.icon} size={40} strokeWidth={1.5} />
                        </div>
                        <h1 className="font-serif text-[32px] text-text dark:text-bg leading-tight mb-2">{selectedCircle.title}</h1>
                        <p className="text-text/70 dark:text-bg/70 leading-relaxed text-sm max-w-xs">{selectedCircle.desc}</p>
                        
                        <div className="flex gap-3 mt-6">
                            {selectedCircle.active ? (
                                <button 
                                    onClick={() => toggleJoin(selectedCircle.id)}
                                    className={`px-8 py-3 rounded-full font-medium shadow-lg transition-all active:scale-95 flex items-center gap-2 ${
                                        isJoined 
                                        ? 'bg-green-600 text-white hover:bg-green-700' 
                                        : 'bg-clay text-white hover:brightness-110'
                                    }`}
                                >
                                    {isJoined ? (
                                        <>
                                            <Icon name="check" size={18} />
                                            <span>Joined</span>
                                        </>
                                    ) : (
                                        "Join Circle"
                                    )}
                                </button>
                            ) : (
                                <button disabled className="px-8 py-3 bg-stone-200 dark:bg-white/10 text-muted rounded-full font-medium cursor-not-allowed">
                                    Circle Closed
                                </button>
                            )}
                            <button className="w-12 h-12 rounded-full border border-sand dark:border-white/10 flex items-center justify-center text-text dark:text-bg hover:bg-white dark:hover:bg-white/5 transition-colors">
                                <Icon name="share" size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Feed Section */}
                    <div className="bg-white dark:bg-charcoal rounded-t-[40px] min-h-[500px] shadow-soft border-t border-white/50 dark:border-white/5 p-6 animate-enter delay-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-serif text-xl text-text dark:text-bg">Recent Shares</h3>
                            <span className="text-xs font-bold text-muted uppercase tracking-wider">Latest</span>
                        </div>

                        <div className="space-y-4">
                            {selectedCircle.feed?.map((post, i) => (
                                <div key={i} className="p-4 rounded-[24px] bg-bg dark:bg-obsidian border border-sand dark:border-white/5">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Avatar initial={post.user[0]} />
                                        <div>
                                            <p className="text-sm font-bold text-text dark:text-bg">{post.user}</p>
                                            <p className="text-[10px] text-muted">{post.time}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-text/80 dark:text-bg/80 leading-relaxed font-serif">"{post.text}"</p>
                                    <div className="flex gap-4 mt-3">
                                        <button className="flex items-center gap-1.5 text-xs text-muted hover:text-clay transition-colors">
                                            <Icon name="heart" size={12} />
                                            <span>Care</span>
                                        </button>
                                        <button className="flex items-center gap-1.5 text-xs text-muted hover:text-text transition-colors">
                                            <Icon name="message-circle" size={12} />
                                            <span>Reply</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {selectedCircle.active && (
                            <div className="mt-6 p-4 rounded-[24px] border-2 border-dashed border-sand dark:border-white/10 flex flex-col items-center justify-center text-center gap-2 text-muted hover:bg-bg dark:hover:bg-obsidian/50 transition-colors cursor-pointer">
                                <Icon name="pen-tool" size={20} />
                                <p className="text-sm font-medium">Share your story...</p>
                            </div>
                        )}
                    </div>
                </div>
             </div>
        </div>
    );
};
