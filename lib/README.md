### Interface

Clever Goals tracks two metrics per app - a usage metric (which is always minutes) and a progress metric (which varies from app to app, but is often something like lessons or activities completed). Work with our team to decide what these metrics will be.

The client library provides methods to record usage and progress, both incremental (e.g. the student just worked for 5 minutes) and cumulative (e.g. the student has worked for 500 minutes since the beginning of the school year). You should decide on one and only way to track each metric - either incrementally or cumulatively.

If you're starting from scratch, we recommend using `startTrackingUsage()` to track incremental usage and `recordIncrementalProgress()` to track incremental progress.

#### startTrackingUsage()

Begins time tracking for the current student. This should be called on every new page load. When you call `startTrackingUsage()`, the client will begin tracking the time that the student is actively engaged with the page, reporting it to the Clever Goals API every 10 seconds. A student is considered idle (i.e. not actively engaged) if they don't move the mouse or type for 60 seconds, or if they switch to a different tab or app.

#### reportIncrementalUsage(value)

This method is used to track incremental periods of time that the student is engaged with the app. It's used internally by `startTrackingUsage()`. We only recommend using this method if you have existing time tracking hooks in place in your app, and would like to record those values to Clever Goals in addition to your own backend.

- `value` - number - the number of new minutes that the student was just engaged
- Returns a Promise that resolves to nothing but will reject with any errors.

Example:

```js
function handleTimeTrack(seconds, cb) {
  goals.reportIncrementalUsage(seconds/60).then(cb).catch(cb);
}
```

#### reportIncrementalProgress(value)

This method is used to track incremental lessons/activities/etc. that the student completes. You should call this method after a student completes a unit of progress.

- `value` - number - the number of new lessons/activities/etc. that the student just completed
- Returns a Promise that resolves to nothing but will reject with any errors.

Example:

```js
function onLessonComplete(cb) {
  goals.reportIncrementalProgress(1).then(cb).catch(cb);
}
```

#### reportCumulativeUsage(value)

This method is used to track the overall amount of time the student has been engaged. You should call this method at a regular interval or once at the end of the user's session. Be wary that the user might not end their session cleanly, so this might not be the best strategy.

- `value` - number - the number of minutes that the student has been engaged since the beginning of the school year
- Returns a Promise that resolves to nothing but will reject with any errors.

Example:

```js
setInterval(10000, () => {
  lookupUsageFromDB((err, minutes) =>
    if (err) { return handleErr(err); }
    goals.reportCumulativeUsage(minutes).catch(handleErr);
  );
});
```

#### reportCumulativeProgress(value)

This method is used to track the overall amount of progress the student has made. You should call this method at a regular interval or once at the end of the user's session. Be wary that the user might not end their session cleanly, so this might not be the best strategy.

- `value` - number - the number of lessons/activities/etc. that the student has completed since the beginning of the school year
- Returns a Promise that resolves to nothing but will reject with any errors.

Example:

```js
setInterval(10000, () => {
  lookupLessonsFromDB((err, lessons) =>
    if (err) { return handleErr(err); }
    goals.reportCumulativeProgress(lessons.length).catch(handleErr);
  );
});
```
