window.isUpdateAvailable = new Promise(function (resolve, reject) {
	if ('serviceWorker' in navigator && ['localhost', '127'].indexOf(location.hostname) === -1) {
		// if ('caches' in window) {
		// 	caches.keys()
		// 	.then(function(keyList) {
		// 		return Promise.all(keyList.map(function(key) {
		// 			return caches.delete(key);
		// 		}));
		// 	})
		// }
		navigator.serviceWorker.register('/ngsw-worker.js', {updateViaCache: 'none'})
			.then(reg => {
				console.log(reg);
				reg.onupdatefound = () => {
					const installingWorker = reg.installing;
					installingWorker.onstatechange = () => {
						switch (installingWorker.state) {
							case 'installed':
								if (navigator.serviceWorker.controller) {
									console.log('New update available');
									resolve(true);
								} else {
									console.log('No update available');
									resolve(false);
								}
								break;
						}
					};
				};
			})
			.catch(err => console.error('[SW ERROR]', err));
	}
});
window['isUpdateAvailable']
.then(isAvailable => {
	if (isAvailable) {
		console.log('New update available Yes');
	}
});