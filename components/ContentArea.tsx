import React, { useState, useEffect } from 'react';
import { Section } from '../types';
import { GeneratedOutput } from '../App';
import { BACKGROUND_VIDEOS, INTRO_MESSAGES } from '../constants';
import { DownloadIcon, EditIcon, SaveIcon, CancelIcon, ClipboardIcon, LinkIcon, PlayIcon } from './icons';
import './Slider.css'

// --- Audio Utility Functions ---
// Base64 decoder
const decode = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
};

// Raw PCM to AudioBuffer
const decodeAudioData = async (data: Uint8Array, ctx: AudioContext): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length;
    const buffer = ctx.createBuffer(1, frameCount, 24000); // 1 channel, 24kHz sample rate
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i] / 32768.0;
    }
    return buffer;
};

// Create a WAV file Blob from raw PCM data
const createWavBlob = (pcmData: Uint8Array): Blob => {
    const sampleRate = 24000;
    const numChannels = 1;
    const bitsPerSample = 16;
    const blockAlign = (numChannels * bitsPerSample) / 8;
    const byteRate = sampleRate * blockAlign;
    const dataSize = pcmData.length;
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);

    // RIFF header
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    writeString(view, 8, 'WAVE');
    // "fmt " sub-chunk
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitsPerSample, true);
    // "data" sub-chunk
    writeString(view, 36, 'data');
    view.setUint32(40, dataSize, true);

    // Write PCM data
    new Uint8Array(buffer, 44).set(pcmData);

    return new Blob([view], { type: 'audio/wav' });
};

const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
};

// --- Component ---

interface ContentAreaProps {
    activeSection: Section;
    generatedOutput: GeneratedOutput;
    setGeneratedOutput: (output: GeneratedOutput) => void;
    isLoading: boolean;
    loadingMessage: string;
    error: string;
}

