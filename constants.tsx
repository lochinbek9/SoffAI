import React from 'react';
import { Section } from './types';
import { PresentationIcon, ResearchIcon, ThesisIcon, ArticleIcon, IndependentWorkIcon, SliderIcon, ToneIcon, LengthIcon, SearchIcon, SoundIcon, VideoIcon } from './components/icons';

export const NAV_ITEMS = [
    { id: Section.Presentation, label: 'Taqdimot', icon: <PresentationIcon /> },
    { id: Section.Research, label: 'Ilmiy ish', icon: <ResearchIcon /> },
    { id: Section.Thesis, label: 'Tezis', icon: <ThesisIcon /> },
    { id: Section.Article, label: 'Maqola', icon: <ArticleIcon /> },
    { id: Section.Independent, label: 'Mustaqil ish', icon: <IndependentWorkIcon /> },
    { id: Section.Search, label: 'Qidiruv', icon: <SearchIcon /> },
    { id: Section.TTS, label: 'Nutq', icon: <SoundIcon /> },
    { id: Section.Video, label: 'Video', icon: <VideoIcon /> },
];

export const PLACEHOLDERS: Record<Section, string[]> = {
    [Section.Presentation]: [
        "10 slayddan iborat sun'iy intellekt kelajagi haqida taqdimot yaratish...",
        "Yangi eko-mahsulot uchun jozibador taqdimot tayyorlash...",
        "O'smirlar uchun moliyaviy savodxonlik bo'yicha interaktiv taqdimot...",
    ],
    [Section.Research]: [
        "Gen tahrirlash etikasi bo'yicha ilmiy ishning qoralamasini yozish...",
        "Ijtimoiy tarmoqlarning zamonaviy siyosatga ta'sirini tahlil qilish...",
        "Kriptovalyutalarning jahon iqtisodiyotidagi o'rni haqida tadqiqot...",
    ],
    [Section.Thesis]: [
        "Post-kolonial adabiyot bo'yicha tezisning asosiy g'oyasini shakllantirish...",
        "Qayta tiklanuvchi energiya manbalari bo'yicha to'liq tezis rejasini tuzish...",
        "Raqamli marketingning kichik biznesga ta'siri haqida chuqur tahliliy tezis...",
    ],
    [Section.Article]: [
        "Mahsuldorlik sirlari haqida ommabop maqola yozish...",
        "Jazz musiqasi tarixi haqida batafsil maqola yaratish...",
        "Minimalizm falsafasining zamonaviy hayotdagi o'rni haqida maqola...",
    ],
    [Section.Independent]: [
        "Buyuk Ipak Yo'li tarixi bo'yicha batafsil ma'ruza tayyorlash...",
        "Stoik falsafasining asosiy tamoyillarini referat uchun umumlashtirish...",
        "Amir Temur saltanatining harbiy strategiyalari haqida mustaqil ish...",
    ],
    [Section.Search]: [
        "2024 yilgi Parij Olimpiadasida eng ko'p bronza medalini kim yutdi?",
        "Eng so'nggi kvant kompyuterlari yutuqlari nimalardan iborat?",
        "O'zbekistondagi eng yaxshi tog' kurortlari qaysilar?",
    ],
    [Section.TTS]: [
        "Salom! Mening ismim SoffAI. Sizga qanday yordam bera olaman?",
        "Bugun ajoyib kun, shunday emasmi?",
        "Fan va texnologiya olamiga xush kelibsiz.",
    ],
    [Section.Video]: [
        "Toshkentning tungi manzarasi, neon chiroqlar va harakat...",
        "Registon maydonida quyosh chiqishi, dron orqali olingan kadr...",
        "Kiberpank uslubidagi robotning skeytbord uchayotgani...",
    ],
};

