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
	constructor(pathToFile, idOfHtmlControll) {
		this.audioFile = prepareAudioWithoutGaps(pathToFile);
		this.idOfHtmlControll = idOfHtmlControll;
		this.isPlaying = false;

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
}

function bindUserControlls(track) {
	document.getElementById(track.idOfHtmlControll).addEventListener("click", function (event) {
		if (track.isPlaying) {
			track.stop();
			event.target.className = "oneTrackControllDisabled";
		}
		else {
			track.play();
			event.target.className = "oneTrackControllEnabled";
		}
	});
}