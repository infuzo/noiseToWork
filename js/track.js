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
	var controlNode = document.getElementById(track.idOfHtmlControll);

	controlNode.addEventListener("click", function (event) {
		if (track.isPlaying) {
			track.stop();
			document.getElementById(track.idOfHtmlControll).className = "oneTrackControllDisabled";
		}
		else {
			track.play();
			document.getElementById(track.idOfHtmlControll).className = "oneTrackControllEnabled";
		}
	});

	//Don't play or stop sound when user clicks on volume bar
	for (var i = 0; i < controlNode.childNodes.length; i++)
	{
		var node = controlNode.childNodes[i];
		if (node.className == "volumeLine" || node.className == "volumeCircle") {
			node.addEventListener("click", (e) => e.stopPropagation());
		}
	}
}