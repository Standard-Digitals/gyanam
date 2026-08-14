'use client';
import { useState } from 'react';
import { MoreVertical, UserPlus, Copy, Check, X } from 'lucide-react';
import { ADMIN_ROLE_LABELS } from '../_components/AdminUI';

interface SiteSettings {
  academyName: string;
  tagline: string;
  supportEmail: string;
  supportPhone: string;
  ogDescription: string;
}

interface NotificationPrefs {
  newEnrollments: boolean;
  newLeads: boolean;
  openTickets: boolean;
  pendingOrders: boolean;
}

interface TeamMember {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
}

const ROLE_LABELS = ADMIN_ROLE_LABELS;
const ROLE_OPTIONS = Object.entries(ROLE_LABELS);

const NOTIF_ROWS: { key: keyof NotificationPrefs; label: string; sub: string }[] = [
  { key: 'newEnrollments', label: 'New student enrollment', sub: 'Alert when a student enrolls in a course' },
  { key: 'newLeads', label: 'New lead submitted', sub: 'Alert when a contact form / query comes in' },
  { key: 'openTickets', label: 'Support ticket opened', sub: 'Alert when a student raises a support ticket' },
  { key: 'pendingOrders', label: 'Order placed', sub: 'Alert when a new order is pending dispatch' },
];

const AVATAR_COLORS = ['#C12223', '#B4590A', '#127A52', '#3B5BDB', '#7048E8', '#0B8792'];
function colorFor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}
function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || '?';
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-5.5 rounded-full transition-colors cursor-pointer shrink-0 ${checked ? 'bg-[#C12223]' : 'bg-gray-200'}`}
      style={{ height: '22px' }}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-[18px]' : 'translate-x-0'}`}
        style={{ width: '18px', height: '18px' }}
      />
    </button>
  );
}

