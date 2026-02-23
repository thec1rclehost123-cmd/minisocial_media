import React, { useState } from 'react';
import { Send, Image as ImageIcon, Smile, MapPin, Video, X } from 'lucide-react';

const PostInput = ({ onAddPost }) => {
    const [content, setContent] = useState('');
    const [media, setMedia] = useState(null);
    const [mediaType, setMediaType] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleMediaChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            setMedia(file);
            setMediaType(type);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
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
                };
                reader.readAsDataURL(media);
            } else {
                onAddPost(content, null, null);
                setContent('');
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto mb-24 animate-reveal">
            <form onSubmit={handleSubmit} className="glass-card-premium rounded-[3rem] p-10 border-white/10 shadow-2xl relative overflow-hidden group/form">
                {/* Gradient Accent */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>

                <div className="flex gap-8">
                    <div className="hidden sm:flex w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-indigo-500/10 to-purple-500/10 items-center justify-center border border-white/10 shrink-0 group-focus-within/form:scale-110 transition-transform duration-500 shadow-inner">
                        <Smile size={32} className="text-indigo-400 group-focus-within/form:rotate-12 transition-transform" />
                    </div>
                    <div className="flex-1 flex flex-col gap-6">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Share your creative spark..."
                            className="bg-transparent border-none focus:ring-0 text-slate-100 placeholder:text-slate-600 resize-none py-2 text-2xl w-full h-32 custom-scrollbar font-medium"
                        />

                        {previewUrl && (
                            <div className="relative mt-4 rounded-3xl overflow-hidden border border-white/10 group bg-black/60 shadow-inner animate-reveal">
                                {mediaType === 'image' ? (
                                    <img src={previewUrl} alt="Preview" className="max-h-96 w-full object-contain mx-auto" />
                                ) : (
                                    <video src={previewUrl} className="max-h-96 w-full mx-auto" controls />
                                )}
                                <button
                                    type="button"
                                    onClick={clearMedia}
                                    className="absolute top-6 right-6 p-3 bg-slate-950/80 text-white rounded-2xl opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:scale-110 shadow-2xl"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        )}

                        <div className="flex items-center justify-between border-t border-white/5 pt-8 mt-2">
                            <div className="flex gap-2">
                                <label className="p-4 text-slate-500 hover:text-indigo-400 hover:bg-white/5 rounded-2xl transition-all cursor-pointer group/icon">
                                    <ImageIcon size={24} className="group-hover/icon:scale-110 transition-transform" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleMediaChange(e, 'image')}
                                    />
                                </label>
                                <label className="p-4 text-slate-500 hover:text-indigo-400 hover:bg-white/5 rounded-2xl transition-all cursor-pointer group/icon">
                                    <Video size={24} className="group-hover/icon:scale-110 transition-transform" />
                                    <input
                                        type="file"
                                        accept="video/*"
                                        className="hidden"
                                        onChange={(e) => handleMediaChange(e, 'video')}
                                    />
                                </label>
                                <button type="button" className="p-4 text-slate-500 hover:text-indigo-400 hover:bg-white/5 rounded-2xl transition-all group/icon">
                                    <MapPin size={24} className="group-hover/icon:scale-110 transition-transform" />
                                </button>
                            </div>
                            <button
                                type="submit"
                                disabled={!content.trim() && !media}
                                className="btn-premium px-10 py-4 bg-indigo-600/20 text-indigo-400 hover:text-white"
                            >
                                <span className="flex items-center gap-3">
                                    Share Spark <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default PostInput;
