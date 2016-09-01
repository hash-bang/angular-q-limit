angular-q-limit
===============
Adds `$q.allLimit()` method to Angular which allows `$q.all()` batching.

One of my biggest gripes with the [Angular $q](https://github.com/angular/angular.js/blob/v1.5.8/src/ng/q.js) implementation is if you have a **lot** of Promises to resolve these can quickly overwhelm the Browser / Server.

This module adds the `$q.allLimit()` function which provides the same functionality as the regular `$q.all()` function but only allows a limited number of Promises to run at once.


Install
=======
1. Add a reference to the script somewhere in your HTML:

```html
<script src="/vendors/angular-q-limit/angular-q-limit.js"></script>
```


2. Then add the module to your Angular header file:

```javascript
var app = angular.module('app', [
	'angular-q-limit',
]);
```


3. You can now use the limiter in code as part of the regular `$q` library:

```javascript
app.controller(function($scope, $q) {

	// Run lots of things but only 3 at a time
	$q.allLimit(3, [
		// Lots of promises here ///
	])
		.then(function(data) {
			// Done!
		}, function(err) {
			// One promise died!
		}, function(progress) {
			// Progress updates! (progress will equal {completed: Number, count: Number, limit: Number})
		});

});
```
