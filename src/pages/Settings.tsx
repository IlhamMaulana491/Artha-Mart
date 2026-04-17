import React from 'react';
import { Settings as SettingsIcon, Shield, Bell, User, Globe, Database, HelpCircle } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Settings() {
  const sections = [
    { title: 'Akun & Profil', icon: User, desc: 'Kelola identitas dan informasi login anda.' },
    { title: 'Keamanan', icon: Shield, desc: 'Pengaturan kata sandi dan autentikasi dua faktor.' },
    { title: 'Notifikasi', icon: Bell, desc: 'Atur bagaimana anda menerima pembaruan sistem.' },
    { title: 'Preferensi Wilayah', icon: Globe, desc: 'Bahasa, zona waktu, dan format mata uang.' },
    { title: 'Manajemen Data', icon: Database, desc: 'Ekspor atau hapus data crm anda secara permanen.' },
    { title: 'Bantuan', icon: HelpCircle, desc: 'Pusat bantuan dan dukungan teknis Artha CRM.' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">Pengaturan Sistem</h2>
        <p className="text-xs text-slate-400 font-medium italic">Konfigurasi Artha CRM sesuai kebutuhan operasional bisnis anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((section, idx) => (
          <button 
            key={idx}
            className="flex items-start gap-4 p-5 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 hover:shadow-md transition-all text-left group"
          >
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl group-hover:bg-slate-900 transition-colors">
              <section.icon className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">{section.title}</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed italic">{section.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="p-8 bg-slate-900 rounded-3xl text-center space-y-4">
        <div className="flex justify-center -space-x-2">
          {[1,2,3].map(i => (
            <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400">
               {i}
            </div>
          ))}
        </div>
        <div className="max-w-xs mx-auto text-center">
          <p className="text-white text-xs font-bold mb-2">Anda memerlukan bantuan?</p>
          <p className="text-slate-500 text-[10px] italic mb-4">Tim dukungan Artha CRM siap membantu anda 24/7 untuk memastikan kelancaran bisnis anda.</p>
          <button className="text-[11px] font-bold text-slate-900 bg-white px-4 py-2 rounded-full hover:bg-slate-100 transition-all">
            Hubungi Support
          </button>
        </div>
      </div>
    </div>
  );
}
