import { getCurrentUserProfile } from '@/lib/currentUser';
import { Avatar } from '@/components/dashboard/Avatar';
import ProfileForm from '../ProfileForm';

export default async function DashboardProfilePage() {
  const user = await getCurrentUserProfile();
  if (!user) return null;

  return (
    <div className="space-y-6">
      <h1 className="font-heading font-black text-2xl text-[#1F1A1C]">My Profile</h1>

      <div className="bg-white rounded-3xl border border-[#F3DCDD] shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-5">
        <Avatar name={user.name} phone={user.phone} size={64} />
        <div className="min-w-0">
          <h2 className="font-heading font-black text-lg text-[#1F1A1C]">{user.name || `+91 ${user.phone}`}</h2>
          <p className="text-xs text-[#888888] mt-1">
            {user.email || `+91 ${user.phone}`} · Joined{' '}
            {user.createdAt.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
          </p>
          {user.targetExam && (
            <span className="inline-block mt-2 font-plexmono text-[10px] font-bold text-[#C12223] bg-[#FDEAE9] px-2.5 py-1 rounded-full uppercase tracking-wide">
              Target: {user.targetExam}
            </span>
          )}
        </div>
      </div>

      <div>
        <h3 className="font-heading font-black text-sm text-[#1F1A1C] mb-3">Personal details</h3>
        <ProfileForm name={user.name} phone={user.phone} targetExam={user.targetExam} />
      </div>
    </div>
  );
}
