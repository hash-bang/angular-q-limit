angular.module('angular-q-limit', [])
.config(['$provide', function($provide) {
	$provide.decorator('$q', ['$delegate', function($delegate) {

		/**
		* Execute $q.all() with limits
		*
		* @name $q.allLimit()
		* @fires resolve Resolved will receive an array of all completed promise values
		* @fires reject Reject will return with the first error of the first failed promise
		* @fires progress Progress will be of the form `{completed: Number, count: Number, limit: Number}`
		* @param {number} [limit=1] The maximum number of promises to run at once
		* @return {Promise} The outer promise of the all() resolver
		*/
		$delegate.allLimit = function() {
			var limit = 1; // Set the initial limit

			// Prepare list of promises we should process - also extract any numbers from the list as the limit to use {{{
			var promises = _(arguments)
				.filter(function(arg) {
					var isLimit = _.isNumber(arg);
					if (isLimit) limit = arg;
					return !isLimit;
				})
				.flatten()
				.value();
			// }}}

			var defer = $delegate.defer();
			var promiseChecker = function(queue) {
				if (!queue.promisesRemaining.length && queue.running == 0) return queue.defer.resolve(_(queue.output).map().value());

				while (queue.promisesRemaining.length > 0 && queue.running < queue.limit) {
					var promiseRunner = function(thisPromise, promiseIndex) {
						queue.running++;
						$delegate.resolve(thisPromise())
							.then(function(data) {
								queue.output[promiseIndex] = data;
								queue.completed++;
								queue.running--;
								queue.defer.notify({completed: queue.completed, count: queue.promiseCount, limit: queue.limit});
								promiseChecker(queue);
							})
							.catch(function(err) {
								queue.defer.reject(err);
							});
					}(queue.promisesRemaining.shift(), queue.promiseIndex++);
				}
			};

			promiseChecker({
				limit: limit,
				running: 0,
				promiseCount: promises.length,
				completed: 0,
				defer: defer,
				promisesRemaining: promises,
				output: [],
				promiseIndex: 0,
			});

			return defer.promise;
		};

		return $delegate;
	}]);
}]);
