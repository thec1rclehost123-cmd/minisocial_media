import React, { useState } from 'react';
import { Send, Image as ImageIcon, Smile, MapPin } from 'lucide-react';

const CreatePost = ({ onAddPost }) => {
    const [content, setContent] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (content.trim()) {
            onAddPost(content);
            setContent('');
        }
    };

    return (
        <div className="max-w-xl mx-auto mb-12">
            <form onSubmit={handleSubmit} className="glass rounded-[2rem] p-4 border-white/5 shadow-xl">
                <div className="flex gap-4">
                    <div className="hidden sm:flex w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 items-center justify-center border border-white/10">
                        <Smile size={24} className="text-indigo-400" />
                    </div>
                    <div className="flex-1 flex flex-col gap-3">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="What's your inspiration?"
                            className="bg-transparent border-none focus:ring-0 text-slate-100 placeholder:text-slate-500 resize-none py-3 text-lg w-full h-24"
                        />
                        <div className="flex items-center justify-between border-t border-white/5 pt-3">
                            <div className="flex gap-2">
                                <button type="button" className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-white/5 rounded-xl transition-all">
                                    <ImageIcon size={20} />
                                </button>
                                <button type="button" className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-white/5 rounded-xl transition-all">
                                    <MapPin size={20} />
                                </button>
                            </div>
                            <button
                                type="submit"
                                disabled={!content.trim()}
                                className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:bg-slate-700 text-white font-semibold px-6 py-2 rounded-2xl flex items-center gap-2 transition-all transform active:scale-95 shadow-lg shadow-indigo-500/25"
                            >
                                Share <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreatePost;
