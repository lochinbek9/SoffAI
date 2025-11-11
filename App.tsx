import React, { useState, useCallback, useEffect } from 'react';
import { Section, UploadedFile, FilterOptions } from './types';
import Navbar from './components/Navbar';
import PromptInput from './components/PromptInput';
import ContentArea from './components/ContentArea';
import AuthModal from './components/AuthModal';
import { runGeneration } from './services/geminiService';
import { SECTION_FILTERS } from './constants';
import { GoogleGenAI } from '@google/genai';

export type GeneratedOutput = {
    type: 'text' | 'audio' | 'video';
    content: string;
    sources?: any[];
} | null;

const App: React.FC = () => {
    const [activeSection, setActiveSection] = useState<Section>(Section.Presentation);
    const [prompt, setPrompt] = useState<string>('');
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [generatedOutput, setGeneratedOutput] = useState<GeneratedOutput>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string>('AI fikrlamoqda...');
    const [error, setError] = useState<string>('');
    const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
    const [videoOperation, setVideoOperation] = useState<any>(null);

    const [filterOptions, setFilterOptions] = useState<FilterOptions>(() => {
        const initialFilters: FilterOptions = {};
        SECTION_FILTERS[activeSection]?.forEach(filter => {
            initialFilters[filter.id] = filter.defaultValue;
        });
        return initialFilters;
    });

    const handleSectionChange = (section: Section) => {
        setActiveSection(section);
        const newFilters: FilterOptions = {};
        SECTION_FILTERS[section]?.forEach(filter => {
            newFilters[filter.id] = filter.defaultValue;
        });
        setFilterOptions(newFilters);
        setGeneratedOutput(null);
        setError('');
    };

    const handleGenerate = useCallback(async () => {
        if ((!prompt && uploadedFiles.length === 0) || isLoading) return;

        if (activeSection === Section.Video) {
            // @ts-ignore
            const hasKey = await window.aistudio.hasSelectedApiKey();
            if (!hasKey) {
                // @ts-ignore
                await window.aistudio.openSelectKey();
                setError("API kaliti tanlandi. Iltimos, qaytadan 'Yaratish' tugmasini bosing.");
                return;
            }
        }

        setIsLoading(true);
        setError('');
        setGeneratedOutput(null);
        setLoadingMessage(activeSection === Section.Video ? 'Video yaratish boshlanmoqda...' : 'AI fikrlamoqda...');

        try {
            const result = await runGeneration(prompt, activeSection, uploadedFiles, filterOptions);
            
            if (result.type === 'video_operation') {
                setVideoOperation(result.operation);
                setLoadingMessage('Video ma\'lumotlari olinmoqda...');
            } else {
                setGeneratedOutput(result as GeneratedOutput);
                setIsLoading(false);
            }
        } catch (err: any) {
            setError(err.message || 'Tarkib yaratishda xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko\'ring.');
            console.error(err);
            setIsLoading(false);
        } finally {
            if (activeSection !== Section.Video) {
                 setPrompt('');
                 setUploadedFiles([]);
            }
        }
    }, [prompt, activeSection, isLoading, uploadedFiles, filterOptions]);

    useEffect(() => {
        if (!videoOperation || videoOperation.done) return;

        const pollOperation = async () => {
            try {
                // Re-create AI instance to get latest key
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                setLoadingMessage('Video yaratilmoqda, bu bir necha daqiqa vaqt olishi mumkin...');
                let currentOperation = await ai.operations.getVideosOperation({ operation: videoOperation });
                
                if (currentOperation.done) {
                    const videoUri = currentOperation.response?.generatedVideos?.[0]?.video?.uri;
                    if (videoUri) {
                        const response = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
                        const blob = await response.blob();
                        const objectURL = URL.createObjectURL(blob);
                        setGeneratedOutput({ type: 'video', content: objectURL });
                    } else {
                         throw new Error('Video yaratilmadi yoki URI topilmadi.');
                    }
                    setVideoOperation(null);
                    setIsLoading(false);
                    setPrompt('');
                    setUploadedFiles([]);
                } else {
                     // If not done, poll again after 10 seconds
                    setTimeout(pollOperation, 10000);
                }
            } catch (e) {
                console.error("Error polling video operation:", e);
                setError("Video holatini tekshirishda xatolik yuz berdi.");
                setVideoOperation(null);
                setIsLoading(false);
            }
        };

        const timeoutId = setTimeout(pollOperation, 1000); // Initial delay

        return () => clearTimeout(timeoutId);

    }, [videoOperation]);


    return (
        <div className="bg-black min-h-screen text-white font-sans flex flex-col relative overflow-hidden">
            <Navbar 
                activeSection={activeSection} 
                setActiveSection={handleSectionChange} 
                onAuthClick={() => setIsAuthModalOpen(true)}
            />
            <ContentArea
                activeSection={activeSection}
                generatedOutput={generatedOutput}
                setGeneratedOutput={setGeneratedOutput}
                isLoading={isLoading}
                loadingMessage={loadingMessage}
                error={error}
            />
            <PromptInput
                prompt={prompt}
                setPrompt={setPrompt}
                onGenerate={handleGenerate}
                isLoading={isLoading}
                activeSection={activeSection}
                uploadedFiles={uploadedFiles}
                setUploadedFiles={setUploadedFiles}
                filterOptions={filterOptions}
                setFilterOptions={setFilterOptions}
            />
            {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}
        </div>
    );
};

export default App;
