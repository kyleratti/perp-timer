'use strict';

function currentTimestamp() {
    return Math.floor(Date.now() / 1000);
}

function DrugTimer(objDisplayElement, iRunTime) {
    this.m_objDisplayElement = objDisplayElement;
    this.m_iRunTime = iRunTime;
    this.m_iEndTime = null;
    this.m_objAudio = new Audio("./assets/sound/clock-alarm1.wav");

    this.doSetup();
}

DrugTimer.prototype.updateTime = function() {
    if(this.isRunning()) {
        var iDifference = this.getTimeRemaining();

        if(iDifference <= 0) {
            this.m_objMinutes.text("00");
            this.m_objSeconds.text("00");
        } else {
            var iMinutes = Math.floor(iDifference / 60);
            var iSeconds = iDifference % 60;

            this.m_objMinutes.text(iMinutes < 10 ? "0" + iMinutes : iMinutes);
            this.m_objSeconds.text(iSeconds < 10 ? "0" + iSeconds : iSeconds);
        }
    } else {
        this.m_objMinutes.text(this.m_iRunTime < 10 ? "0" + this.m_iRunTime : this.m_iRunTime);
        this.m_objSeconds.text("00");
    }
}

DrugTimer.prototype.doThink = function() {
    this.updateTime();

    if(this.isRunning() && this.isGoingOff()) {
            if(this.getTimeRemaining() <= -30)
                this.reset();
            else
                this.playAlert();
    }
}

DrugTimer.prototype.playAlert = function() {
    this.m_objAudio.play();
}

DrugTimer.prototype.doSetup = function() {
    var objThis = $(this.m_objDisplayElement);
    var objToggle = $(".drugs-toggle", objThis);

    var _self = this;

    objToggle.click(function() {
        if(_self.isRunning()) {
            objToggle.text('Start');
            _self.stop();
        } else {
            objToggle.text("Stop");
            _self.start();
        }
    });

    objToggle.text("Start");

    this.m_objMinutes = $(".minutes", objThis);
    this.m_objSeconds = $(".seconds", objThis);

    this.updateTime();
}

DrugTimer.prototype.getTimeRemaining = function() {
    return this.m_iEndTime - currentTimestamp();
}

DrugTimer.prototype.getRunTime = function() {
    return this.m_iRunTime;
}

DrugTimer.prototype.start = function() {
    this.m_iEndTime = currentTimestamp() + (this.m_iRunTime * 60);
    this.doThink();
}

DrugTimer.prototype.stop = function() {
    this.m_iEndTime = null;
    this.m_objAudio.pause();
    this.m_objAudio.currentTime = 0;
    this.doThink();
}

DrugTimer.prototype.reset = function() {
    this.stop();
    this.start();
}

DrugTimer.prototype.isRunning = function() {
    return this.m_iEndTime != null;
}

DrugTimer.prototype.isGoingOff = function() {
    return this.m_iEndTime && this.m_iEndTime - currentTimestamp() <= 0;
}

$(function() {
    var objWeed = $("#weed-timer");
    var objShrooms = $("#shrooms-timer");

    var objWeedTimer = new DrugTimer(objWeed, 15);
    var objShroomTimer = new DrugTimer(objShrooms, 4);

    setInterval(function() { objWeedTimer.doThink(); }, 500);
    setInterval(function() { objShroomTimer.doThink(); }, 500);
});
