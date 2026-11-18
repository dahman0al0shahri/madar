// Compose maintained hosted course views with the existing course-specific engines.
function createHostedCourseAdapter() {
  return createHostedCourseViews({ courses, lessons, canLesson,
    getBoot: () => boot, getRoute: () => state.route, heading, esc, lessonRows,
    osSection, osLessonPage, networkPracticalIndex, networkSelfTestPage, networkTheoryIndex,
    networkReference: () => networkReference(), theoryLessonPage,
    hintHistory: () => hintHistoryMarkup });
}
