import { getCurrentUserProfile } from '@/lib/currentUser';
import ProfileForm from '../ProfileForm';

export default async function DashboardProfilePage() {
  const user = await getCurrentUserProfile();
  if (!user) return null;

  return (
    <div className="space-y-6">
      <h1 className="font-heading font-black text-2xl text-[#1F1A1C]">My Profile</h1>
      <ProfileForm name={user.name} phone={user.phone} targetExam={user.targetExam} />
    </div>
  );
}
