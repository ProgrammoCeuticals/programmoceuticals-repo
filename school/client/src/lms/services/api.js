import { staleWhileRevalidate } from './cache';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data?.message || 'Request failed');
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

// ─── Normalizers ────────────────────────────────────────────────────────────

export function normalizeCourse(raw) {
  if (!raw) return null;
  return {
    id: raw.id || raw.slug || raw._id,
    slug: raw.slug || raw.id,
    mongoId: raw._id,
    name: raw.name || raw.title,
    title: raw.title || raw.name,
    description: raw.description || '',
    category: raw.category || '',
    level: raw.level || '',
    duration: raw.duration || `${raw.duration_weeks || raw.durationWeeks || 12} weeks`,
    durationWeeks: raw.durationWeeks || raw.duration_weeks || 12,
    objectives: raw.objectives || [],
    outline: raw.outline || [],
    color: raw.color || '#0b5ed7',
    iconKey: raw.iconKey || raw.icon_key || raw.slug || raw.id,
    moduleCount: raw.moduleCount || 0,
    lessonCount: raw.lessonCount || 0,
    nextCohortStartDate: raw.nextCohortStartDate || null,
    access: {
      previewPercent: raw.access?.previewPercent ?? raw.preview_percent ?? 20,
      fullAccessRequiresAuth: raw.access?.fullAccessRequiresAuth ?? true,
      hasFullAccess: raw.access?.hasFullAccess ?? false,
    },
    payment: {
      learning: 'free',
      certification: 'paid',
      cohortTraining: 'paid',
    },
  };
}

export function normalizeModule(raw) {
  if (!raw) return null;
  return {
    id: raw.id || raw._id,
    title: raw.title,
    slug: raw.slug,
    description: raw.description || '',
    orderIndex: raw.orderIndex ?? raw.order_index ?? 0,
    lessonCount: raw.lessonCount || 0,
    estimatedMinutes: raw.estimatedMinutes || 0,
    lessons: (raw.lessons || []).map(normalizeLesson),
  };
}

export function normalizeLesson(raw) {
  if (!raw) return null;
  return {
    id: raw.id || raw._id,
    title: raw.title,
    slug: raw.slug,
    summary: raw.summary || '',
    lessonType: raw.lessonType || raw.lesson_type || 'content',
    orderIndex: raw.orderIndex ?? raw.order_index ?? 0,
    lessonNumber: raw.lessonNumber ?? raw.lesson_number ?? 0,
    estimatedDurationMinutes: raw.estimatedDurationMinutes || raw.estimated_duration_minutes || 5,
    slideCount: raw.slideCount || 0,
    sourceSlideId: raw.sourceSlideId ?? null,
    isLocked: raw.isLocked ?? false,
  };
}

export function normalizeEnrollment(raw) {
  if (!raw) return null;
  return {
    id: raw.id || raw._id,
    accessType: raw.accessType || 'self_paced',
    status: raw.status || 'active',
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    course: raw.course ? {
      id: raw.course.id || raw.course._id,
      title: raw.course.title,
      slug: raw.course.slug,
      description: raw.course.description || '',
      level: raw.course.level || '',
      category: raw.course.category || '',
    } : null,
  };
}

export function normalizeLessonProgress(raw) {
  if (!raw) return null;
  return {
    id: raw.id || raw._id,
    status: raw.status || 'not_started',
    percentComplete: raw.percentComplete || 0,
    lastPosition: raw.lastPosition || {},
    startedAt: raw.startedAt,
    completedAt: raw.completedAt || null,
    updatedAt: raw.updatedAt,
    lesson: raw.lesson ? {
      id: raw.lesson.id || raw.lesson._id,
      title: raw.lesson.title,
      slug: raw.lesson.slug,
      moduleId: raw.lesson.moduleId,
      courseId: raw.lesson.courseId,
    } : null,
    module: raw.module ? { id: raw.module.id || raw.module._id, title: raw.module.title } : null,
    course: raw.course ? { id: raw.course.id || raw.course._id, title: raw.course.title, slug: raw.course.slug } : null,
  };
}

