import React, { useState, useEffect, useRef } from 'react';
import { Section, UploadedFile, FilterOptions } from '../types';
import { PLACEHOLDERS } from '../constants';
import { SparklesIcon, UpIcon, MicrophoneIcon, PaperclipIcon, CancelIcon } from './icons';
import SectionFilters from './SectionFilters';

interface PromptInputProps {
    prompt: string;
    setPrompt: React.Dispatch<React.SetStateAction<string>>;
    onGenerate: () => void;
    isLoading: boolean;
    activeSection: Section;
    uploadedFiles: UploadedFile[];
    setUploadedFiles: (files: UploadedFile[]) => void;
    filterOptions: FilterOptions;
    setFilterOptions: (options: FilterOptions) => void;
}

const TypingEffect: React.FC<{ placeholders: string[] }> = ({ placeholders }) => {
    const [text, setText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const delay = 2000;
    const timeoutRef = useRef<number | null>(null);

    useEffect(() => {
        const handleTyping = () => {
            const i = loopNum % placeholders.length;
            const fullText = placeholders[i];

            if (isDeleting) {
                setText(fullText.substring(0, text.length - 1));
            } else {
                setText(fullText.substring(0, text.length + 1));
            }

            if (!isDeleting && text === fullText) {
                timeoutRef.current = window.setTimeout(() => setIsDeleting(true), delay);
            } else if (isDeleting && text === '') {
                setIsDeleting(false);
                setLoopNum(loopNum + 1);
            }
        };

        const speed = isDeleting ? deletingSpeed : typingSpeed;
        timeoutRef.current = window.setTimeout(handleTyping, speed);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [text, isDeleting, loopNum, placeholders, delay]);
    
    return <span className="text-gray-500">{text}</span>;
};

const PromptInput: React.FC<PromptInputProps> = ({ 
    prompt, setPrompt, onGenerate, isLoading, activeSection, 
    uploadedFiles, setUploadedFiles, filterOptions, setFilterOptions 
}) => {
    const placeholders = PLACEHOLDERS[activeSection];
    const [isRecording, setIsRecording] = useState(false);
    const recognitionRef = useRef<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.lang = 'uz-UZ';
            recognitionRef.current.interimResults = false;

            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setPrompt(prev => prev ? `${prev} ${transcript}` : transcript);
                setIsRecording(false);
            };
            recognitionRef.current.onerror = (event: any) => {
                console.error("Speech recognition error", event.error);
                setIsRecording(false);
            };
            recognitionRef.current.onend = () => {
                setIsRecording(false);
            };
        }
    }, [setPrompt]);

    const handleMicClick = () => {
        if (!recognitionRef.current) {
            alert("Kechirasiz, brauzeringiz ovozli kiritishni qo'llab-quvvatlamaydi.");
            return;
        }
        if (isRecording) {
            recognitionRef.current.stop();
        } else {
            setPrompt('');
            recognitionRef.current.start();
            setIsRecording(true);
        }
    };

    const handleFileClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        const newFiles: UploadedFile[] = [...uploadedFiles];
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

        Array.from(files).forEach(file => {
            if (allowedTypes.includes(file.type)) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    newFiles.push({
                        name: file.name,
                        type: file.type,
                        data: e.target?.result as string,
                    });
                    setUploadedFiles(newFiles);
                };
                reader.readAsDataURL(file);
            }
        });
        event.target.value = '';
    };

    const removeFile = (index: number) => {
        const newFiles = [...uploadedFiles];
        newFiles.splice(index, 1);
        setUploadedFiles(newFiles);
    };
    
    return (
        <div className="fixed bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
            <div className="container mx-auto max-w-4xl">
                 {uploadedFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                        {uploadedFiles.map((file, index) => (
                            <div key={index} className="bg-gray-700/80 rounded-full px-3 py-1 text-sm flex items-center gap-2">
                                <span>{file.name}</span>
                                <button onClick={() => removeFile(index)} className="text-gray-400 hover:text-white">
                                    <CancelIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                 <SectionFilters 
                    activeSection={activeSection}
                    options={filterOptions}
                    setOptions={setFilterOptions}
                />
                <div className="relative mt-2">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                onGenerate();
                            }
                        }}
                        className="w-full bg-white/5 border border-white/10 text-white rounded-xl p-5 pl-18 pr-14 resize-none focus:ring-2 focus:ring-[#87e64b] focus:outline-none backdrop-blur-lg transition-all duration-300 text-2xl h-[150px]"
                        placeholder=""
                    />
                    {!prompt && !isRecording && uploadedFiles.length === 0 && (
                        <div className="absolute top-5 pointer-events-none text-2xl" style={{ left: '22px' }}>
                            <TypingEffect placeholders={placeholders} />
                        </div>
                    )}
                    {/* <div className="absolute left-4 top-5 flex items-center gap-2">
                        <button onClick={handleMicClick} className={`p-2 rounded-full transition-colors ${isRecording ? 'bg-red-500/50 text-white' : 'hover:bg-gray-700/50'}`}>
                            {isRecording ? <div className="w-8 h-8 rounded-full bg-red-500 animate-pulse"></div> : <MicrophoneIcon className="w-8 h-8" />}
                        </button>
                        {activeSection !== Section.TTS && (
                             <button onClick={handleFileClick} className="p-2 rounded-full hover:bg-gray-700/50 transition-colors">
                                <PaperclipIcon className="w-8 h-8" />
                            </button>
                        )}
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" multiple hidden />
                    </div> */}
                    <button
                        onClick={onGenerate}
                        disabled={isLoading || (!prompt && uploadedFiles.length === 0)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-[#87e64b] rounded-full flex items-center justify-center text-black hover:bg-opacity-90 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                        aria-label="Generate Content"
                    >
                        {isLoading ? (
                             <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                           <UpIcon/>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PromptInput;