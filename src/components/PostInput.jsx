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
            // In a real app, you'd upload the file and get a URL. 
            // For this local demo, we'll store the data URL so it persists in localStorage
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
                        {previewUrl && (
                            <div className="relative mt-2 rounded-xl overflow-hidden border border-white/10 group bg-black/20">
                                {mediaType === 'image' ? (
                                    <img src={previewUrl} alt="Preview" className="max-h-64 w-auto object-contain mx-auto" />
                                ) : (
                                    <video src={previewUrl} className="max-h-64 w-auto mx-auto" controls />
                                )}
                                <button
                                    type="button"
                                    onClick={clearMedia}
                                    className="absolute top-2 right-2 p-1.5 bg-slate-900/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-500"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        )}
                        <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-2">
                            <div className="flex gap-2">
                                <label className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-white/5 rounded-xl transition-all cursor-pointer">
                                    <ImageIcon size={20} />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleMediaChange(e, 'image')}
                                    />
                                </label>
                                <label className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-white/5 rounded-xl transition-all cursor-pointer">
                                    <Video size={20} />
                                    <input
                                        type="file"
                                        accept="video/*"
                                        className="hidden"
                                        onChange={(e) => handleMediaChange(e, 'video')}
                                    />
                                </label>
                                <button type="button" className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-white/5 rounded-xl transition-all">
                                    <MapPin size={20} />
                                </button>
                            </div>
                            <button
                                type="submit"
                                disabled={!content.trim() && !media}
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

export default PostInput;