export function normalizeNotification(raw) {
  if (!raw) return null;
  return {
    id: raw.id || raw._id,
    type: raw.type,
    title: raw.title,
    message: raw.message,
    isRead: raw.isRead ?? false,
    readAt: raw.readAt || null,
    meta: raw.meta || {},
    createdAt: raw.createdAt,
  };
}

export function normalizeCertificate(raw) {
  if (!raw) return null;
  return {
    id: raw.id || raw._id,
    certificateNumber: raw.certificateNumber,
    status: raw.status || 'issued',
    issuedAt: raw.issuedAt,
    course: raw.course ? { id: raw.course.id || raw.course._id, title: raw.course.title, slug: raw.course.slug } : null,
    cohort: raw.cohort ? { id: raw.cohort.id || raw.cohort._id, name: raw.cohort.name } : null,
    student: raw.student ? { name: raw.student.name, email: raw.student.email } : null,
  };
}

export function normalizePayment(raw) {
  if (!raw) return null;
  return {
    id: raw.id || raw._id,
    type: raw.type,
    amount: raw.amount,
    currency: raw.currency || 'NGN',
    reference: raw.reference,
    status: raw.status,
    method: raw.method,
    provider: raw.provider,
    authorizationUrl: raw.authorizationUrl || raw.authorization_url || '',
    paidAt: raw.paidAt || null,
    proofReference: raw.proofReference || '',
    proofNote: raw.proofNote || '',
    proofSubmittedAt: raw.proofSubmittedAt || null,
    confirmedAt: raw.confirmedAt || null,
    createdAt: raw.createdAt,
    application: raw.application ? {
      id: raw.application.id || raw.application._id,
      status: raw.application.status,
      paymentStatus: raw.application.paymentStatus,
      courseTitle: raw.application.courseTitle,
      courseSlug: raw.application.courseSlug,
      cohortName: raw.application.cohortName,
    } : null,
    enrollment: raw.enrollment || null,
  };
}

export function normalizeCohortApplication(raw) {
  if (!raw) return null;
  return {
    id: raw.id || raw._id,
    type: raw.type,
    status: raw.status,
    paymentStatus: raw.paymentStatus,
    fullName: raw.fullName,
    email: raw.email,
    phone: raw.phone,
    notes: raw.notes || '',
    adminNotes: raw.adminNotes || '',
    preferredStartDate: raw.preferredStartDate || null,
    source: raw.source || '',
    createdAt: raw.createdAt,
    user: raw.user ? { id: raw.user.id || raw.user._id, name: raw.user.name, email: raw.user.email } : null,
    course: raw.course ? { id: raw.course.id || raw.course._id, slug: raw.course.slug, title: raw.course.title } : null,
    cohort: raw.cohort ? { id: raw.cohort.id || raw.cohort._id, name: raw.cohort.name } : null,
  };
}

export function normalizeAdminCourse(raw) {
  if (!raw) return null;
  return {
    id: raw._id || raw.id,
    title: raw.title,
    slug: raw.slug,
    category: raw.category,
    level: raw.level,
    description: raw.description || '',
    durationWeeks: raw.duration_weeks || raw.durationWeeks || 12,
    objectives: raw.objectives || [],
    outline: raw.outline || [],
    color: raw.color || '#0b5ed7',
    iconKey: raw.icon_key || raw.iconKey || '',
    previewPercent: raw.preview_percent || raw.previewPercent || 20,
    sortOrder: raw.sort_order || raw.sortOrder || 100,
    isPublished: raw.is_published ?? raw.isPublished ?? true,
    createdAt: raw.created_at || raw.createdAt,
  };
}

