'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Circle, ChevronLeft, ChevronRight, ArrowLeft, PlayCircle, Clock } from 'lucide-react';
import { getYouTubeEmbedUrl } from '@/lib/youtube';

interface Topic {
  id: string;
  title: string;
  videoType: string;
  videoUrl: string | null;
  duration: string | null;
}
interface Chapter {
  id: string;
  title: string;
  topics: Topic[];
}

export default function CoursePlayer({
  course,
  chapters,
  completedTopicIds,
  initialTopicId,
}: {
  course: { title: string; slug: string };
  chapters: Chapter[];
  completedTopicIds: string[];
  initialTopicId: string | null;
}) {
  const router = useRouter();
  const [completed, setCompleted] = useState(new Set(completedTopicIds));
  const [selectedTopicId, setSelectedTopicId] = useState(initialTopicId);
  const [saving, setSaving] = useState(false);

  const flatTopics = useMemo(() => chapters.flatMap((c) => c.topics), [chapters]);
  const selectedTopic = flatTopics.find((t) => t.id === selectedTopicId) ?? null;
  const selectedIndex = flatTopics.findIndex((t) => t.id === selectedTopicId);
  const prevTopic = selectedIndex > 0 ? flatTopics[selectedIndex - 1] : null;
  const nextTopic = selectedIndex >= 0 && selectedIndex < flatTopics.length - 1 ? flatTopics[selectedIndex + 1] : null;

  const total = flatTopics.length;
  const percent = total > 0 ? Math.round((completed.size / total) * 100) : 0;

  const selectTopic = (id: string) => {
    setSelectedTopicId(id);
    router.replace(`/dashboard/courses/${course.slug}?topic=${id}`, { scroll: false });
  };

  const toggleComplete = async (topicId: string, value: boolean) => {
    const previous = new Set(completed);
    setCompleted((prev) => {
      const next = new Set(prev);
      if (value) next.add(topicId);
      else next.delete(topicId);
      return next;
    });
    setSaving(true);
    try {
      const res = await fetch(`/api/dashboard/topics/${topicId}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: value }),
      });
      if (!res.ok) throw new Error('Failed to save progress');
    } catch (err) {
      console.error(err);
      setCompleted(previous);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <Link href="/dashboard/courses" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8A7A7B] hover:text-[#C12223]">
        <ArrowLeft className="w-3.5 h-3.5" />
        My Courses
      </Link>

      <div>
        <h1 className="font-heading font-black text-xl sm:text-2xl text-[#1F1A1C]">{course.title}</h1>
        <div className="flex items-center gap-2 mt-2 max-w-xs">
          <div className="flex-1 h-1.5 bg-[#F3DCDD] rounded-full overflow-hidden">
            <div className="h-full bg-[#C12223] rounded-full transition-all" style={{ width: `${percent}%` }} />
          </div>
          <span className="text-[11px] font-bold text-[#888888] font-plexmono shrink-0">{percent}% · {completed.size}/{total}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 items-start">
        <div className="space-y-4">
          <div className="bg-black rounded-2xl overflow-hidden aspect-video">
            {selectedTopic?.videoUrl ? (
              selectedTopic.videoType === 'youtube' ? (
                <iframe
                  key={selectedTopic.id}
                  src={getYouTubeEmbedUrl(selectedTopic.videoUrl)}
                  title={selectedTopic.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video key={selectedTopic.id} src={selectedTopic.videoUrl} controls autoPlay className="w-full h-full" />
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/40">
                <PlayCircle className="w-12 h-12" />
              </div>
            )}
          </div>

          {selectedTopic && (
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#F3DCDD] shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-heading font-black text-base text-[#1F1A1C]">{selectedTopic.title}</h2>
                  {selectedTopic.duration && (
                    <p className="flex items-center gap-1.5 text-xs text-[#888888] mt-1">
                      <Clock className="w-3.5 h-3.5" />
                      {selectedTopic.duration}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => toggleComplete(selectedTopic.id, !completed.has(selectedTopic.id))}
                  disabled={saving}
                  className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer disabled:opacity-50 ${
                    completed.has(selectedTopic.id) ? 'bg-[#E7F5EE] text-[#127A52]' : 'bg-[#C12223] text-white'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {completed.has(selectedTopic.id) ? 'Completed' : 'Mark as complete'}
                </button>
              </div>

              <div className="flex items-center justify-between gap-3 mt-5 pt-4 border-t border-gray-100">
                <button
                  onClick={() => prevTopic && selectTopic(prevTopic.id)}
                  disabled={!prevTopic}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Previous
                </button>
                <button
                  onClick={() => nextTopic && selectTopic(nextTopic.id)}
                  disabled={!nextTopic}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-[#C12223] text-white font-bold text-xs rounded-xl disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next lesson
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-[#F3DCDD] shadow-sm max-h-[70vh] overflow-y-auto">
          {chapters.map((chapter) => (
            <div key={chapter.id} className="border-b border-gray-100 last:border-0">
              <p className="px-4 py-3 text-[11px] font-black text-[#888888] uppercase tracking-wide bg-[#FBF6F4]">{chapter.title}</p>
              <div>
                {chapter.topics.map((topic) => {
                  const isSelected = topic.id === selectedTopicId;
                  const isDone = completed.has(topic.id);
                  return (
                    <button
                      key={topic.id}
                      onClick={() => selectTopic(topic.id)}
                      className={`w-full flex items-center gap-2.5 px-4 py-3 text-left border-b border-gray-50 last:border-0 cursor-pointer ${
                        isSelected ? 'bg-[#FDEAE9]' : 'hover:bg-[#FBF6F4]'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-[#127A52] shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-[#D9B4B5] shrink-0" />
                      )}
                      <span className={`min-w-0 flex-1 text-xs leading-snug ${isSelected ? 'font-bold text-[#C12223]' : 'font-semibold text-[#1F1A1C]'}`}>
                        {topic.title}
                      </span>
                      {topic.duration && <span className="text-[10px] text-[#888888] shrink-0 font-plexmono">{topic.duration}</span>}
                    </button>
                  );
                })}
                {chapter.topics.length === 0 && <p className="px-4 py-3 text-xs text-[#888888]">No lessons yet.</p>}
              </div>
            </div>
          ))}
          {chapters.length === 0 && <p className="px-4 py-6 text-center text-xs text-[#888888]">Curriculum coming soon.</p>}
        </div>
      </div>
    </div>
  );
}
