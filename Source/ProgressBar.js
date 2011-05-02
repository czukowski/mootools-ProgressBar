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
		boxClass: 'progress-bar-box',
		percentageClass: 'progress-bar-percentage',
		displayClass: 'progress-bar-display',
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
		this.box = new Element('div.'+this.options.boxClass).inject(this.options.container);
		this.percentage = new Element('div.'+this.options.percentageClass+'[style="width:0"]').inject(this.box);
		if (this.options.displayText) { 
			this.display = new Element('div.'+this.options.displayClass).inject(this.options.container);
		}
		this.set(this.options.startPercentage);
	},

	// Initialization
	initialize: function(options) {
		// Set options
		this.setOptions(options);
		// Quick container
		this.options.container = document.id(this.options.container);
		// Create elements
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