export function normalizeAdminCohort(raw) {
  if (!raw) return null;
  return {
    id: raw._id || raw.id,
    name: raw.name,
    status: raw.status,
    startDate: raw.start_date || raw.startDate,
    endDate: raw.end_date || raw.endDate,
    durationWeeks: raw.duration_weeks || raw.durationWeeks,
    maxStudents: raw.max_students || raw.maxStudents,
    instructor: raw.instructor,
    schedule: {
      daysPerWeek: raw.schedule?.days_per_week || raw.schedule?.daysPerWeek,
      hoursPerSession: raw.schedule?.hours_per_session || raw.schedule?.hoursPerSession,
      timeSlot: raw.schedule?.time_slot || raw.schedule?.timeSlot,
    },
    enrollmentCount: raw.enrollment_count || raw.enrollmentCount || 0,
    availableSlots: raw.available_slots || raw.availableSlots || 0,
    course: raw.course_id ? {
      id: raw.course_id._id || raw.course_id.id,
      title: raw.course_id.title,
      slug: raw.course_id.slug,
    } : null,
    enrollments: (raw.enrollments || []).map(e => ({
      id: e._id || e.id,
      status: e.status,
      createdAt: e.createdAt,
      user: e.user ? { id: e.user._id || e.user.id, name: e.user.name, email: e.user.email } : null,
    })),
  };
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export const authService = {
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  signup: (data) => request('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),
  verify: () => request('/auth/verify'),
  updateProfile: (data) => request('/auth/profile', { method: 'PATCH', body: JSON.stringify(data) }),
};

// ─── Courses ─────────────────────────────────────────────────────────────────

export const coursesService = {
  list: async () => {
    const data = await staleWhileRevalidate(`${BASE}/courses`);
    return (Array.isArray(data) ? data : []).map(normalizeCourse);
  },
  getBySlug: async (slug) => {
    const data = await staleWhileRevalidate(`${BASE}/courses/slug/${slug}`);
    return normalizeCourse(data);
  },
  getContent: async (slug) => {
    const data = await staleWhileRevalidate(`${BASE}/courses/slug/${slug}/content`);
    return {
      course: normalizeCourse(data.course),
      modules: (data.modules || []).map(normalizeModule),
      access: data.access,
      contentSource: data.contentSource,
    };
  },
  getLesson: async (courseSlug, lessonSlug) => {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
    // Lessons are cached for 30 min — stale-while-revalidate
    const data = await staleWhileRevalidate(
      `${BASE}/courses/slug/${courseSlug}/lessons/${lessonSlug}`,
      { headers }
    );
    return {
      course: normalizeCourse(data.course),
      module: data.module,
      lesson: data.lesson,
      navigation: data.navigation,
      access: data.access,
      contentSource: data.contentSource,
    };
  },
};

// ─── Cohorts ─────────────────────────────────────────────────────────────────

export const cohortsService = {
  getByCourse: (courseId) => request(`/cohorts/course/${courseId}`),
  submitApplication: (payload) => request('/cohorts/applications', { method: 'POST', body: JSON.stringify(payload) }),
  getMyApplications: async () => {
    const data = await request('/cohorts/applications/my');
    return (data.applications || []).map(normalizeCohortApplication);
  },
  enroll: (cohortId) => request(`/cohorts/${cohortId}/enroll`, { method: 'POST' }),
};

// ─── Student ─────────────────────────────────────────────────────────────────

export const studentService = {
  getSelfPacedEnrollments: async () => {
    const data = await request('/student/enrollments/self-paced');
    return (data.enrollments || []).map(normalizeEnrollment);
  },
  enrollSelfPaced: async (payload) => {
    const data = await request('/student/enrollments/self-paced', { method: 'POST', body: JSON.stringify(payload) });
    return { enrollment: normalizeEnrollment(data.enrollment), alreadyEnrolled: data.alreadyEnrolled };
  },
  getCohortEnrollments: () => request('/student/enrollments'),
  getCourseLessonProgress: async (courseSlug) => {
    const data = await request(`/student/lesson-progress/course/${courseSlug}`);
    return { course: data.course, progress: (data.progress || []).map(normalizeLessonProgress) };
  },
  getLessonProgress: async (lessonId) => {
    const data = await request(`/student/lesson-progress/lesson/${lessonId}`);
    return normalizeLessonProgress(data.progress);
  },
  updateLessonProgress: async (lessonId, payload) => {
    const data = await request(`/student/lesson-progress/lesson/${lessonId}`, { method: 'PUT', body: JSON.stringify(payload) });
    return normalizeLessonProgress(data.progress);
  },
  getLessonWhiteboard: async (lessonId) => {
    const data = await request(`/student/whiteboard/lesson/${lessonId}`);
    return data.note;
  },
  saveLessonWhiteboard: async (lessonId, snapshot) => {
    const data = await request(`/student/whiteboard/lesson/${lessonId}`, { method: 'PUT', body: JSON.stringify({ snapshot }) });
    return data.note;
  },
  getCourseNote: async (courseSlug) => {
    const data = await request(`/student/notes/course/${courseSlug}`);
    return data.note;
  },
  saveCourseNote: async (courseSlug, content) => {
    const data = await request(`/student/notes/course/${courseSlug}`, { method: 'PUT', body: JSON.stringify({ content }) });
    return data.note;
  },
  getNotifications: async (limit = 30) => {
    const data = await request(`/student/notifications?limit=${limit}`);
    return { notifications: (data.notifications || []).map(normalizeNotification), unreadCount: data.unreadCount || 0 };
  },
  markNotificationRead: (id) => request(`/student/notifications/${id}/read`, { method: 'PATCH' }),
  markAllNotificationsRead: () => request('/student/notifications/read-all', { method: 'PATCH' }),
  getCertificates: async () => {
    const data = await request('/student/certificates');
    return (data.certificates || []).map(normalizeCertificate);
  },
  getPayments: async () => {
    const data = await request('/student/payments');
    return { payments: (data.payments || []).map(normalizePayment), pricing: data.pricing, instructions: data.instructions };
  },
  initiatePayment: async (payload) => {
    const data = await request('/student/payments/initiate', { method: 'POST', body: JSON.stringify(payload) });
    return { payment: normalizePayment(data.payment), authorizationUrl: data.authorization_url, instructions: data.instructions, pricing: data.pricing };
  },
  submitPaymentProof: async (paymentId, payload) => {
    const data = await request(`/student/payments/${paymentId}/proof`, { method: 'PATCH', body: JSON.stringify(payload) });
    return normalizePayment(data.payment);
  },
  updateInterests: (interestedCourses) => request('/student/interests', { method: 'PATCH', body: JSON.stringify({ interestedCourses }) }),
  getDashboardSummary: () => request('/student/dashboard-summary'),
  getMyApplications: async () => {
    const data = await request('/cohorts/applications/my');
    return (data.applications || []).map(normalizeCohortApplication);
  },
  getCourseAssessments: (courseSlug) => request(`/student/courses/${courseSlug}/assessments`),
  submitAssessment: (assessmentId, answers) => request(`/student/assessments/${assessmentId}/submissions`, { method: 'POST', body: JSON.stringify({ answers }) }),
  getSubmissions: (params = '') => request(`/student/submissions${params ? '?' + params : ''}`),
  getCourseMaterials: (courseSlug) => request(`/student/materials/course/${courseSlug}`),
};

// ─── Certificates ─────────────────────────────────────────────────────────────

export const certificatesService = {
  verify: async (certificateNumber) => {
    const num = encodeURIComponent(String(certificateNumber || '').trim());
    const data = await request(`/certificates/verify/${num}`);
    return { verified: data.verified, message: data.message, certificate: normalizeCertificate(data.certificate) };
  },
};

// ─── Admin ────────────────────────────────────────────────────────────────────

export const adminService = {
  getOverview: () => request('/admin/overview'),
  getStudents: async () => {
    const data = await request('/admin/students');
    return data.students || [];
  },
  getCourses: async () => {
    const data = await request('/admin/courses');
    return (data.courses || []).map(normalizeAdminCourse);
  },
  createCourse: (payload) => request('/admin/courses', { method: 'POST', body: JSON.stringify(payload) }),
  updateCourse: (id, payload) => request(`/admin/courses/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  unpublishCourse: (id) => request(`/admin/courses/${id}`, { method: 'DELETE' }),
  publishCourse: (id) => request(`/admin/courses/${id}/publish`, { method: 'POST' }),
  getCohorts: async () => {
    const data = await request('/admin/cohorts');
    return (data.cohorts || []).map(normalizeAdminCohort);
  },
  createCohort: (payload) => request('/admin/cohorts', { method: 'POST', body: JSON.stringify(payload) }),
  updateCohort: (id, payload) => request(`/admin/cohorts/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  enrollStudent: (cohortId, payload) => request(`/admin/cohorts/${cohortId}/enroll`, { method: 'POST', body: JSON.stringify(payload) }),
  updateEnrollment: (id, status) => request(`/admin/enrollments/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  getCohortApplications: async () => {
    const data = await request('/admin/cohort-applications');
    return (data.applications || []).map(normalizeCohortApplication);
  },
  updateCohortApplication: (id, payload) => request(`/admin/cohort-applications/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  getPayments: async () => {
    const data = await request('/admin/payments');
    return (data.payments || []).map(normalizePayment);
  },
  updatePayment: (id, payload) => request(`/admin/payments/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  getCertificates: async () => {
    const data = await request('/admin/certificates');
    return (data.certificates || []).map(normalizeCertificate);
  },
  issueCertificate: (enrollmentId) => request('/admin/certificates', { method: 'POST', body: JSON.stringify({ enrollmentId }) }),
  createAnnouncement: (payload) => request('/admin/announcements', { method: 'POST', body: JSON.stringify(payload) }),
  getAnnouncements: async (params = '') => {
    const data = await request(`/admin/announcements${params ? '?' + params : ''}`);
    return data.announcements || [];
  },
  updateAnnouncement: (id, payload) => request(`/admin/announcements/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deleteAnnouncement: (id) => request(`/admin/announcements/${id}`, { method: 'DELETE' }),
  syncCourseContent: (courseId) => request(`/admin/courses/${courseId}/sync-content`, { method: 'POST' }),
  getModules: async (courseId) => {
    const data = await request(`/admin/courses/${courseId}/modules`);
    return data.modules || [];
  },
  createModule: (courseId, payload) => request(`/admin/courses/${courseId}/modules`, { method: 'POST', body: JSON.stringify(payload) }),
  updateModule: (moduleId, payload) => request(`/admin/modules/${moduleId}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deleteModule: (moduleId) => request(`/admin/modules/${moduleId}`, { method: 'DELETE' }),
  getLessons: async (moduleId) => {
    const data = await request(`/admin/modules/${moduleId}/lessons`);
    return data.lessons || [];
  },
  createLesson: (moduleId, payload) => request(`/admin/modules/${moduleId}/lessons`, { method: 'POST', body: JSON.stringify(payload) }),
  updateLesson: (lessonId, payload) => request(`/admin/lessons/${lessonId}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deleteLesson: (lessonId) => request(`/admin/lessons/${lessonId}`, { method: 'DELETE' }),
  getCourseAssessments: async (courseId) => {
    const data = await request(`/admin/courses/${courseId}/assessments`);
    return data.assessments || [];
  },
  createAssessment: (courseId, payload) => request(`/admin/courses/${courseId}/assessments`, { method: 'POST', body: JSON.stringify(payload) }),
  updateAssessment: (assessmentId, payload) => request(`/admin/assessments/${assessmentId}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deleteAssessment: (assessmentId) => request(`/admin/assessments/${assessmentId}`, { method: 'DELETE' }),
  getSubmissions: async (assessmentId) => {
    const data = await request(`/admin/assessments/${assessmentId}/submissions`);
    return { assessment: data.assessment, submissions: data.submissions || [] };
  },
  gradeSubmission: (submissionId, payload) => request(`/admin/submissions/${submissionId}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  getMaterials: async (params = '') => {
    const data = await request(`/admin/materials${params ? '?' + params : ''}`);
    return data.materials || [];
  },
  updateMaterial: (id, payload) => request(`/admin/materials/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deleteMaterial: (id) => request(`/admin/materials/${id}`, { method: 'DELETE' }),
};
