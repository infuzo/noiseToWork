"use strict";

const maxTimeToResetAudioPlayingTime = .44;
const maxVolumeCircleStyleLeft = 90;

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
	constructor(pathToFile, idOfHtmlControll, defaultVolume = 1.0) {
		this.audioFile = prepareAudioWithoutGaps(pathToFile);
		this.idOfHtmlControll = idOfHtmlControll;
		this.isPlaying = false;

		this.changingVolume = false;

		this.startPositionX = 0;
		this.startCircleLeft = 0;

		this.changeVolume(defaultVolume);
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

//todo: use consts for classes and ids; Separate method
function bindUserControlls(track) {
	var controlNode = document.getElementById(track.idOfHtmlControll);

	controlNode.addEventListener("click", function (event) {
		if (track.changingVolume) { return; } 

		if (track.isPlaying) {
			track.stop();
			document.getElementById(track.idOfHtmlControll).className = "oneTrackControllDisabled"; 
		}
		else {
			track.play();
			document.getElementById(track.idOfHtmlControll).className = "oneTrackControllEnabled";
		}
	});

	var volumeLineNode = document.querySelector("#" + track.idOfHtmlControll + " ." + "volumeLine");
	//Don't play or stop sound when user clicks on volume bar
	volumeLineNode.addEventListener("click", e => e.stopPropagation());

	volumeLineNode.addEventListener("mousedown", (e) => {
		changeVolumeAndSetCirclePosition(track, e.clientX - volumeLineNode.getBoundingClientRect().left);
		e.stopPropagation();
	});

	var volumeCircleNode = document.querySelector("#" + track.idOfHtmlControll + " ." + "volumeCircle");
	volumeCircleNode.style.left = Math.round(maxVolumeCircleStyleLeft * track.audioFile.volume) + "px";

	volumeCircleNode.addEventListener("click", (e) => e.stopPropagation());

	volumeCircleNode.addEventListener("mousedown", (e) => {
		track.changingVolume = true;
		track.startPositionX = e.screenX;
		track.startCircleLeft = parseInt(volumeCircleNode.style.left);
		e.stopPropagation();
	});
	volumeCircleNode.addEventListener("mouseup", (e) => {
		track.changingVolume = false;
		e.stopPropagation();
	});

	controlNode.addEventListener("mouseleave", () => track.changingVolume = false);
	controlNode.addEventListener("mouseup", () => {
		setTimeout(() => track.changingVolume = false, 50);	//Timeout needs to prevent playing or pausing sound when user releases mouse button
	});

	controlNode.addEventListener("mousemove", (e) => {
		if (track.changeVolume) {
			changingVolumeByControl(e, track);
		}
	});
}

function changingVolumeByControl(event, track) {
	if (track.changingVolume) {
		changeVolumeAndSetCirclePosition(track, track.startCircleLeft + (event.screenX - track.startPositionX));
	}
}

function changeVolumeAndSetCirclePosition(track, position) {
	var circle = document.querySelector("#" + track.idOfHtmlControll + " ." + "volumeCircle"); //todo: cache to track object

	if (position < 0) { position = 0; }
	if (position > maxVolumeCircleStyleLeft) { position = maxVolumeCircleStyleLeft; }
	circle.style.left = (position) + "px";

	var newVolume = position / maxVolumeCircleStyleLeft;
	track.changeVolume(newVolume);
}