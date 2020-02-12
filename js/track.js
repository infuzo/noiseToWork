"use strict";

const maxTimeToResetAudioPlayingTime = .44;

function prepareAudioWithoutGaps(pathToFile) {
	var audioFile = new Audio(pathToFile);
	audioFile.addEventListener('timeupdate', function () {
		if (this.currentTime > this.duration - maxTimeToResetAudioPlayingTime) {
			this.currentTime = 0;
			this.play();
		}
	}, false);
	audioFile.load();
	return audioFile;
}

class Track {
	constructor(pathToFile, idOfHtmlControll, defaultVolue = 1.0) {
		this.audioFile = prepareAudioWithoutGaps(pathToFile);
		this.idOfHtmlControll = idOfHtmlControll;
		this.isPlaying = false;

		this.changeVolume(defaultVolue);
		bindUserControlls(this);
	}

	play() {
		this.audioFile.play();
		this.isPlaying = true;
	}

	stop() {
		this.audioFile.pause();
		this.isPlaying = false;
	}

	changeVolume(newVolume) {
		this.audioFile.volume = newVolume;
	}
}

function bindUserControlls(track) {
	document.getElementById(track.idOfHtmlControll).addEventListener("click", function (event) {
		console.log(event.target.className);
		if (track.isPlaying) {
			track.stop();
			document.getElementById(track.idOfHtmlControll).className = "oneTrackControllDisabled";
		}
		else {
			track.play();
			document.getElementById(track.idOfHtmlControll).className = "oneTrackControllEnabled";
		}
	});
}