const allCourses = [
  ...(typeof digitalPaintingCourses !== "undefined" ? digitalPaintingCourses : []),
  ...(typeof procreateCourses !== "undefined" ? procreateCourses : []),
  ...(typeof zbrushCourses !== "undefined" ? zbrushCourses : []),
  ...(typeof illustratorCourses !== "undefined" ? illustratorCourses : []),
  ...(typeof photoshopCourses !== "undefined" ? photoshopCourses : []),
  ...(typeof adobePremiereCourses !== "undefined" ? adobePremiereCourses : []),
  ...(typeof afterEffectsCourses !== "undefined" ? afterEffectsCourses : []),
  ...(typeof davinciResolveCourses !== "undefined" ? davinciResolveCourses : []),
  ...(typeof houdiniCourses !== "undefined" ? houdiniCourses : []),
  ...(typeof blenderCourses !== "undefined" ? blenderCourses : []),
  ...(typeof mayaCourses !== "undefined" ? mayaCourses : []),
  ...(typeof threeDsMaxCourses !== "undefined" ? threeDsMaxCourses : []),
  ...(typeof motionAnimationCourses !== "undefined" ? motionAnimationCourses : []),
  ...(typeof unrealEngineCourses !== "undefined" ? unrealEngineCourses : []),
  ...(typeof uxUiFigmaCourses !== "undefined" ? uxUiFigmaCourses : []),
  ...(typeof artDrawingCourses !== "undefined" ? artDrawingCourses : [])
];

console.log("Tổng số khóa học:", allCourses.length);