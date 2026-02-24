import React, { useState } from 'react';
import { Send, Image as ImageIcon, Video, X, Smile, MapPin } from 'lucide-react';

const PostInput = ({ onAddPost, username }) => {
    const [content, setContent] = useState('');
    const [media, setMedia] = useState(null);
    const [mediaType, setMediaType] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleMediaChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            setMedia(file);
            setMediaType(type);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setIsExpanded(true);
        }
    };

    const clearMedia = () => {
        setMedia(null);
        setMediaType(null);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (content.trim() || media) {
            if (media) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    onAddPost(content, reader.result, mediaType);
                    setContent('');
                    clearMedia();
                    setIsExpanded(false);
                };
                reader.readAsDataURL(media);
            } else {
                onAddPost(content, null, null);
                setContent('');
                setIsExpanded(false);
            }
        }
    };

    return (
        <div className="max-w-2xl mx-auto mb-4 animate-reveal border-x border-t border-white/5 bg-white/[0.01]">
            <div className="p-6 flex gap-4">
                {/* User Avatar */}
                <div className="shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/10">
                        <span className="text-sm font-black text-white">{username?.charAt(0).toUpperCase() || "A"}</span>
                    </div>
                </div>

                {/* Input Area */}
                <div className="flex-1 flex flex-col pt-2">
                    <form onSubmit={handleSubmit}>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            onFocus={() => setIsExpanded(true)}
                            placeholder="What's your creative spark today?"
                            className="w-full bg-transparent border-none focus:ring-0 text-slate-100 placeholder:text-slate-600 resize-none py-1 text-xl h-auto min-h-[48px] overflow-hidden font-medium"
                            rows={isExpanded ? 3 : 1}
                        />

                        {previewUrl && (
                            <div className="relative mt-4 rounded-2xl overflow-hidden border border-white/10 group bg-black/40 shadow-inner max-h-96 flex items-center justify-center">
                                {mediaType === 'image' ? (
                                    <img src={previewUrl} alt="Preview" className="w-full h-auto object-contain max-h-96" />
                                ) : (
                                    <video src={previewUrl} className="max-h-96 w-full" controls />
                                )}
                                <button
                                    type="button"
                                    onClick={clearMedia}
                                    className="absolute top-4 right-4 p-2 bg-slate-950/80 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 shadow-2xl"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        )}

                        <div className={`flex items-center justify-between border-t border-white/5 mt-4 pt-4 transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                            <div className="flex gap-1">
                                <label className="p-2 text-indigo-400 hover:bg-indigo-400/10 rounded-full transition-all cursor-pointer">
                                    <ImageIcon size={20} />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleMediaChange(e, 'image')}
                                    />
                                </label>
                                <label className="p-2 text-indigo-400 hover:bg-indigo-400/10 rounded-full transition-all cursor-pointer">
                                    <Video size={20} />
                                    <input
                                        type="file"
                                        accept="video/*"
                                        className="hidden"
                                        onChange={(e) => handleMediaChange(e, 'video')}
                                    />
                                </label>
                                <button type="button" className="p-2 text-indigo-400 hover:bg-indigo-400/10 rounded-full transition-all">
                                    <Smile size={20} />
                                </button>
                                <button type="button" className="p-2 text-indigo-400 hover:bg-indigo-400/10 rounded-full transition-all">
                                    <MapPin size={20} />
                                </button>
                            </div>
                            <button
                                type="submit"
                                disabled={!content.trim() && !media}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-full text-sm font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all disabled:opacity-50 disabled:shadow-none"
                            >
                                Post Spark
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PostInput;
