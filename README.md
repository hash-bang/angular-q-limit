angular-q-limit
===============
Adds `$q.allLimit()` method to Angular which allows `$q.all()` batching.

One of my biggest gripes with the [Angular $q](https://github.com/angular/angular.js/blob/v1.5.8/src/ng/q.js) implementation is if you have a **lot** of Promises to resolve these can quickly overwhelm the Browser / Server.

This module adds the `$q.allLimit()` function which provides the same functionality as the regular `$q.all()` function but only allows a limited number of Promises to run at once.

**NOTES**:

* Unless otherwise specified the default limit for `.allLimit()` calls is 1.
* The limit number can be anywhere within the list of promises. e.g. `$q.allLimit(3, promises...)` or `$q.allLimit(promises..., 3)`
* This module will also fire a progress notification if you need to monitor how many promises have completed


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


Examples
========
Each of the following examples assumes `SomeModel` is a Promise based structure like [$http](https://docs.angularjs.org/api/ng/service/$http) or [ngResource](https://docs.angularjs.org/api/ngResource/service/$resource). Each of these would perform some time consuming task like transmitting large quantities of data to or from the server.


Defined promises
----------------
This example runs 3 defined promise limited to 1 item of concurrency. The example shown only lists three promises but this can be extended indefinitely with the guarantee that only 2 items can run at once.

```javascript
// Load different models and set $scope.data{1,2,3} to the return value
// Only allow two Promises to run at once

$q.limitAll(2, [

	function() {
		return SomeModel1.query().$promise
			.then(data => $scope.data1 = data);
	},
	function() {
		return SomeModel2.query().$promise
			.then(data => $scope.data2 = data);
	},
	function() {
		return SomeModel3.query().$promise
			.then(data => $scope.data3 = data);
	},

	// More promises here ...

]).then(function() { // All done // }});
```

Dynamic promise creation
------------------------
This example uses a dynamic array of items, creating a promise for each and finally executing them via `$q.limitAll()` with a maximum of 3 items running concurrently.

```javascript
var stuff = [ // Very big array of IDs to request // ];

$q.limitAll(3,
	stuff.map(function(item) {
		return SomeModel.get({id: item}).$promise;
	}),
});
 ```