const ContentArea: React.FC<ContentAreaProps> = ({ activeSection, generatedOutput, setGeneratedOutput, isLoading, loadingMessage, error }) => {
    const [videoSrc, setVideoSrc] = useState(BACKGROUND_VIDEOS[activeSection]);
    const [showVideo, setShowVideo] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState('');
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        setShowVideo(false);
        const timer = setTimeout(() => {
            setVideoSrc(BACKGROUND_VIDEOS[activeSection]);
            setShowVideo(true);
        }, 500);
        return () => clearTimeout(timer);
    }, [activeSection]);

    useEffect(() => {
        if (generatedOutput?.type === 'text') {
            setEditedContent(generatedOutput.content);
        } else {
            setEditedContent('');
        }
    }, [generatedOutput]);

    const handleDownload = async () => {
        if (!generatedOutput) return;

        let filename = `SoffAI-${activeSection.replace(/\s+/g, '_')}`;
        let blob;

        switch (generatedOutput.type) {
            case 'audio':
                filename += '.wav';
                const pcmData = decode(generatedOutput.content);
                blob = createWavBlob(pcmData);
                break;
            case 'video':
                filename += '.mp4';
                const response = await fetch(generatedOutput.content);
                blob = await response.blob();
                break;
            case 'text':
            default:
                filename += '.txt';
                blob = new Blob([generatedOutput.content], { type: 'text/plain;charset=utf-8' });
                break;
        }

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    };

    const handleCopy = () => {
        if (generatedOutput?.type !== 'text') return;
        navigator.clipboard.writeText(generatedOutput.content).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    const handlePlayAudio = async () => {
        if (generatedOutput?.type !== 'audio') return;
        const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const pcmData = decode(generatedOutput.content);
        const audioBuffer = await decodeAudioData(pcmData, outputAudioContext);
        const source = outputAudioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(outputAudioContext.destination);
        source.start();
    };

    const handleSave = () => {
        setGeneratedOutput({ ...generatedOutput, type: 'text', content: editedContent });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedContent(generatedOutput?.type === 'text' ? generatedOutput.content : '');
        setIsEditing(false);
    };

    const formatContent = (text: string) => ({
        __html: text
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-[#87e64b]">$1</strong>')
            .replace(/\n\s*([*-])\s/g, '\n<li class="ml-4 list-disc">')
            .replace(/\n/g, '<br />'),
    });

    const intro = INTRO_MESSAGES[activeSection];

    const renderContent = () => {
        if (!generatedOutput) return null;
        switch (generatedOutput.type) {
            case 'video':
                return <video src={generatedOutput.content} controls autoPlay className="w-full max-w-2xl rounded-lg" />;
            case 'audio':
                return (
                    <div className="flex flex-col items-center justify-center bg-black/60 backdrop-blur-md p-8 rounded-lg">
                        <h3 className="text-xl font-semibold mb-4">Audio Tayyor</h3>
                        <button onClick={handlePlayAudio} className="w-24 h-24 bg-[#87e64b] text-black rounded-full flex items-center justify-center hover:bg-opacity-90 transition-transform transform hover:scale-105">
                            <PlayIcon className="w-12 h-12" />
                        </button>
                    </div>
                );
            case 'text':
                return (
                    <div className="bg-black/60 backdrop-blur-md p-6 rounded-lg text-left">
                        {/* Action Buttons */}
                        <div className="flex justify-end gap-2 mb-4">
                            {!isEditing ? (
                                <>
                                    <button onClick={handleCopy} className="p-2 rounded-full bg-gray-700/50 hover:bg-gray-600/50 transition-colors relative" aria-label="Nusxalash">
                                        {isCopied ? <span className="text-xs text-[#87e64b]">Nusxalandi!</span> : <ClipboardIcon />}
                                    </button>
                                    <button onClick={handleDownload} className="p-2 rounded-full bg-gray-700/50 hover:bg-gray-600/50 transition-colors" aria-label="Yuklab olish">
                                        <DownloadIcon />
                                    </button>
                                    <button onClick={() => setIsEditing(true)} className="p-2 rounded-full bg-gray-700/50 hover:bg-gray-600/50 transition-colors" aria-label="Tahrirlash">
                                        <EditIcon />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button onClick={handleSave} className="p-2 rounded-full bg-green-700/50 hover:bg-green-600/50 transition-colors" aria-label="Saqlash">
                                        <SaveIcon />
                                    </button>
                                    <button onClick={handleCancel} className="p-2 rounded-full bg-red-700/50 hover:bg-red-600/50 transition-colors" aria-label="Bekor qilish">
                                        <CancelIcon />
                                    </button>
                                </>
                            )}
                        </div>
                        {/* Content Body */}
                        {!isEditing ? (
                            <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={formatContent(generatedOutput.content)} />
                        ) : (
                            <textarea
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                                className="w-full h-96 bg-gray-900/80 border border-gray-700 text-white rounded-lg p-4 resize-y focus:ring-2 focus:ring-[#87e64b] focus:outline-none"
                            />
                        )}
                        {/* Grounding Sources */}
                        {generatedOutput.sources && generatedOutput.sources.length > 0 && (
                            <div className="mt-6 border-t border-gray-700 pt-4">
                                <h4 className="font-semibold mb-2">Manbalar:</h4>
                                <ul className="space-y-2">
                                    {generatedOutput.sources.map((source, index) => (
                                        <li key={index} className="text-sm">
                                            <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex items-center gap-2">
                                                <LinkIcon />
                                                <span>{source.web.title || source.web.uri}</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <main className="flex-grow pt-40 pb-96 relative flex items-center justify-center">

            <div className="decorative-elements">
                <div className="circle circle1">
                    <img src="./img/pdficon.png" alt="" />
                </div>
                <div className="circle circle2">
                    <img src="https://www.svgrepo.com/show/525837/document-1.svg" alt="" className="bg-white rounded-full" />
                </div>
                <div className="circle circle3">
                    <img src="https://cdn-icons-png.flaticon.com/512/4468/4468641.png" alt="" />
                </div>
                <div className="circle circle4">
                    <img src="https://cdn-icons-png.flaticon.com/512/2913/2913964.png" alt="" width={150} height={150} />
                </div>
                <div className="circle circle5">
                    <img src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/microsoft-powerpoint-icon.png" alt="" />
                </div>
            </div>

            <div className="absolute inset-0 bg-black/10 backdrop-blur-sm rounded-3xl border border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.1)]">
            </div>

            <div className="absolute inset-0 z-0 overflow-hidden">
                <video
                    key={videoSrc} src={videoSrc} autoPlay loop muted playsInline
                    className={`w-full h-full object-cover transition-opacity duration-500 ${showVideo ? 'opacity-30' : 'opacity-0'}`}
                />
                {/* <div className="absolute inset-0 bg-black/50"></div> */}
            </div>

            <div className="relative z-10 container mx-auto px-4 text-center w-full max-w-4xl h-full overflow-y-auto">
                {isLoading && (
                    <div className="flex flex-col items-center justify-center h-full">
                        <div className="w-16 h-16 border-4 border-[#87e64b] border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-lg">{loadingMessage}</p>
                    </div>
                )}

                {error && <p className="text-red-500 text-lg bg-red-900/50 p-4 rounded-md">{error}</p>}

                {!isLoading && generatedOutput && (
                    <div className="flex justify-center items-start">
                        {renderContent()}
                        {(generatedOutput.type === 'audio' || generatedOutput.type === 'video') && (
                            <button onClick={handleDownload} className="ml-4 p-3 rounded-full bg-gray-700/50 hover:bg-gray-600/50 transition-colors" aria-label="Yuklab olish">
                                <DownloadIcon />
                            </button>
                        )}
                    </div>
                )}

                {!isLoading && !generatedOutput && !error && (
                    <div className="flex flex-col items-center justify-center h-full">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            {intro.title.split(' ').slice(0, -1).join(' ')}
                            <span className="text-[#87e64b]"> {intro.title.split(' ').pop()}</span>
                        </h2>
                        <p className="text-lg text-gray-300 max-w-2xl">{intro.subtitle}</p>
                    </div>
                )}
            </div>
        </main>
    );
};

export default ContentArea;