export default function SettingsManager({
  siteSettings: initialSiteSettings,
  notificationPrefs: initialPrefs,
  team: initialTeam,
  currentAdminId,
}: {
  siteSettings: SiteSettings;
  notificationPrefs: NotificationPrefs;
  team: TeamMember[];
  currentAdminId: string | null;
}) {
  const [siteSettings, setSiteSettings] = useState(initialSiteSettings);
  const [siteSaving, setSiteSaving] = useState(false);
  const [siteSaved, setSiteSaved] = useState(false);
  const [siteError, setSiteError] = useState<string | null>(null);

  const [prefs, setPrefs] = useState(initialPrefs);
  const [prefsSaving, setPrefsSaving] = useState(false);

  const [team, setTeam] = useState(initialTeam);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [inviting, setInviting] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', role: 'course_manager' });
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSubmitting, setInviteSubmitting] = useState(false);
  const [newAdminPassword, setNewAdminPassword] = useState<{ email: string; password: string } | null>(null);
  const [passwordCopied, setPasswordCopied] = useState(false);

  const saveSiteSettings = async () => {
    setSiteSaving(true);
    setSiteError(null);
    try {
      const res = await fetch('/api/admin/settings/site', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteSettings),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save settings');
      setSiteSaved(true);
      setTimeout(() => setSiteSaved(false), 2000);
    } catch (err) {
      setSiteError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSiteSaving(false);
    }
  };

  const togglePref = async (key: keyof NotificationPrefs, value: boolean) => {
    const previous = prefs;
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    setPrefsSaving(true);
    try {
      const res = await fetch('/api/admin/settings/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next),
      });
      if (!res.ok) throw new Error('Failed to save');
    } catch (err) {
      console.error('Failed to save notification preference', err);
      setPrefs(previous);
    } finally {
      setPrefsSaving(false);
    }
  };

  const submitInvite = async () => {
    if (!inviteForm.name.trim() || !inviteForm.email.trim()) {
      setInviteError('Name and email are required');
      return;
    }
    setInviteSubmitting(true);
    setInviteError(null);
    try {
      const res = await fetch('/api/admin/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inviteForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create admin');
      setTeam((prev) => [...prev, { ...data.admin, createdAt: data.admin.createdAt }]);
      setNewAdminPassword({ email: data.admin.email, password: data.tempPassword });
      setInviting(false);
      setInviteForm({ name: '', email: '', role: 'course_manager' });
    } catch (err) {
      setInviteError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setInviteSubmitting(false);
    }
  };

  const changeRole = async (id: string, role: string) => {
    const previous = team;
    setTeam((prev) => prev.map((m) => (m.id === id ? { ...m, role } : m)));
    setMenuOpenId(null);
    try {
      const res = await fetch(`/api/admin/team/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) throw new Error('Failed to update role');
    } catch (err) {
      console.error('Failed to update role', err);
      setTeam(previous);
    }
  };

  const removeMember = async (id: string) => {
    if (!confirm('Remove this team member?')) return;
    setMenuOpenId(null);
    const previous = team;
    setTeam((prev) => prev.filter((m) => m.id !== id));
    try {
      const res = await fetch(`/api/admin/team/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to remove');
      }
    } catch (err) {
      console.error('Failed to remove team member', err);
      setTeam(previous);
      alert(err instanceof Error ? err.message : 'Could not remove this team member');
    }
  };

  const copyPassword = () => {
    if (!newAdminPassword) return;
    navigator.clipboard.writeText(newAdminPassword.password);
    setPasswordCopied(true);
    setTimeout(() => setPasswordCopied(false), 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white p-5 rounded-2xl border border-[#F3DCDD] shadow-sm space-y-3">
          <div>
            <h3 className="font-heading font-black text-base text-[#1F1A1C]">Site identity</h3>
            <p className="text-xs text-[#888888] mt-0.5">Public-facing details for gyanam.in</p>
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#888888] uppercase tracking-wide">Academy Name</label>
            <input
              type="text"
              value={siteSettings.academyName}
              onChange={(e) => setSiteSettings({ ...siteSettings, academyName: e.target.value })}
              className="w-full mt-1 px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-[#888888] uppercase tracking-wide">Tagline</label>
            <input
              type="text"
              value={siteSettings.tagline}
              onChange={(e) => setSiteSettings({ ...siteSettings, tagline: e.target.value })}
              className="w-full mt-1 px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-[#888888] uppercase tracking-wide">Support Email</label>
              <input
                type="email"
                value={siteSettings.supportEmail}
                onChange={(e) => setSiteSettings({ ...siteSettings, supportEmail: e.target.value })}
                className="w-full mt-1 px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#888888] uppercase tracking-wide">Support Phone</label>
              <input
                type="text"
                value={siteSettings.supportPhone}
                onChange={(e) => setSiteSettings({ ...siteSettings, supportPhone: e.target.value })}
                className="w-full mt-1 px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold"
              />
            </div>
          </div>
          <div>
            <label className="text-[11px] font-bold text-[#888888] uppercase tracking-wide">Default OG Description</label>
            <textarea
              rows={3}
              value={siteSettings.ogDescription}
              onChange={(e) => setSiteSettings({ ...siteSettings, ogDescription: e.target.value })}
              className="w-full mt-1 px-3.5 py-2 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl text-sm font-semibold resize-y"
            />
          </div>

          {siteError && <p className="text-xs font-semibold text-red-600">{siteError}</p>}
          <div className="flex items-center gap-3">
            <button
              onClick={saveSiteSettings}
              disabled={siteSaving}
              className="px-4 py-2 bg-[#C12223] text-white font-bold text-xs rounded-xl disabled:opacity-50 cursor-pointer"
            >
              {siteSaving ? 'Saving...' : 'Save changes'}
            </button>
            {siteSaved && <span className="text-xs font-bold text-[#127A52]">Saved</span>}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#F3DCDD] shadow-sm space-y-1">
          <div className="mb-2">
            <h3 className="font-heading font-black text-base text-[#1F1A1C]">Notifications</h3>
            <p className="text-xs text-[#888888] mt-0.5">What triggers an admin alert{prefsSaving ? ' · Saving…' : ''}</p>
          </div>
          {NOTIF_ROWS.map((row) => (
            <div key={row.key} className="flex items-center justify-between py-2.5 border-t border-gray-100 first:border-0">
              <div className="min-w-0 pr-4">
                <p className="text-sm font-semibold text-[#1F1A1C]">{row.label}</p>
                <p className="text-xs text-[#888888]">{row.sub}</p>
              </div>
              <Toggle checked={prefs[row.key]} onChange={(v) => togglePref(row.key, v)} />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-[#F3DCDD] shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-black text-base text-[#1F1A1C]">Team access</h3>
            <p className="text-xs text-[#888888] mt-0.5">Who can manage the control room</p>
          </div>
          {!inviting && (
            <button
              onClick={() => { setInviting(true); setInviteError(null); }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#F3DCDD] rounded-lg text-xs font-bold text-[#1F1A1C] cursor-pointer"
            >
              <UserPlus size={13} strokeWidth={2.25} />
              Invite
            </button>
          )}
        </div>

        {newAdminPassword && (
          <div className="p-3 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl space-y-1.5">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold text-[#888888] uppercase">Temp password for {newAdminPassword.email}</p>
              <button onClick={() => setNewAdminPassword(null)} className="text-[#8A7A7B] cursor-pointer"><X size={13} /></button>
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-2.5 py-1.5 bg-white border border-[#F3DCDD] rounded-lg text-xs font-plexmono font-bold text-[#1F1A1C] truncate">
                {newAdminPassword.password}
              </code>
              <button onClick={copyPassword} className="w-8 h-8 flex items-center justify-center bg-white border border-[#F3DCDD] rounded-lg text-[#1F1A1C] cursor-pointer shrink-0">
                {passwordCopied ? <Check size={13} className="text-[#127A52]" /> : <Copy size={13} />}
              </button>
            </div>
            <p className="text-[10px] text-[#888888]">Shown once — share this with the new admin directly.</p>
          </div>
        )}

        {inviting && (
          <div className="p-3 bg-[#FFF5F5] border border-[#F3DCDD] rounded-xl space-y-2">
            <input
              type="text"
              placeholder="Full name"
              value={inviteForm.name}
              onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-[#F3DCDD] rounded-lg text-xs font-semibold"
            />
            <input
              type="email"
              placeholder="Email"
              value={inviteForm.email}
              onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-[#F3DCDD] rounded-lg text-xs font-semibold"
            />
            <select
              value={inviteForm.role}
              onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-[#F3DCDD] rounded-lg text-xs font-semibold"
            >
              {ROLE_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
            {inviteError && <p className="text-[11px] font-semibold text-red-600">{inviteError}</p>}
            <div className="flex gap-2">
              <button onClick={submitInvite} disabled={inviteSubmitting} className="px-3 py-1.5 bg-[#C12223] text-white font-bold text-xs rounded-lg disabled:opacity-50 cursor-pointer">
                {inviteSubmitting ? 'Creating...' : 'Create account'}
              </button>
              <button onClick={() => setInviting(false)} className="px-3 py-1.5 bg-gray-100 text-gray-700 font-bold text-xs rounded-lg cursor-pointer">Cancel</button>
            </div>
          </div>
        )}

        <div className="space-y-1">
          {team.map((member) => (
            <div key={member.id} className="relative flex items-center justify-between gap-2 py-2 border-t border-gray-100 first:border-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0"
                  style={{ backgroundColor: colorFor(member.email) }}
                >
                  {initials(member.name || member.email)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#1F1A1C] truncate">{member.name || member.email}</p>
                  <p className="text-xs text-[#888888] truncate">{ROLE_LABELS[member.role] ?? member.role}</p>
                </div>
              </div>
              <button
                onClick={() => setMenuOpenId(menuOpenId === member.id ? null : member.id)}
                className="w-7 h-7 flex items-center justify-center text-[#8A7A7B] hover:text-[#1F1A1C] cursor-pointer shrink-0"
              >
                <MoreVertical size={15} />
              </button>
              {menuOpenId === member.id && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpenId(null)} />
                  <div className="absolute top-[calc(100%-4px)] right-0 w-44 bg-white border border-[#F3DCDD] rounded-xl shadow-lg z-20 overflow-hidden">
                    <p className="px-3 pt-2 pb-1 text-[10px] font-bold text-[#888888] uppercase">Change role</p>
                    {ROLE_OPTIONS.map(([value, label]) => (
                      <button
                        key={value}
                        onClick={() => changeRole(member.id, value)}
                        className={`w-full text-left px-3 py-1.5 text-xs font-semibold ${member.role === value ? 'text-[#C12223] bg-[#FBF6F4]' : 'text-[#1F1A1C] hover:bg-[#FBF6F4]'}`}
                      >
                        {label}
                      </button>
                    ))}
                    <button
                      onClick={() => removeMember(member.id)}
                      disabled={member.id === currentAdminId}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-red-600 border-t border-gray-100 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Remove
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
          {team.length === 0 && <p className="text-center text-xs text-[#888888] py-6">No team members yet.</p>}
        </div>
      </div>
    </div>
  );
}
