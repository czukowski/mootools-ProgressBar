/*
---
description:     ProgressBar

authors:
  - David Walsh (http://davidwalsh.name)

license:
  - MIT-style license

requires:
  core/1.3.1:   '*'
  more/1.3.2.1: 'Fx.*'

provides:
  - ProgressBar
...
*/
var ProgressBar = new Class({

	// Implements
	Implements: [Events, Options],

	// Options
	options: {
		container: document.body,
		boxID: 'progress-bar-box-id',
		percentageID: 'progress-bar-percentage-id',
		displayID: 'progress-bar-display-id',
		startPercentage: 0,
		displayText: false,
		speed: 10,
		step: 1,
		allowMore: false/*,
		onComplete: $empty,
		onChange: $empty*/
	},

	// Animates the change in percentage
	animate: function(go) {
		var self = this;
		if ( ! self.options.allowMore && go > 100) go = 100;
		self.to = go.toInt();
		this.percentage.set('morph', { 
			duration: this.options.speed,
			link: 'cancel',
			onComplete: function() {
				self.fireEvent('change', [self.to]);
				if (go >= 100) {
					self.fireEvent('complete', [self.to]);
				}
			}
		}).morph({
			width: self.calculate(go)
		});
		if (self.options.displayText) {
			this.display.set('text', self.to+'%'); 
		}
	},

	// Calculates width in pixels from percentage
	calculate: function(percentage) {
		return (this.box.getStyle('width').replace('px', '') * (percentage / 100)).toInt();
	},

	// Creates the box and percentage elements
	createElements: function() {
		this.box = new Element('div#'+this.options.boxID).inject(this.options.container);
		this.percentage = new Element('div#'+this.options.percentageID+'[style="width:0"]').inject(this.box);
		if (this.options.displayText) { 
			this.display = new Element('div#'+this.options.displayID).inject(this.options.container);
		}
		this.set(this.options.startPercentage);
	},

	// Initialization
	initialize: function(options) {
		//set options
		this.setOptions(options);
		//quick container
		this.options.container = document.id(this.options.container);
		//create elements
		this.createElements();
	},

	// Sets the percentage from its current state to desired percentage
	set: function(to) {
		this.animate(to);
	},

	// Steps a pre-determined percentage
	step: function() {
		this.set(this.to + this.options.step);
	}

});