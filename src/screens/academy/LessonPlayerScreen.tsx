import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { WebView } from 'react-native-webview';
import api from '../../services/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const VIDEO_HEIGHT = (SCREEN_WIDTH * 9) / 16;

interface LessonData {
  id: number;
  title: string;
  content: string;
  video_url?: string;
  duration_minutes: number;
  order: number;
  completed: boolean;
  resources: Array<{ id: number; title: string; url: string; type: string }>;
  next_lesson?: { id: number; title: string };
  previous_lesson?: { id: number; title: string };
}

export default function LessonPlayerScreen({ route, navigation }: any) {
  const { courseId, courseSlug, moduleId, lessonId, lessonTitle } = route.params;
  const { t } = useTranslation();
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'resources'>('content');

  useEffect(() => {
    loadLesson();
  }, [lessonId]);

  async function loadLesson() {
    setLoading(true);
    try {
      const slug = courseSlug || courseId;
      const res = await api.get(
        `/academy/courses/${slug}/modules/${moduleId}/lessons/${lessonId}/`
      );
      setLesson(res.data);
    } catch {
      // fallback: try direct endpoint
      try {
        const res = await api.get(`/academy/lessons/${lessonId}/`);
        setLesson(res.data);
      } catch {
        // handle
      }
    } finally {
      setLoading(false);
    }
  }

  async function markComplete() {
    if (!lesson || lesson.completed) return;
    setCompleting(true);
    try {
      const slug = courseSlug || courseId;
      await api.post(
        `/academy/courses/${slug}/modules/${moduleId}/lessons/${lessonId}/complete/`
      );
      setLesson((prev) => (prev ? { ...prev, completed: true } : prev));
    } catch {
      // silent
    } finally {
      setCompleting(false);
    }
  }

  function goToLesson(nextLessonId: number, title: string) {
    navigation.replace('LessonPlayer', {
      courseId,
      courseSlug,
      moduleId,
      lessonId: nextLessonId,
      lessonTitle: title,
    });
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  if (!lesson) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Lesson not found</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.link}>{t('common.back')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {lesson.video_url ? (
        <View style={styles.videoContainer}>
          <WebView
            source={{ uri: lesson.video_url }}
            style={styles.video}
            allowsFullscreenVideo
            javaScriptEnabled
          />
        </View>
      ) : (
        <View style={styles.noVideo}>
          <Ionicons name="document-text" size={48} color="#818CF8" />
          <Text style={styles.noVideoText}>Text Lesson</Text>
        </View>
      )}

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'content' && styles.activeTab]}
          onPress={() => setActiveTab('content')}
        >
          <Text style={[styles.tabText, activeTab === 'content' && styles.activeTabText]}>
            Content
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'resources' && styles.activeTab]}
          onPress={() => setActiveTab('resources')}
        >
          <Text style={[styles.tabText, activeTab === 'resources' && styles.activeTabText]}>
            Resources ({lesson.resources?.length || 0})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'content' ? (
          <View style={styles.lessonContent}>
            <Text style={styles.lessonTitle}>{lesson.title}</Text>
            <View style={styles.lessonMeta}>
              <Ionicons name="time" size={14} color="#9CA3AF" />
              <Text style={styles.metaText}>{lesson.duration_minutes} min</Text>
              {lesson.completed && (
                <>
                  <Ionicons name="checkmark-circle" size={14} color="#34D399" />
                  <Text style={[styles.metaText, { color: '#34D399' }]}>
                    {t('academy.completed')}
                  </Text>
                </>
              )}
            </View>
            <Text style={styles.bodyText}>{lesson.content}</Text>
          </View>
        ) : (
          <View style={styles.resourcesList}>
            {lesson.resources?.length > 0 ? (
              lesson.resources.map((resource) => (
                <View key={resource.id} style={styles.resourceRow}>
                  <Ionicons
                    name={resource.type === 'pdf' ? 'document' : 'link'}
                    size={18}
                    color="#818CF8"
                  />
                  <Text style={styles.resourceTitle}>{resource.title}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No resources for this lesson</Text>
            )}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.navButtons}>
          {lesson.previous_lesson ? (
            <TouchableOpacity
              style={styles.navBtn}
              onPress={() => goToLesson(lesson.previous_lesson!.id, lesson.previous_lesson!.title)}
            >
              <Ionicons name="chevron-back" size={18} color="#A78BFA" />
              <Text style={styles.navBtnText}>{t('academy.previousLesson')}</Text>
            </TouchableOpacity>
          ) : (
            <View />
          )}

          {!lesson.completed ? (
            <TouchableOpacity
              style={[styles.completeBtn, completing && styles.btnDisabled]}
              onPress={markComplete}
              disabled={completing}
            >
              {completing ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Ionicons name="checkmark" size={18} color="#fff" />
                  <Text style={styles.completeBtnText}>{t('academy.markComplete')}</Text>
                </>
              )}
            </TouchableOpacity>
          ) : lesson.next_lesson ? (
            <TouchableOpacity
              style={styles.nextBtn}
              onPress={() => goToLesson(lesson.next_lesson!.id, lesson.next_lesson!.title)}
            >
              <Text style={styles.nextBtnText}>{t('academy.nextLesson')}</Text>
              <Ionicons name="chevron-forward" size={18} color="#fff" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191A2E',
  },
  center: {
    flex: 1,
    backgroundColor: '#191A2E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    marginBottom: 12,
  },
  link: {
    color: '#A78BFA',
    fontSize: 14,
  },
  videoContainer: {
    width: SCREEN_WIDTH,
    height: VIDEO_HEIGHT,
    backgroundColor: '#000',
  },
  video: {
    flex: 1,
  },
  noVideo: {
    width: SCREEN_WIDTH,
    height: VIDEO_HEIGHT * 0.6,
    backgroundColor: '#1F2037',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  noVideoText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#7C3AED',
  },
  tabText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#A78BFA',
  },
  content: {
    flex: 1,
  },
  lessonContent: {
    padding: 20,
  },
  lessonTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F3F4F6',
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    marginBottom: 20,
  },
  metaText: {
    fontSize: 13,
    color: '#9CA3AF',
    marginRight: 8,
  },
  bodyText: {
    fontSize: 15,
    color: '#D1D5DB',
    lineHeight: 24,
  },
  resourcesList: {
    padding: 20,
  },
  resourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#292A40',
  },
  resourceTitle: {
    fontSize: 14,
    color: '#D1D5DB',
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 14,
    textAlign: 'center',
    paddingTop: 20,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#374151',
    padding: 16,
    paddingBottom: 32,
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  navBtnText: {
    color: '#A78BFA',
    fontSize: 14,
  },
  completeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#059669',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  completeBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#7C3AED',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  nextBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  btnDisabled: {
    opacity: 0.6,
  },
});
