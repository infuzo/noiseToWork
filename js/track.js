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

//todo: use consts for classes and ids
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

	var volumeLineNode = document.querySelector("#" + track.idOfHtmlControll + " ." + "volumeLine");
	//Don't play or stop sound when user clicks on volume bar
	volumeLineNode.addEventListener("click", (e) => e.stopPropagation());

	var volumeCircleNode = document.querySelector("#" + track.idOfHtmlControll + " ." + "volumeCircle");
	volumeCircleNode.style.left = Math.round(maxVolumeCircleStyleLeft * track.audioFile.volume) + "px";

	volumeLineNode.addEventListener("mousedown", (e) => {
		track.changingVolume = true;
		track.startPositionX = e.clientX;
		track.startCircleLeft = parseInt(volumeCircleNode.style.left);
	});
	volumeLineNode.addEventListener("mouseup", () => { track.changingVolume = false; });
	volumeLineNode.addEventListener("mouseleave", () => { track.changingVolume = false; });

	volumeLineNode.addEventListener("mousemove", (e) => changingVolumeByControl(e, track));
}

function changingVolumeByControl(event, track) {
	if (track.changingVolume) {
		var circle = document.querySelector("#" + track.idOfHtmlControll + " ." + "volumeCircle"); //todo: cache to track object

		var newLeft = track.startCircleLeft + (event.clientX - track.startPositionX);
		if (newLeft < 0) { newLeft = 0; }
		if (newLeft > maxVolumeCircleStyleLeft) { newLeft = maxVolumeCircleStyleLeft; }
		circle.style.left = (newLeft) + "px";

		var newVolume = newLeft / maxVolumeCircleStyleLeft;
		track.changeVolume(newVolume);
	}
}