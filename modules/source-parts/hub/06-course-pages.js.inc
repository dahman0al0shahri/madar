  /* hub:course-support:start */
  /* hub:course-support:end */
  const courseViews = createCourseViews({ courses, lessons, profile, lessonBy, canLesson, esc, icon,
    carouselMarkup, officeArt, networkArt, osCourseArt: () => osCourseArt(), osHome: () => osHome(),
    networkReviewCard: () => networkReviewCard(), integrations: {
      ...(environment.hosted ? { courseSection: (id, section) => hostedCourseViews.courseSection(id, section),
        lessonPage: lesson => hostedCourseViews.lessonPage(lesson) } : {}) } });
  const { lessonPosition, resume, about, heading, courseCard, courseHome, lessonRows, courseSection, lessonPage } = courseViews;
  const hostedCourseViews = environment.hosted ? createHostedCourseAdapter() : null;