export const INTRO_MESSAGES: Record<Section, { title: string; subtitle: string; }> = {
    [Section.Presentation]: {
        title: "Bir g'oyadan yorqin taqdimotgacha",
        subtitle: "Mavzuni kiriting va SoffAI siz uchun slaydlar, matnlar va tuzilmani yaratishini kuzating."
    },
    [Section.Research]: {
        title: "Ilmiy ishingiz uchun kuchli poydevor",
        subtitle: "Tadqiqot savolingizni yozing, biz esa gipoteza, adabiyotlar tahlili va metodologiyani taklif qilamiz."
    },
    [Section.Thesis]: {
        title: "Tezisingizni ishonch bilan boshlang",
        subtitle: "Murakkab g'oyalarni tizimli va akademik matnga aylantirishda yordam beramiz."
    },
    [Section.Article]: {
        title: "O'quvchilarni jalb qiladigan maqolalar",
        subtitle: "Qiziqarli sarlavhadan tortib, ta'sirli xulosagacha — professional kontent bir necha daqiqada tayyor."
    },
    [Section.Independent]: {
        title: "Mustaqil ishingizni osonlashtiring",
        subtitle: "Mavzuni tanlang, biz esa material to'plash, reja tuzish va asosiy qismlarni yozishda ko'maklashamiz."
    },
    [Section.Search]: {
        title: "Eng so'nggi ma'lumotlar sizning ixtiyoringizda",
        subtitle: "Savolingizni bering va Google qidiruviga asoslangan aniq, ishonchli javoblarni oling."
    },
    [Section.TTS]: {
        title: "Matnni jonli nutqqa aylantiring",
        subtitle: "Har qanday matnni kiriting va turli ovozlarda yuqori sifatli audio eshiting."
    },
    [Section.Video]: {
        title: "Tasavvuringizni videoga aylantiring",
        subtitle: "G'oyangizni yozing yoki rasm yuklang va SoffAI uni ajoyib videoga aylantirsin."
    }
};

export const BACKGROUND_VIDEOS: Record<Section, string> = {
    [Section.Presentation]: "https://cdn.pixabay.com/video/2022/08/24/127429-742057396_large.mp4",
    [Section.Research]: "https://cdn.pixabay.com/video/2024/04/23/210087-935128038_large.mp4",
    [Section.Thesis]: "https://cdn.pixabay.com/video/2023/10/11/184136-873836881_large.mp4",
    [Section.Article]: "https://cdn.pixabay.com/video/2023/04/09/157242-817666904_large.mp4",
    [Section.Independent]: "https://cdn.pixabay.com/video/2021/08/11/86182-581333798_large.mp4",
    [Section.Search]: "https://cdn.pixabay.com/video/2024/02/11/199049-913317929_large.mp4",
    [Section.TTS]: "https://cdn.pixabay.com/video/2024/02/01/198115-909214739_large.mp4",
    [Section.Video]: "https://cdn.pixabay.com/video/2023/07/03/170942-843310041_large.mp4",
};

export const SECTION_FILTERS: Record<string, any[]> = {
    [Section.Presentation]: [
        { 
            id: 'slides', 
            label: 'Slaydlar soni', 
            type: 'slider', 
            min: 3, 
            max: 25, 
            defaultValue: 10,
            icon: <SliderIcon />
        },
    ],
    [Section.Research]: [
        { id: 'tone', label: 'Ohang', type: 'buttons', options: ['Akademik', 'Rasmiy', 'Tahliliy'], defaultValue: 'Akademik', icon: <ToneIcon /> },
        { id: 'length', label: 'Hajmi', type: 'buttons', options: ['Qisqa', 'O\'rta', 'Uzun'], defaultValue: 'O\'rta', icon: <LengthIcon /> },
    ],
    [Section.Thesis]: [
        { id: 'tone', label: 'Ohang', type: 'buttons', options: ['Akademik', 'Tanqidiy', 'Chuqur'], defaultValue: 'Akademik', icon: <ToneIcon /> },
        { id: 'length', label: 'Hajmi', type: 'buttons', options: ['O\'rta', 'Uzun', 'To\'liq'], defaultValue: 'Uzun', icon: <LengthIcon /> },
    ],
    [Section.Article]: [
        { id: 'tone', label: 'Ohang', type: 'buttons', options: ['Oddiy', 'Professional', 'Ishontiruvchi'], defaultValue: 'Professional', icon: <ToneIcon /> },
        { id: 'length', label: 'Hajmi', type: 'buttons', options: ['Qisqa', 'O\'rta', 'Batafsil'], defaultValue: 'O\'rta', icon: <LengthIcon /> },
    ],
    [Section.Independent]: [
        { id: 'tone', label: 'Ohang', type: 'buttons', options: ['Informatsion', 'Tahliliy', 'Tarixiy'], defaultValue: 'Informatsion', icon: <ToneIcon /> },
        { id: 'length', label: 'Hajmi', type: 'buttons', options: ['Referat', 'Kurs ishi', 'Tahliliy ish'], defaultValue: 'Referat', icon: <LengthIcon /> },
    ],
    [Section.TTS]: [
        { id: 'voice', label: 'Ovoz', type: 'buttons', options: ['Kore', 'Puck', 'Zephyr', 'Charon'], defaultValue: 'Kore', icon: <SoundIcon /> },
    ],
    [Section.Video]: [
        { id: 'aspectRatio', label: 'Tomonlar nisbati', type: 'buttons', options: ['16:9', '9:16'], defaultValue: '16:9', icon: <VideoIcon /> },
    ],
    [Section.Search]: [],
};
