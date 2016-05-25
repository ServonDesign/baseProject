import jQuery from "./../vendor/jquery/dist/jquery";

(function rdSlickIFFE(factory, $){

	if ( typeof exports === 'object' ) {
        // Node/CommonJS
        module.exports = factory($);
    } else {
        // Browser globals
        window.noUiSlider = factory($);
    }

})(function($){
	"use strict";

	//added new classes
	// slick-slide-lazy
	// slick-slide-lazy-loading

	//can potentially add in scroll to top of slider on hash handle

	//need to add
	// last
	// first
	//can specify where to put dots and can specify how dots are built, can use for pagination
	// can create a build/update pangnation function

	//try adding on hover arrow, peak at next slide
	//thinking about arrows to go between case studies

	var instanceUid = 0;

	var buildActions = {
		buildRows: function(){
			var newSlides,
				numOfSlides,
				originalSlides,
				slidesPerSection;

	        newSlides = document.createDocumentFragment();
	        originalSlides = this.$slider.children();

	        if(this.options.rows > 1){

	            slidesPerSection = this.options.slidesPerRow * this.options.rows;

	            numOfSlides = Math.ceil(originalSlides.length / slidesPerSection);

	            for(var aIndex = 0; aIndex < numOfSlides; aIndex++){
	                var slide = document.createElement('div');

	                for(var bIndex = 0; bIndex < this.options.rows; bIndex++) {
	                    var row = document.createElement('div');

	                    for(var cIndex = 0; cIndex < this.options.slidesPerRow; cIndex++) {
	                        var target = (aIndex * slidesPerSection + ((bIndex * this.options.slidesPerRow) + cIndex));

	                        if(originalSlides.get(target)){
	                            row.appendChild(originalSlides.get(target));
	                        }
	                    }
	                    slide.appendChild(row);
	                }
	                newSlides.appendChild(slide);
	            }

	            this.$slider.html(newSlides);
	            this.$slider.children().children().children()
	                .css({
	                    'width':(100 / this.options.slidesPerRow) + '%',
	                    'display': 'inline-block'
	                });
	        }
		},

		buildOut: function(){
			this.$slides = this.$slider
	                .children( this.options.slide + ':not(.slick-cloned)')
	                .addClass('slick-slide');

	        this.slideCount = this.$slides.length;

	        this.$slides.each(function(index, element) {
	            $(element)
	                .attr('data-slick-index', index)
	                .data('originalStyling', $(element).attr('style') || '');

	            if($(element).data(this.options.lazyLoadData)){
	            	$(element).addClass('slick-slide-lazy');
	            }
	        }.bind(this));

	        this.$slider.addClass('slick-slider');

	        this.$slideTrack = (this.slideCount === 0) ?
	            $('<div class="slick-track"/>').appendTo(this.$slider) :
	            this.$slides.wrapAll('<div class="slick-track"/>').parent();

	        this.$list = this.$slideTrack.wrap('<div class="slick-list"/>').parent();
	        this.$slideTrack.css('opacity', 0);

	        if(this.options.swipeToSlide === true){
	            this.options.slidesToScroll = 1;
	        }

	        this.setupInfinite();
	        this.buildArrows();
	        this.buildDots();
	        this.buildPagination();
	        this.updateDots();
	        this.updatePagination();

	        this.setSlideClasses(typeof this.currentSlide === 'number' ? this.currentSlide : 0);

	        if(this.options.draggable === true){
	            this.$list.addClass('draggable');
	        }
		},

		setupInfinite: function(){
			var slideIndex,
				infiniteCount;

	        if(this.options.infinite === true && this.options.fade === false){
	            slideIndex = null;

	            if(this.slideCount > this.options.slidesToShow){

	                infiniteCount = this.options.slidesToShow;

	                var i;
	                for(i = this.slideCount; i > (this.slideCount - infiniteCount); i -= 1){
	                    slideIndex = i - 1;

	                    $(this.$slides[slideIndex])
	                    	.clone(true)
	                    	.attr('id', '')
	                        .attr('data-slick-index', slideIndex - this.slideCount)
	                        .prependTo(this.$slideTrack).addClass('slick-cloned');
	                }

	                for(i = 0; i < infiniteCount; i += 1){
	                    slideIndex = i;

	                    $(this.$slides[slideIndex])
	                    	.clone(true)
	                    	.attr('id', '')
	                        .attr('data-slick-index', slideIndex + this.slideCount)
	                        .appendTo(this.$slideTrack).addClass('slick-cloned');
	                }

	                this.$slideTrack.find('.slick-cloned').find('[id]').each(function() {
	                    $(this).attr('id', '');
	                });
	            }
	        }
		},

		buildArrows: function(){
			if(this.options.arrows === true){
	            this.$prevArrow = $(this.options.prevArrow).addClass('slick-arrow');
	            this.$nextArrow = $(this.options.nextArrow).addClass('slick-arrow');

	            if(this.slideCount > this.options.slidesToShow) {
	                this.$prevArrow.removeClass('slick-hidden');
	                this.$nextArrow.removeClass('slick-hidden');

	                if(this.htmlExpr.test(this.options.prevArrow)){
	                    this.$prevArrow.prependTo(this.options.appendArrows);
	                }

	                if(this.htmlExpr.test(this.options.nextArrow)){
	                    this.$nextArrow.appendTo(this.options.appendArrows);
	                }

	                if(this.options.infinite !== true){
	                    this.$prevArrow.addClass('slick-disabled');
	                }
	            } else {
	                this.$prevArrow.add(this.$nextArrow).addClass('slick-hidden');
	            }
	        }
		},

		buildDots: function(){
			var dotString;

	        if(this.options.dots === true && this.slideCount > this.options.slidesToShow){
	            dotString = '<ul'; 
	            if(this.options.dotsClass){
					dotString += 'class="' + this.options.dotsClass + '"';
	            }
	            dotString += '>';

	            for(var i = 0; i <= this.getDotCount(); i += 1){
	                dotString += '<li>' + this.options.customPaging.call(this, this, i) + '</li>';
	            }

	            dotString += '</ul>';

	            this.$dots = $(dotString).appendTo(this.options.appendDots);

	            this.$dots.find('li').first().addClass('slick-active');
	        }
		},

		buildPagination: function(){
			var pagString;

	        if(this.options.pagination === true && this.slideCount > this.options.slidesToShow){
	            pagString = '<ul'; 
	            if(this.options.paginationClass){
					pagString += 'class="' + this.options.paginationClass + '"';
	            }
	            pagString += '>';

	            pagString += '<li><button class="slick-pag-first"><svg><use xlink:href="#arrow-left-2" /></svg></button></li>';
	            pagString += '<li><button class="slick-pag-prev"><svg><use xlink:href="#arrow-left" /></svg></button></li>';

	            for(var i = 0; i <= this.getDotCount(); i += 1){
	                pagString += '<li><button data-slick-id-target="'+i+'" class="slick-pag-number">' + (i + 1) + '</button></li>';
	            }

	            pagString += '<li><button class="slick-pag-next"><svg><use xlink:href="#arrow-right" /></svg></button></li>';
	            pagString += '<li><button class="slick-pag-last"><svg><use xlink:href="#arrow-right-2" /></svg></button></li>';
	            

	            pagString += '</ul>';
	            $(this.options.appendPagination).html('');
	            this.$pagination = $(pagString).appendTo(this.options.appendPagination);

	            var paginationObject = {
	            	first: this.$pagination.find('.slick-pag-first'),
	            	prev: this.$pagination.find('.slick-pag-prev'),
	            	next: this.$pagination.find('.slick-pag-next'),
	            	last: this.$pagination.find('.slick-pag-last'),
	            	numbers: this.$pagination.find('.slick-pag-number'),
	            	all: this.$pagination
	            };
	            this.$pagination = paginationObject;
	            this.$pagination.numbers.first().parent('li').addClass('slick-active');
	        }
		},

		setProps: function(){
			var bodyStyle = document.body.style;

	        this.positionProp = this.options.vertical === true ? 'top' : 'left';

	        if(this.positionProp === 'top'){
	            this.$slider.addClass('slick-vertical');
	        }else{
	            this.$slider.removeClass('slick-vertical');
	        }

	        if(bodyStyle.WebkitTransition !== undefined ||
	            bodyStyle.MozTransition !== undefined ||
	            bodyStyle.msTransition !== undefined){

	            if(this.options.useCSS === true){
	                this.cssTransitions = true;
	            }
	        }

	        if(this.options.fade){
	            if(typeof this.options.zIndex === 'number'){
	                if(this.options.zIndex < 3){
	                    this.options.zIndex = 3;
	                }
	            }else{
	                this.options.zIndex = this.defaults.zIndex;
	            }
	        }

	        if(bodyStyle.OTransform !== undefined){
	            this.animType = 'OTransform';
	            this.transformType = '-o-transform';
	            this.transitionType = 'OTransition';
	            if(bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined){
	            	this.animType = false;
	            }
	        }
	        if(bodyStyle.MozTransform !== undefined){
	            this.animType = 'MozTransform';
	            this.transformType = '-moz-transform';
	            this.transitionType = 'MozTransition';
	            if(bodyStyle.perspectiveProperty === undefined && bodyStyle.MozPerspective === undefined){
	            	this.animType = false;
	            } 
	        }
	        if(bodyStyle.webkitTransform !== undefined){
	            this.animType = 'webkitTransform';
	            this.transformType = '-webkit-transform';
	            this.transitionType = 'webkitTransition';
	            if(bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined){
	            	this.animType = false;
	            }
	        }
	        if(bodyStyle.msTransform !== undefined){
	            this.animType = 'msTransform';
	            this.transformType = '-ms-transform';
	            this.transitionType = 'msTransition';
	            if(bodyStyle.msTransform === undefined){
	            	this.animType = false;
	            }
	        }
	        if(bodyStyle.transform !== undefined && this.animType !== false){
	            this.animType = 'transform';
	            this.transformType = 'transform';
	            this.transitionType = 'transition';
	        }

	        this.transformsEnabled = this.options.useTransform && (this.animType !== null && this.animType !== false);
		},

		startLoad: function(){
	        if (this.options.arrows === true && this.slideCount > this.options.slidesToShow) {
	            this.$prevArrow.hide();
	            this.$nextArrow.hide();
	        }

	        if (this.options.dots === true && this.slideCount > this.options.slidesToShow) {
	            this.$dots.hide();
	        }

	        if (this.options.pagination === true && this.slideCount > this.options.slidesToShow) {
	           this.$pagination.all.hide();
	        }

	        this.$slider.addClass('slick-loading');
		},

		loadSlider: function(){
	        this.setPosition();

	        this.$slideTrack.css({
	            opacity: 1
	        });

	        this.$slider.removeClass('slick-loading');

	        this.initUI();

	        if (this.options.lazyLoad === 'progressive') {
	            this.progressiveLazyLoad();
	        }
		},

		initUI: function(){
			if (this.options.arrows === true && this.slideCount > this.options.slidesToShow) {
	            this.$prevArrow.show();
	            this.$nextArrow.show();
	        }

	        if (this.options.dots === true && this.slideCount > this.options.slidesToShow) {
	            this.$dots.show();
	        }

	        if (this.options.pagination === true && this.slideCount > this.options.slidesToShow) {
	           this.$pagination.all.show();
	        }

	        if (this.options.autoplay === true) {
	            this.autoPlay();
	        }
		}
	};

	var updates = {
		updateArrows: function(){
	        if(this.options.arrows === true &&  this.slideCount > this.options.slidesToShow && !this.options.infinite){
	            this.$prevArrow.removeClass('slick-disabled');
	            this.$nextArrow.removeClass('slick-disabled');

	            if(this.currentSlide === 0){
	                this.$prevArrow.addClass('slick-disabled');
	                this.$nextArrow.removeClass('slick-disabled');

	            }else if(this.currentSlide >= this.slideCount - this.options.slidesToShow){
	                this.$nextArrow.addClass('slick-disabled');
	                this.$prevArrow.removeClass('slick-disabled');

	            }else if(this.currentSlide >= this.slideCount - 1){
	                this.$nextArrow.addClass('slick-disabled');
	                this.$prevArrow.removeClass('slick-disabled');
	            }
	        }
		},

		updateDots: function(){
			if (this.$dots !== null) {
	            this.$dots.find('li').removeClass('slick-active');
	            this.$dots.find('li').eq(Math.floor(this.currentSlide / this.options.slidesToScroll)).addClass('slick-active');
	        }
		},

		updatePagination: function(){
			if (this.$pagination !== null) {
	            this.$pagination.numbers.parents().removeClass('slick-active');
	            this.$pagination.numbers.eq(Math.floor(this.currentSlide / this.options.slidesToScroll)).parent('li').addClass('slick-active');

	            this.$pagination.first.removeClass('slick-disabled');
	            this.$pagination.prev.removeClass('slick-disabled');
	            this.$pagination.next.removeClass('slick-disabled');
	            this.$pagination.last.removeClass('slick-disabled');

	            if(this.currentSlide === 0){
	            	this.$pagination.first.addClass('slick-disabled');
					this.$pagination.prev.addClass('slick-disabled');
	                this.$pagination.next.removeClass('slick-disabled');
					this.$pagination.last.removeClass('slick-disabled');

	            }else if(this.currentSlide >= this.slideCount - this.options.slidesToShow){
	            	this.$pagination.first.removeClass('slick-disabled');
					this.$pagination.prev.removeClass('slick-disabled');
	                this.$pagination.next.addClass('slick-disabled');
					this.$pagination.last.addClass('slick-disabled');

	            }else if(this.currentSlide >= this.slideCount - 1){
	                this.$pagination.first.removeClass('slick-disabled');
					this.$pagination.prev.removeClass('slick-disabled');
	                this.$pagination.next.addClass('slick-disabled');
					this.$pagination.last.addClass('slick-disabled');
	            }
	        }
		},

		setSlideClasses: function(index){
			var allSlides,
				indexOffset,
				remainder;

	        allSlides = this.$slider.find('.slick-slide').removeClass('slick-active slick-current');

	        this.$slides.eq(index).addClass('slick-current');

	        if(index >= 0 && index <= (this.slideCount - this.options.slidesToShow)){
	            this.$slides
	                .slice(index, index + this.options.slidesToShow)
	                .addClass('slick-active');

	        }else if(allSlides.length <= this.options.slidesToShow){
	            allSlides.addClass('slick-active');

	        }else{
	            remainder = this.slideCount % this.options.slidesToShow;
	            indexOffset = this.options.infinite === true ? this.options.slidesToShow + index : index;

	            if (this.options.slidesToShow === this.options.slidesToScroll && (this.slideCount - index) < this.options.slidesToShow) {
	                allSlides
	                    .slice(indexOffset - (this.options.slidesToShow - remainder), indexOffset + remainder)
	                    .addClass('slick-active');

	            } else {
	                allSlides
	                    .slice(indexOffset, indexOffset + this.options.slidesToShow)
	                    .addClass('slick-active');

	            }
	        }

	        if (this.options.lazyLoad === 'ondemand') {
	            this.lazyLoad();
	        }
		},

		setPosition: function(){
	        this.setDimensions();

	        this.setHeight();

	        if(this.options.fade === false){
	            this.setCSS(this.getLeft(this.currentSlide));
	        }else{
	            this.setFade();
	        }

	        this.$slider.trigger('setPosition', [this]);
		},

		setDimensions: function(){
			if(this.options.vertical === true){
	            this.$list.height(this.$slides.first().outerHeight(true) * this.options.slidesToShow);
	        }

	        this.listWidth = this.$list.width();
	        this.listHeight = this.$list.height();

	        if(this.options.vertical === false && this.options.variableWidth === false){
	            this.slideWidth = Math.ceil(this.listWidth / this.options.slidesToShow);
	            this.$slideTrack.width(Math.ceil((this.slideWidth * this.$slideTrack.children('.slick-slide').length)));

	        }else if(this.options.variableWidth === true){
	            this.$slideTrack.width(5000 * this.slideCount);
	        }else{
	            this.slideWidth = Math.ceil(this.listWidth);
	            this.$slideTrack.height(Math.ceil((this.$slides.first().outerHeight(true) * this.$slideTrack.children('.slick-slide').length)));
	        }

	        var offset = this.$slides.first().outerWidth(true) - this.$slides.first().width();
	        if (this.options.variableWidth === false){
	        	this.$slideTrack.children('.slick-slide').width(this.slideWidth - offset);
	        }
		},

		setHeight: function(){
			if(this.options.slidesToShow === 1 && this.options.adaptiveHeight === true && this.options.vertical === false){
	            var targetHeight = this.$slides.eq(this.currentSlide).outerHeight(true);
	            this.$list.css('height', targetHeight);
	        }
		},

		setCSS: function(position){
			var positionProps = {};

	        var x = this.positionProp === 'left' ? Math.ceil(position) + 'px' : '0px';
	        var y = this.positionProp === 'top' ? Math.ceil(position) + 'px' : '0px';

	        positionProps[this.positionProp] = position;

	        if(this.transformsEnabled === false){
	            this.$slideTrack.css(positionProps);
	        }else{
	            positionProps = {};
	            if (this.cssTransitions === false) {
	                positionProps[this.animType] = 'translate(' + x + ', ' + y + ')';
	                this.$slideTrack.css(positionProps);
	            } else {
	                positionProps[this.animType] = 'translate3d(' + x + ', ' + y + ', 0px)';
	                this.$slideTrack.css(positionProps);
	            }
	        }
		},

		setFade: function(){
			var targetLeft;

	        this.$slides.each(function(index, element) {
	            targetLeft = (this.slideWidth * index) * -1;
	            $(element).css({
	                position: 'relative',
	                left: targetLeft,
	                top: 0,
	                zIndex: this.options.zIndex - 2,
	                opacity: 0
	            }); 
	        }.bind(this));

	        this.$slides.eq(this.currentSlide).css({
	            zIndex: this.options.zIndex - 1,
	            opacity: 1
	        });
		}
	};

	var responsive = {
		registerBreakpoints: function(){
			var breakpoint,
				currentBreakpoint,
				length,
	            responsiveSettings = this.options.responsive || null;

	        if($.type(responsiveSettings) === "array" && responsiveSettings.length){
	            this.respondTo = this.options.respondTo || 'window';

	            for(breakpoint in responsiveSettings){
	                length = this.breakpoints.length-1;
	                currentBreakpoint = responsiveSettings[breakpoint].breakpoint;

	                if(responsiveSettings.hasOwnProperty(breakpoint)){
	                    // loop through the breakpoints and cut out any existing
	                    // ones with the same breakpoint number, we don't want dupes.
	                    while(length >= 0){
	                        if(this.breakpoints[length] && this.breakpoints[length] === currentBreakpoint){
	                            this.breakpoints.splice(length,1);
	                        }
	                        length--;
	                    }

	                    this.breakpoints.push(currentBreakpoint);
	                    this.breakpointCallbacks[currentBreakpoint] = responsiveSettings[breakpoint].callback;
	                    this.breakpointSettings[currentBreakpoint] = responsiveSettings[breakpoint].settings;
	                }
	            }

	            this.breakpoints.sort(function(a, b) {
	                return ( this.options.mobileFirst ) ? a-b : b-a;
	            }.bind(this));
	        }
		},

		checkResponsive: function(initial, forceUpdate){
			var breakpoint,
				targetBreakpoint,
				respondToWidth,
				triggerBreakpoint = false;
	        var sliderWidth = this.$slider.width();
	        var windowWidth = window.innerWidth || $(window).width();

	        if(this.respondTo === 'window'){
	            respondToWidth = windowWidth;
	        }else if (this.respondTo === 'slider'){
	            respondToWidth = sliderWidth;
	        }else if (this.respondTo === 'min'){
	            respondToWidth = Math.min(windowWidth, sliderWidth);
	        }

	        if(this.options.responsive && this.options.responsive.length && this.options.responsive !== null){

	            targetBreakpoint = null;

	            for(breakpoint in this.breakpoints){
	                if(this.breakpoints.hasOwnProperty(breakpoint)){
	                    if(this.originalSettings.mobileFirst === false){
	                        if(respondToWidth < this.breakpoints[breakpoint]){
	                            targetBreakpoint = this.breakpoints[breakpoint];
	                        }
	                    }else{
	                        if(respondToWidth > this.breakpoints[breakpoint]){
	                            targetBreakpoint = this.breakpoints[breakpoint];
	                        }
	                    }
	                }
	            }

	            if(targetBreakpoint !== null){
	                if(this.activeBreakpoint !== null){
	                    if(targetBreakpoint !== this.activeBreakpoint || forceUpdate){
	                        this.activeBreakpoint = targetBreakpoint;

	                        if(this.breakpointSettings[targetBreakpoint] === 'unslick'){
	                            this.unslick(targetBreakpoint);

	                        }else{
	                            this.options = $.extend({}, this.originalSettings, this.breakpointSettings[targetBreakpoint]);

	                            if(initial === true){
	                                this.currentSlide = this.options.initialSlide;
	                            }
	                            
	                            this.refresh(initial);
	                            
	                            if(this.breakpointCallbacks[targetBreakpoint]){
	                            	this.breakpointCallbacks[targetBreakpoint](this);
	                            }
	                        }
	                        triggerBreakpoint = targetBreakpoint;
	                    }
	                }else{
	                    this.activeBreakpoint = targetBreakpoint;

	                    if(this.breakpointSettings[targetBreakpoint] === 'unslick') {
	                        this.unslick(targetBreakpoint);

	                    }else{ 
	                        this.options = $.extend({}, this.originalSettings, this.breakpointSettings[targetBreakpoint]);

	                        if(initial === true){
	                            this.currentSlide = this.options.initialSlide;
	                        }

	                        this.refresh(initial);

	                        if(this.breakpointCallbacks[targetBreakpoint]){
                            	this.breakpointCallbacks[targetBreakpoint](this);
                            }
	                    }
	                    triggerBreakpoint = targetBreakpoint;
	                }
	            }else{

	                if(this.activeBreakpoint !== null){
	                    this.activeBreakpoint = null;
	                    this.options = this.originalSettings;

	                    if(initial === true){
	                        this.currentSlide = this.options.initialSlide;
	                    }

	                    this.refresh(initial);

	                    if(this.breakpointCallbacks[targetBreakpoint]){
                        	this.breakpointCallbacks[targetBreakpoint](this);
                        }

	                    triggerBreakpoint = targetBreakpoint;
	                }
	            }

	            // only trigger breakpoints during an actual break. not on initialize.
	            if(!initial && triggerBreakpoint !== false){
	                this.$slider.trigger('breakpoint', [this, triggerBreakpoint]);
	            }
	        }
		}
	};

	var util = {
		getLeft: function(slideIndex){
			var targetLeft,
	            verticalHeight,
	            verticalOffset = 0,
	            targetSlide;

	        this.slideOffset = 0;
	        verticalHeight = this.$slides.first().outerHeight(true);

	        if(this.options.infinite === true){
	            if(this.slideCount > this.options.slidesToShow){
	                this.slideOffset = (this.slideWidth * this.options.slidesToShow) * -1;
	                verticalOffset = (verticalHeight * this.options.slidesToShow) * -1;
	            }
	            if(this.slideCount % this.options.slidesToScroll !== 0){
	                if(slideIndex + this.options.slidesToScroll > this.slideCount && this.slideCount > this.options.slidesToShow){
	                    if (slideIndex > this.slideCount) {
	                        this.slideOffset = ((this.options.slidesToShow - (slideIndex - this.slideCount)) * this.slideWidth) * -1;
	                        verticalOffset = ((this.options.slidesToShow - (slideIndex - this.slideCount)) * verticalHeight) * -1;
	                    }else{
	                        this.slideOffset = ((this.slideCount % this.options.slidesToScroll) * this.slideWidth) * -1;
	                        verticalOffset = ((this.slideCount % this.options.slidesToScroll) * verticalHeight) * -1;
	                    }
	                }
	            }
	        }else{
	            if(slideIndex + this.options.slidesToShow > this.slideCount){
	                this.slideOffset = ((slideIndex + this.options.slidesToShow) - this.slideCount) * this.slideWidth;
	                verticalOffset = ((slideIndex + this.options.slidesToShow) - this.slideCount) * verticalHeight;
	            }
	        }

	        if(this.slideCount <= this.options.slidesToShow){
	            this.slideOffset = 0;
	            verticalOffset = 0;
	        }

	        if(this.options.vertical === false){
	            targetLeft = ((slideIndex * this.slideWidth) * -1) + this.slideOffset;
	        }else{
	            targetLeft = ((slideIndex * verticalHeight) * -1) + verticalOffset;
	        }

	        if(this.options.variableWidth === true){

	            if(this.slideCount <= this.options.slidesToShow || this.options.infinite === false){
	                targetSlide = this.$slideTrack.children('.slick-slide').eq(slideIndex);
	            }else{
	                targetSlide = this.$slideTrack.children('.slick-slide').eq(slideIndex + this.options.slidesToShow);
	            }

	            targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
	        }

	        return targetLeft;
		},

		checkNavigable: function(index){
			var navigables,
				prevNavigable;

	        navigables = this.getNavigableIndexes();
	        prevNavigable = 0;
	        if (index > navigables[navigables.length - 1]) {
	            index = navigables[navigables.length - 1];
	        } else {
	            for (var n in navigables) {
	                if (index < navigables[n]) {
	                    index = prevNavigable;
	                    break;
	                }
	                prevNavigable = navigables[n];
	            }
	        }

	        return index;
		},

		getNavigableIndexes: function(){
			var breakPoint = 0,
	            counter = 0,
	            indexes = [],
	            max;

	        if (this.options.infinite === false) {
	            max = this.slideCount;
	        } else {
	            breakPoint = this.options.slidesToScroll * -1;
	            counter = this.options.slidesToScroll * -1;
	            max = this.slideCount * 2;
	        }

	        while (breakPoint < max) {
	            indexes.push(breakPoint);
	            breakPoint = counter + this.options.slidesToScroll;
	            counter += this.options.slidesToScroll <= this.options.slidesToShow ? this.options.slidesToScroll : this.options.slidesToShow;
	        }

	        return indexes;
		},

		getSlideCount: function(){
			var slidesTraversed,
				swipedSlide;

	        if (this.options.swipeToSlide === true) {
	            this.$slideTrack.find('.slick-slide').each(function(index, slide) {
	                if (slide.offsetLeft + ($(slide).outerWidth() / 2) > (this.swipeLeft * -1)) {
	                    swipedSlide = slide;
	                    return false;
	                }
	            });

	            slidesTraversed = Math.abs($(swipedSlide).attr('data-slick-index') - this.currentSlide) || 1;

	            return slidesTraversed;

	        } else {
	            return this.options.slidesToScroll;
	        }
		},

		getDotCount: function(){
			var breakPoint = 0;
	        var counter = 0;
	        var pagerQty = 0;

	        if(this.options.infinite === true){
	            while(breakPoint < this.slideCount){
	                ++pagerQty;
	                breakPoint = counter + this.options.slidesToScroll;
	                counter += this.options.slidesToScroll <= this.options.slidesToShow ? this.options.slidesToScroll : this.options.slidesToShow;
	            }
	        }else{
	            while(breakPoint < this.slideCount){
	                ++pagerQty;
	                breakPoint = counter + this.options.slidesToScroll;
	                counter += this.options.slidesToScroll <= this.options.slidesToShow ? this.options.slidesToScroll : this.options.slidesToShow;
	            }
	        }

	        return pagerQty - 1;
		},

		asNavFor: function(index){
			var asNavFor = this.options.asNavFor;

	        if(asNavFor && asNavFor !== null ){
	            asNavFor = $(asNavFor).not(this.$slider);
	        }

	        if(asNavFor !== null && typeof asNavFor === 'object'){
	            asNavFor.each(function(i, element) {
	                var target = $(element).rdslick('getSlick');
	                if(!target.unslicked) {
	                    target.slideHandler(index, true);
	                }
	            });
	        }
		},

		swipeDirection: function(){
			var xDist,
				yDist,
				r,
				swipeAngle;

	        xDist = this.touchObject.startX - this.touchObject.curX;
	        yDist = this.touchObject.startY - this.touchObject.curY;
	        r = Math.atan2(yDist, xDist);

	        swipeAngle = Math.round(r * 180 / Math.PI);
	        if(swipeAngle < 0){
	            swipeAngle = 360 - Math.abs(swipeAngle);
	        }

	        if((swipeAngle <= 45) && (swipeAngle >= 0)){
	            return 'left';
	        }

	        if((swipeAngle <= 360) && (swipeAngle >= 315)){
	            return 'left';
	        }

	        if((swipeAngle >= 135) && (swipeAngle <= 225)){
	            return 'right';
	        }

	        if(this.options.verticalSwiping === true){
	            if((swipeAngle >= 35) && (swipeAngle <= 135)){
	                return 'left';
	            }else{
	                return 'right';
	            }
	        }

	        return 'vertical';
		},

		visibility: function(){
			if(document[this.hidden]){
	            this.paused = true;
	            this.autoPlayClear();
	        }else{
	            if(this.options.autoplay === true){
	                this.paused = false;
	                this.autoPlay();
	            }
	        }
		},

		destroy: function(refresh){
	        this.autoPlayClear();
	        this.touchObject = {};
	        this.cleanUpEvents();

	        $('.slick-cloned', this.$slider).detach();

	        if(this.$dots){
	            this.$dots.remove();
	        }

	        if(this.$pagination){
	        	this.$pagination.all.remove();
	        }

	        if(this.$prevArrow && this.$prevArrow.length){
	            this.$prevArrow
	                .removeClass('slick-disabled slick-arrow slick-hidden')
	                .css("display","");

	            if(this.htmlExpr.test(this.options.prevArrow)){
	                this.$prevArrow.remove();
	            }
	        }

	        if(this.$nextArrow && this.$nextArrow.length){
	            this.$nextArrow
	                .removeClass('slick-disabled slick-arrow slick-hidden')
	                .css("display","");

	            if(this.htmlExpr.test( this.options.nextArrow)){
	                this.$nextArrow.remove();
	            }
	        }

	        if(this.$slides){
	            this.$slides
	                .removeClass('slick-slide slick-active slick-center slick-visible slick-current')
	                .removeAttr('data-slick-index')
	                .each(function(){
	                    $(this).attr('style', $(this).data('originalStyling'));
	                });
	            this.$slideTrack.children(this.options.slide).detach();
	            this.$slideTrack.detach();
	            this.$list.detach();
	            this.$slider.append(this.$slides);
	        }

	        this.cleanUpRows();

	        this.$slider.removeClass('slick-slider');
	        this.$slider.removeClass('slick-initialized');

	        this.unslicked = true;

	        if(!refresh) {
	            this.$slider.trigger('destroy', [this]);
	        }
		},

		unslick: function(fromBreakpoint){
			this.$slider.trigger('unslick', [this, fromBreakpoint]);
        	this.destroy();
		},

		refresh: function(initializing){
			var currentSlide,
				firstVisible;

	        firstVisible = this.slideCount - this.options.slidesToShow;

	        // check that the new breakpoint can actually accept the
	        // "current slide" as the current slide, otherwise we need
	        // to set it to the closest possible value.
	        if (!this.options.infinite){
	            if(this.slideCount <= this.options.slidesToShow){
	                this.currentSlide = 0;
	            }else if(this.currentSlide > firstVisible){
	                this.currentSlide = firstVisible;
	            }
	        }

	        currentSlide = this.currentSlide;

	        this.destroy(true);

	        $.extend(this, this.initials, { currentSlide: currentSlide });

	        this.init();

	        if(!initializing){
	            this.changeSlide({
	                data: {
	                    message: 'index',
	                    index: currentSlide
	                }
	            }, false);
	        }
		},

		cleanUpRows: function(){
			var originalSlides;

	        if(this.options.rows > 1){
	            originalSlides = this.$slides.children().children();
	            originalSlides.removeAttr('style');
	            this.$slider.html(originalSlides);
	        }
		},

		unload: function(){
	        $('.slick-cloned', this.$slider).remove();

	        if(this.$dots){
	            this.$dots.remove();
	        }

	        if(this.$pagination){
	        	this.$pagination.all.remove();
	        }

	        if(this.$prevArrow && this.htmlExpr.test(this.options.prevArrow)){
	            this.$prevArrow.remove();
	        }

	        if(this.$nextArrow && this.htmlExpr.test(this.options.nextArrow)){
	            this.$nextArrow.remove();
	        }

	        this.$slides
	            .removeClass('slick-slide slick-active slick-visible slick-current')
	            .css('width', '');
		},

		reinit: function(){
	        this.$slides =
	            this.$slideTrack
	                .children(this.options.slide)
	                .addClass('slick-slide');

	        this.slideCount = this.$slides.length;

	        if(this.currentSlide >= this.slideCount && this.currentSlide !== 0){
	            this.currentSlide = this.currentSlide - this.options.slidesToScroll;
	        }

	        if(this.slideCount <= this.options.slidesToShow){
	            this.currentSlide = 0;
	        }

	        this.registerBreakpoints();

	        this.setProps();
	        this.setupInfinite();
	        this.buildArrows();
	        this.updateArrows();
	        this.initArrowEvents();
	        this.buildDots();
	        this.updateDots();
	        this.updatePagination();
	        this.initDotEvents();
	        this.initPaginationEvents();

	        this.checkResponsive(false, true);

	        if(this.options.focusOnSelect === true){
	            $(this.$slideTrack).children().on('click.slick', this.selectHandler);
	        }

	        this.setSlideClasses(0);

	        this.setPosition();

	        this.$slider.trigger('reInit', [this]);

	        if(this.options.autoplay === true){
	            this.focusHandler();
	        }
		},

		getIndexFromID: function(slickID){
			if(typeof slickID !== "string"){
				return 0;
			}

			var slide = this.$list.find('[data-'+this.options.sliderIDData+'='+slickID+']').first();

			if(slide.length){
				return slide.data('slick-index') || 0;
			}
			return 0;
		}
	};

	var events = {
		initializeEvents: function(){
	        this.initArrowEvents();
	        this.initDotEvents();
	        this.initPaginationEvents();

	        this.$list.on('touchstart.slick mousedown.slick', {
	            action: 'start'
	        }, this.swipeHandler);

	        this.$list.on('touchmove.slick mousemove.slick', {
	            action: 'move'
	        }, this.swipeHandler);

	        this.$list.on('touchend.slick mouseup.slick', {
	            action: 'end'
	        }, this.swipeHandler);

	        this.$list.on('touchcancel.slick mouseleave.slick', {
	            action: 'end'
	        }, this.swipeHandler);

	        this.$list.on('click.slick', this.clickHandler);

	        $(document).on(this.visibilityChange, this.visibility.bind(this));

	        this.$list.on('mouseenter.slick', this.setPaused.bind(this, true));
	        this.$list.on('mouseleave.slick', this.setPaused.bind(this, false));

	        if(this.options.focusOnSelect === true){
	            $(this.$slideTrack).children().on('click.slick', this.selectHandler);
	        }

	        $(window).on('orientationchange.slick.slick-' + this.instanceUid, this.orientationChange.bind(this));

	        $(window).on('resize.slick.slick-' + this.instanceUid, this.resize.bind(this));

	        $('[draggable!=true]', this.$slideTrack).on('dragstart', this.preventDefault);

	        $(window).on('load.slick.slick-' + this.instanceUid, this.setPosition);
	        $(document).on('ready.slick.slick-' + this.instanceUid, this.setPosition);

	        if(this.options.hashLink){
				$(window).on('hashchange.slick.slick-'+ this.instanceUid, this.hashHandle);
			}
		},

		cleanUpEvents: function(){
	        if(this.options.dots && this.$dots !== null){
	            $('li', this.$dots).off('click.slick', this.changeSlide);

	            if(this.options.pauseOnDotsHover === true && this.options.autoplay === true){
	                $('li', this.$dots)
	                    .off('mouseenter.slick', $.proxy(this.setPaused, this, true))
	                    .off('mouseleave.slick', $.proxy(this.setPaused, this, false));

	            }
	        }

	        if(this.options.pangnation && this.$pangnation.all !== null){
	        	this.$pagination.numbers.off('click.slick', function(e){
	            	this.changeSlide({
	            		data: {
	            			message: 'index',
	            			index: $(e.target).data('slick-id-target')
	            		}
	            	});
	            }.bind(this));

	            this.$pagination.prev.off('click.slick', {
	                message: 'previous'
	            }, this.changeSlide);

	            this.$pagination.next.off('click.slick', {
	                message: 'next'
	            }, this.changeSlide);

	            this.$pagination.first.off('click.slick', {
	                message: 'first'
	            }, this.changeSlide);

	            this.$pagination.last.off('click.slick', {
	                message: 'last'
	            }, this.changeSlide);

				if(this.options.pagination === true && this.options.pauseOnDotsHover === true && this.options.autoplay === true){
					this.$pagination.numbers.parents()
		                .off('mouseenter.slick', this.setPaused.bind(this, true))
		                .off('mouseleave.slick', this.setPaused.bind(this, false));
				}
	        }

	        if(this.options.arrows === true && this.slideCount > this.options.slidesToShow){
	            this.$prevArrow && this.$prevArrow.off('click.slick', this.changeSlide);
	            this.$nextArrow && this.$nextArrow.off('click.slick', this.changeSlide);
	        }

	        this.$list.off('touchstart.slick mousedown.slick', this.swipeHandler);
	        this.$list.off('touchmove.slick mousemove.slick', this.swipeHandler);
	        this.$list.off('touchend.slick mouseup.slick', this.swipeHandler);
	        this.$list.off('touchcancel.slick mouseleave.slick', this.swipeHandler);

	        this.$list.off('click.slick', this.clickHandler);

	        $(document).off(this.visibilityChange, this.visibility);

	        this.$list.off('mouseenter.slick', this.setPaused.bind(this, true));
	        this.$list.off('mouseleave.slick', this.setPaused.bind(this, false));

	        if(this.options.focusOnSelect === true){
	            $(this.$slideTrack).children().off('click.slick', this.selectHandler);
	        }

	        $(window).off('orientationchange.slick.slick-' + this.instanceUid, this.orientationChange);

	        $(window).off('resize.slick.slick-' + this.instanceUid, this.resize);

	        $('[draggable!=true]', this.$slideTrack).off('dragstart', this.preventDefault);

	        $(window).off('load.slick.slick-' + this.instanceUid, this.setPosition);
	        $(document).off('ready.slick.slick-' + this.instanceUid, this.setPosition);

	        if(this.options.hashLink){
				$(window).off('hashchange.slick.slick-'+ this.instanceUid, this.hashHandle);
			}
		},

		initArrowEvents: function(){
			if(this.options.arrows === true && this.slideCount > this.options.slidesToShow){
	            this.$prevArrow.on('click.slick', {
	                message: 'previous'
	            }, this.changeSlide);

	            this.$nextArrow.on('click.slick', {
	                message: 'next'
	            }, this.changeSlide);
	        }
		},

		initDotEvents: function(){
			if(this.options.dots === true && this.slideCount > this.options.slidesToShow){
	            $('li', this.$dots).on('click.slick', {
	                message: 'index'
	            }, this.changeSlide);
	        }

	        if(this.options.dots === true && this.options.pauseOnDotsHover === true && this.options.autoplay === true){
	            $('li', this.$dots)
	                .on('mouseenter.slick', this.setPaused.bind(this, true))
	                .on('mouseleave.slick', this.setPaused.bind(this, false));
	        }
		},

		initPaginationEvents: function(){
			if(this.options.pagination === true && this.slideCount > this.options.slidesToShow){
	            this.$pagination.numbers.on('click.slick', function(e){
	            	this.changeSlide({
	            		data: {
	            			message: 'index',
	            			index: $(e.target).data('slick-id-target')
	            		}
	            	});
	            }.bind(this));

	            this.$pagination.prev.on('click.slick', {
	                message: 'previous'
	            }, this.changeSlide);

	            this.$pagination.next.on('click.slick', {
	                message: 'next'
	            }, this.changeSlide);

	            this.$pagination.first.on('click.slick', {
	                message: 'first'
	            }, this.changeSlide);

	            this.$pagination.last.on('click.slick', {
	                message: 'last'
	            }, this.changeSlide);
	        }

			if(this.options.pagination === true && this.options.pauseOnDotsHover === true && this.options.autoplay === true){
				this.$pagination.numbers.parents()
	                .on('mouseenter.slick', this.setPaused.bind(this, true))
	                .on('mouseleave.slick', this.setPaused.bind(this, false));
			}
		},

		swipeHandler: function(event){
			if((this.options.swipe === false) || ('ontouchend' in document && this.options.swipe === false)){
	            return;
	        }else if (this.options.draggable === false && event.type.indexOf('mouse') !== -1){
	            return;
	        }

	        this.touchObject.fingerCount = event.originalEvent && event.originalEvent.touches !== undefined ?
	        	event.originalEvent.touches.length : 1;

	        this.touchObject.minSwipe = this.listWidth / this.options.touchThreshold;

	        if (this.options.verticalSwiping === true) {
	            this.touchObject.minSwipe = this.listHeight / this.options.touchThreshold;
	        }

	        switch (event.data.action) {
	            case 'start':
	                this.swipeStart(event);
	                break;

	            case 'move':
	                this.swipeMove(event);
	                break;

	            case 'end':
	                this.swipeEnd(event);
	                break;

	        }
		},

		swipeStart: function(event){
			var touches;

	        if(this.touchObject.fingerCount !== 1 || this.slideCount <= this.options.slidesToShow){
	            this.touchObject = {};
	            return false;
	        }

	        if(event.originalEvent !== undefined && event.originalEvent.touches !== undefined){
	            touches = event.originalEvent.touches[0];
	        }

	        this.touchObject.startX = this.touchObject.curX = touches !== undefined ? touches.pageX : event.clientX;
	        this.touchObject.startY = this.touchObject.curY = touches !== undefined ? touches.pageY : event.clientY;

	        this.dragging = true;
		},

		swipeMove: function(event){
			var curLeft,
	            swipeDirection,
	            swipeLength,
	            positionOffset,
	            touches;

	        touches = event.originalEvent !== undefined ? event.originalEvent.touches : null;

	        if(!this.dragging || touches && touches.length !== 1){
	            return false;
	        }

	        curLeft = this.getLeft(this.currentSlide);

	        this.touchObject.curX = touches !== undefined ? touches[0].pageX : event.clientX;
	        this.touchObject.curY = touches !== undefined ? touches[0].pageY : event.clientY;

	        this.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(this.touchObject.curX - this.touchObject.startX, 2)));

	        if(this.options.verticalSwiping === true){
	            this.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(this.touchObject.curY - this.touchObject.startY, 2)));
	        }

	        swipeDirection = this.swipeDirection();

	        if (swipeDirection === 'vertical') {
	            return;
	        }

	        if (event.originalEvent !== undefined && this.touchObject.swipeLength > 4) {
	            event.preventDefault();
	        }

	        positionOffset = this.touchObject.curX > this.touchObject.startX ? 1 : -1;
	        if (this.options.verticalSwiping === true) {
	            positionOffset = this.touchObject.curY > this.touchObject.startY ? 1 : -1;
	        }


	        swipeLength = this.touchObject.swipeLength;

	        this.touchObject.edgeHit = false;

	        if (this.options.infinite === false) {
	            if ((this.currentSlide === 0 && swipeDirection === 'right') || (this.currentSlide >= this.getDotCount() && swipeDirection === 'left')) {
	                swipeLength = this.touchObject.swipeLength * this.options.edgeFriction;
	                this.touchObject.edgeHit = true;
	            }
	        }

	        if (this.options.vertical === false) {
	            this.swipeLeft = curLeft + swipeLength * positionOffset;
	        } else {
	            this.swipeLeft = curLeft + (swipeLength * (this.$list.height() / this.listWidth)) * positionOffset;
	        }
	        if (this.options.verticalSwiping === true) {
	            this.swipeLeft = curLeft + swipeLength * positionOffset;
	        }

	        if (this.options.fade === true || this.options.touchMove === false) {
	            return false;
	        }

	        if (this.animating === true) {
	            this.swipeLeft = null;
	            return false;
	        }

	        this.setCSS(this.swipeLeft);
		},

		swipeEnd: function(){
			var slideCount;

	        this.dragging = false;

	        this.shouldClick = (this.touchObject.swipeLength > 10) ? false : true;

	        if(this.touchObject.curX === undefined){
	            return false;
	        }

	        if(this.touchObject.edgeHit === true){
	            this.$slider.trigger('edge', [this, this.swipeDirection()]);
	        }

	        if(this.touchObject.swipeLength >= this.touchObject.minSwipe){

	            switch(this.swipeDirection()){ 
	                case 'left':
	                    slideCount = this.options.swipeToSlide ? this.checkNavigable(this.currentSlide + this.getSlideCount()) : this.currentSlide + this.getSlideCount();
	                    this.slideHandler(slideCount);
	                    this.currentDirection = 0;
	                    this.touchObject = {};
	                    this.$slider.trigger('swipe', [this, 'left']);
	                    break;

	                case 'right':
	                    slideCount = this.options.swipeToSlide ? this.checkNavigable(this.currentSlide - this.getSlideCount()) : this.currentSlide - this.getSlideCount();
	                    this.slideHandler(slideCount);
	                    this.currentDirection = 1;
	                    this.touchObject = {};
	                    this.$slider.trigger('swipe', [this, 'right']);
	                    break;
	            }
	        }else{
	            if(this.touchObject.startX !== this.touchObject.curX){
	                this.slideHandler(this.currentSlide);
	                this.touchObject = {};
	            }
	        }
		},

		slideHandler: function(index, sync, dontAnimate){
			var targetSlide,
				animSlide,
				oldSlide,
				slideLeft,
				targetLeft = null;

	        sync = sync || false;

	        if(this.animating === true && this.options.waitForAnimate === true){
	            return;
	        }

	        if(this.options.fade === true && this.currentSlide === index){
	            return;
	        }

	        if(this.slideCount <= this.options.slidesToShow){
	            return;
	        }

	        if(sync === false) {
	            this.asNavFor(index);
	        }

	        targetSlide = index;
	        targetLeft = this.getLeft(targetSlide);
	        slideLeft = this.getLeft(this.currentSlide);

	        this.currentLeft = this.swipeLeft === null ? slideLeft : this.swipeLeft;

	        if(this.options.infinite === false && (index < 0 || index > this.getDotCount() * this.options.slidesToScroll)){
	            if (this.options.fade === false) {
	                targetSlide = this.currentSlide;
	                if(dontAnimate !== true){
	                    this.animateSlide(slideLeft, function() {
	                        this.postSlide(targetSlide);
	                    });
	                }else{
	                    this.postSlide(targetSlide);
	                }
	            }
	            return;
	        }else if(this.options.infinite === false && (index < 0 || index > (this.slideCount - this.options.slidesToScroll))){
	            if (this.options.fade === false) {
	                targetSlide = this.currentSlide;
	                if(dontAnimate !== true){
	                    this.animateSlide(slideLeft, function() {
	                        this.postSlide(targetSlide);
	                    });
	                }else{
	                    this.postSlide(targetSlide);
	                }
	            }
	            return;
	        }

	        if(this.options.autoplay === true){
	            clearInterval(this.autoPlayTimer);
	        }

	        if(targetSlide < 0){
	            if(this.slideCount % this.options.slidesToScroll !== 0){
	                animSlide = this.slideCount - (this.slideCount % this.options.slidesToScroll);
	            }else{
	                animSlide = this.slideCount + targetSlide;
	            }
	        }else if(targetSlide >= this.slideCount){
	            if(this.slideCount % this.options.slidesToScroll !== 0){
	                animSlide = 0;
	            }else{
	                animSlide = targetSlide - this.slideCount;
	            }
	        }else{
	            animSlide = targetSlide;
	        }

	        this.animating = true;

	        this.$slider.trigger('beforeChange', [this, this.currentSlide, animSlide]);

	        oldSlide = this.currentSlide;
	        this.currentSlide = animSlide;

	        this.setSlideClasses(this.currentSlide);

	        this.updateDots();
	        this.updatePagination();
	        this.updateArrows();

	        if (this.options.fade === true) {
	            if (dontAnimate !== true) {

	                this.fadeSlideOut(oldSlide);

	                this.fadeSlide(animSlide, function() {
	                    this.postSlide(animSlide);
	                });

	            } else {
	                this.postSlide(animSlide);
	            }
	            this.animateHeight();
	            return;
	        }

	        if (dontAnimate !== true) {
	            this.animateSlide(targetLeft, function() {
	                this.postSlide(animSlide);
	            });
	        } else {
	            this.postSlide(animSlide);
	        }
		},

		clickHandler: function(event){
			if(this.shouldClick === false){
	            event.stopImmediatePropagation();
	            event.stopPropagation();
	            event.preventDefault();
	        }
		},

		selectHandler: function(event){
			var targetElement =
	           	$(event.target).is('.slick-slide') ?
	                $(event.target) :
	                $(event.target).parents('.slick-slide');

	        var index = parseInt(targetElement.attr('data-slick-index'));

	        if(!index){
	        	index = 0;
	        }

	        if(this.slideCount <= this.options.slidesToShow){
	            this.setSlideClasses(index);
	            this.asNavFor(index);
	            return;
	        }

	        this.slideHandler(index);
		},

		orientationChange: function(){
			this.checkResponsive();
        	this.setPosition();
		},

		resize: function(){
			if($(window).width() !== this.windowWidth){
	            clearTimeout(this.windowDelay);

	            this.windowDelay = window.setTimeout(function() {
	                this.windowWidth = $(window).width();
	                this.checkResponsive();
	                if(!this.unslicked){ 
	                	this.setPosition();
	                }
	            }.bind(this), 50);
	        }
		},

		focusHandler: function(){
			this.$slider.on('focus.slick blur.slick', '*', function(event) {
	            event.stopImmediatePropagation();
	            var sf = $(this);
	            setTimeout(function() {
	                if (this.isPlay) {
	                    if (sf.is(':focus')) {
	                        this.autoPlayClear();
	                        this.paused = true;
	                    } else {
	                        this.paused = false;
	                        this.autoPlay();
	                    }
	                }
	            }.bind(this), 0);
	        });
		},

		hashHandle: function(){
			var hash = window.location.hash;
			if(hash){
				hash = hash.substr(1);
				this.changeSlide({
		            data: {
		                message: 'indexID',
		                indexID: hash
		            }
		        }, false);
			}
		}
	};

	var slideControllers = {
		autoPlay: function(){
			if(this.autoPlayTimer){
	            clearInterval(this.autoPlayTimer);
	        }

	        if(this.slideCount > this.options.slidesToShow && this.paused !== true){
	            this.autoPlayTimer = setInterval(this.autoPlayIterator, this.options.autoplaySpeed);
	        }
		},

		autoPlayClear: function(){
			if (this.autoPlayTimer) {
	            clearInterval(this.autoPlayTimer);
	        }
		},

		autoPlayIterator: function(){
			if(this.options.infinite === false){
	            if(this.direction === 1){

	                if((this.currentSlide + 1) === this.slideCount - 1){
	                    this.direction = 0;
	                }

	                this.slideHandler(this.currentSlide + this.options.slidesToScroll);
	            }else{

	                if((this.currentSlide - 1 === 0)){
	                    this.direction = 1;
	                }

	                this.slideHandler(this.currentSlide - this.options.slidesToScroll);
	            }
	        }else{
	            this.slideHandler(this.currentSlide + this.options.slidesToScroll);
	        }
		},

		setPaused: function(paused){
			if (this.options.autoplay === true && this.options.pauseOnHover === true) {
	            this.paused = paused;
	            if (!paused) {
	                this.autoPlay();
	            } else {
	                this.autoPlayClear();
	            }
	        }
		},

		changeSlide: function(event, dontAnimate){
			var $target = $(event.target),
	            indexOffset,
	            slideOffset,
	            unevenOffset,
	            index;

	        // If target is a link, prevent default action.
	        if($target.is('a')){
	            event.preventDefault();
	        }

	        // If target is not the <li> element (ie: a child), find the <li>.
	        if(!$target.is('li')) {
	            $target = $target.closest('li');
	        }

	        unevenOffset = (this.slideCount % this.options.slidesToScroll !== 0);
	        indexOffset = unevenOffset ? 0 : (this.slideCount - this.currentSlide) % this.options.slidesToScroll;

	        switch(event.data.message){
	            case 'previous':
	                slideOffset = indexOffset === 0 ? this.options.slidesToScroll : this.options.slidesToShow - indexOffset;
	                if(this.slideCount > this.options.slidesToShow){
	                    this.slideHandler(this.currentSlide - slideOffset, false, dontAnimate);
	                }
	                break;
	            case 'next':
	                slideOffset = indexOffset === 0 ? this.options.slidesToScroll : indexOffset;
	                if(this.slideCount > this.options.slidesToShow){
	                    this.slideHandler(this.currentSlide + slideOffset, false, dontAnimate);
	                }
	                break;
	            case 'first':
	            	this.slideHandler(0, false, dontAnimate);
	            	break;
	            case 'last':
	            	this.slideHandler(this.slideCount - 1, false, dontAnimate);
	            	break;
	            case 'index':
	                index = event.data.index === 0 ? 0 :
	                    event.data.index || $target.index() * this.options.slidesToScroll;

	                this.slideHandler(this.checkNavigable(index), false, dontAnimate);
	                $target.children().trigger('focus');
	                break;
	            case 'indexID':
	            	if(this.options.infinite){ return; }

	            	index = this.getIndexFromID(event.data.indexID);
	            	this.slideHandler(this.checkNavigable(index), false, dontAnimate);
	                $target.children().trigger('focus');
	            	break;
	            default:
	                return;
	        }
		},

		animateSlide: function(targetLeft, callback){
			var animProps = {};

	        this.animateHeight();

	        this.applyTransition();
	        targetLeft = Math.ceil(targetLeft);

	        if(this.options.vertical === false){
	            animProps[this.animType] = 'translate3d(' + targetLeft + 'px, 0px, 0px)';
	        }else{
	            animProps[this.animType] = 'translate3d(0px,' + targetLeft + 'px, 0px)';
	        }
	        this.$slideTrack.css(animProps);

	        if(callback){
	            setTimeout(function(){

	                this.disableTransition();

	                callback.call(this);
	            }.bind(this), this.options.speed);
	        }
		},

		applyTransition: function(slide){
			var transition = {};

	        if(this.options.fade === false){
	            transition[this.transitionType] = this.transformType + ' ' + this.options.speed + 'ms ' + this.options.cssEase;
	        }else{
	            transition[this.transitionType] = 'opacity ' + this.options.speed + 'ms ' + this.options.cssEase;
	        }

	        if(this.options.fade === false){
	            this.$slideTrack.css(transition);
	        }else{
	            this.$slides.eq(slide).css(transition);
	        }
		},

		disableTransition: function(slide){
			var transition = {};

	        transition[this.transitionType] = '';

	        if(this.options.fade === false){
	            this.$slideTrack.css(transition);
	        }else{
	            this.$slides.eq(slide).css(transition);
	        }
		},

		postSlide: function(index){
			this.$slider.trigger('afterChange', [this, index]);

	        this.animating = false;

	        this.setPosition();

	        this.swipeLeft = null;

	        if (this.options.autoplay === true && this.paused === false) {
	            this.autoPlay();
	        }
		},

		fadeSlideOut: function(slideIndex){
	 		if(this.cssTransitions === false){

	            this.$slides.eq(slideIndex).animate({
	                opacity: 0,
	                zIndex: this.options.zIndex - 2
	            }, this.options.speed, this.options.easing);
	        }else{

	            this.applyTransition(slideIndex);

	            this.$slides.eq(slideIndex).css({
	                opacity: 0,
	                zIndex: this.options.zIndex - 2
	            });
	        }
		},

		fadeSlide: function(slideIndex, callback){
			if(this.cssTransitions === false){

	            this.$slides.eq(slideIndex).css({
	                zIndex: this.options.zIndex
	            });

	            this.$slides.eq(slideIndex).animate({
	                opacity: 1
	            }, this.options.speed, this.options.easing, callback);

	        }else{

	            this.applyTransition(slideIndex);

	            this.$slides.eq(slideIndex).css({
	                opacity: 1,
	                zIndex: this.options.zIndex
	            });

	            if(callback){
	                setTimeout(function(){

	                    this.disableTransition(slideIndex);

	                    callback.call(this);
	                }.bind(this), this.options.speed);
	            }
	        }
		},

		animateHeight: function(){
			if (this.options.slidesToShow === 1 && this.options.adaptiveHeight === true && this.options.vertical === false) {
	            var targetHeight = this.$slides.eq(this.currentSlide).outerHeight(true);
	            this.$list.animate({
	                height: targetHeight
	            }, this.options.speed);
	        }
		}
	};

	var slickMethods = {
		addSlide: function(markup, index, addBefore){
	        if(typeof(index) === 'boolean'){
	            addBefore = index;
	            index = null;
	        }else if(index < 0 || (index >= this.slideCount)){
	            return false;
	        }

	        this.unload();

	        if(typeof(index) === 'number'){
	            if(index === 0 && this.$slides.length === 0){
	                $(markup).appendTo(this.$slideTrack);
	            }else if (addBefore){
	                $(markup).insertBefore(this.$slides.eq(index));
	            }else{
	                $(markup).insertAfter(this.$slides.eq(index));
	            }
	        }else{
	            if(addBefore === true){
	                $(markup).prependTo(this.$slideTrack);
	            }else{
	                $(markup).appendTo(this.$slideTrack);
	            }
	        }

	        this.$slides = this.$slideTrack.children(this.options.slide);

	        this.$slideTrack.children(this.options.slide).detach();

	        this.$slideTrack.append(this.$slides);

	        this.$slides.each(function(index, element){
	            $(element).attr('data-slick-index', index);
	        });

	        this.$slidesCache = this.$slides;

	        this.reinit();
		},

		removeSlide: function(index, removeBefore, removeAll){
	        if(typeof(index) === 'boolean'){
	            removeBefore = index;
	            index = removeBefore === true ? 0 : this.slideCount - 1;
	        }else{
	            index = removeBefore === true ? --index : index;
	        }

	        if(this.slideCount < 1 || index < 0 || index > this.slideCount - 1){
	            return false;
	        }

	        this.unload();

	        if(removeAll === true){
	            this.$slideTrack.children().remove();
	        }else{
	            this.$slideTrack.children(this.options.slide).eq(index).remove();
	        }

	        this.$slides = this.$slideTrack.children(this.options.slide);

	        this.$slideTrack.children(this.options.slide).detach();

	        this.$slideTrack.append(this.$slides);

	        this.$slidesCache = this.$slides;

	        this.reinit();
		},

		getCurrent: function(){
			return this.currentSlide;
		},

		getOption: function(option){
			return this.options[option];
		},

		setOption: function(option, value, refresh){
			var length,
				item;

	        if(option === "responsive" && $.type(value) === "array"){
	            for(item in value){
	                if($.type( this.options.responsive ) !== "array"){
	                    this.options.responsive = [ value[item] ];
	                }else{
	                    length = this.options.responsive.length-1;
	                    // loop through the responsive object and splice out duplicates.
	                    while(length >= 0){
	                        if(this.options.responsive[length].breakpoint === value[item].breakpoint){
	                            this.options.responsive.splice(length,1);
	                        }
	                        length--;
	                    }
	                    this.options.responsive.push( value[item] );
	                }
	            }
	        }else{
	            this.options[option] = value;
	        }

	        if(refresh === true){
	            this.unload();
	            this.reinit();
        	}
		},

		goTo: function(slide, dontAnimate){
			this.changeSlide({
	            data: {
	                message: 'index',
	                index: parseInt(slide)
	            }
	        }, dontAnimate);
		},

		goToID: function(slideID, dontAnimate){
			this.changeSlide({
	            data: {
	                message: 'indexID',
	                indexID: slideID
	            }
	        }, dontAnimate);
		},

		pause: function(){
			this.autoPlayClear();
        	this.paused = true;
		},

		play: function(){
			this.paused = false;
        	this.autoPlay();
		},

		prev: function(){
			 this.changeSlide({
	            data: {
	                message: 'previous'
	            }
	        });
		},

		next: function(){
			this.changeSlide({
	            data: {
	                message: 'next'
	            }
	        });
		},

		getSlick: function(){
			return this;
		}
	};

	var lazyLoad = {
		lazyLoad: function(){
			var loadRange,
				cloneRange,
				rangeStart,
				rangeEnd;

			var loadSlides = function(slides){
				slides.each(function(index, element){
					var url = $(element).data(this.options.lazyLoadData);
					var lazyCB = this.options.lazyLoadCB;
					var resetSlide = this.animateHeight.bind(this);
					if(!url){
						return;
					}
					$(element).addClass('slick-slide-lazy-loading');
					$.ajax(url)
					.done(function(data){
						setTimeout(function(){
							$(element).html(data);
							setTimeout(function(){
								if(lazyCB){
									lazyCB(element);
								}
								resetSlide();
							}, 0);
						}, 2000);
					})
					.always(function(){
						$(element).removeClass('slick-slide-lazy-loading slick-slide-lazy');
					});
				}.bind(this));
			};

			loadSlides = loadSlides.bind(this);

			rangeStart = this.options.infinite ? this.options.slidesToShow + this.currentSlide : this.currentSlide;
            rangeEnd = rangeStart + this.options.slidesToShow;
            if(this.options.fade === true){
                if (rangeStart > 0){ rangeStart--; }
                if (rangeEnd <= this.slideCount){ rangeEnd++; }
            }

            loadRange = this.$slides.slice(rangeStart, rangeEnd);
            loadSlides(loadRange);

            if(this.slideCount <= this.options.slidesToShow){
	            cloneRange = this.$slider.find('.slick-slide');
	            loadSlides(cloneRange);
	        }else if(this.currentSlide >= this.slideCount - this.options.slidesToShow){
	            cloneRange = this.$slider.find('.slick-cloned').slice(0, this.options.slidesToShow);
	            loadSlides(cloneRange);
	        }else if(this.currentSlide === 0){
	            cloneRange = this.$slider.find('.slick-cloned').slice(this.options.slidesToShow * -1);
	            loadSlides(cloneRange);
	        }
		},

		progressiveLazyLoad: function(){
			this.$list.find('[data-'+this.options.lazyLoadData+']').each(function(index, element){
				var url = $(element).data(this.options.lazyLoadData);
				if(!url){
					return;
				}
				$(element).addClass('slick-slide-lazy-loading');
				$.ajax(url)
				.done(function(data){
					$(element).html(data);
				})
				.always(function(){
					$(element).removeClass('slick-slide-lazy-loading slick-slide-lazy');
				});
			}.bind(this));
		}
	};

	var Slick = {
		setup: setup,
		init: init,

		//build actions
		buildRows: 			buildActions.buildRows,
		buildOut: 			buildActions.buildOut,
		setupInfinite: 		buildActions.setupInfinite,
		buildArrows: 		buildActions.buildArrows,
		buildDots: 			buildActions.buildDots,
		buildPagination: 	buildActions.buildPagination,
		setProps: 			buildActions.setProps,
		startLoad: 			buildActions.startLoad,
		loadSlider: 		buildActions.loadSlider,
		initUI: 			buildActions.initUI,

		//update actions
		updateArrows: 		updates.updateArrows,
		updateDots: 		updates.updateDots,
		updatePagination: 	updates.updatePagination,
		setSlideClasses: 	updates.setSlideClasses,
		setPosition: 		updates.setPosition,
		setDimensions: 		updates.setDimensions,
		setHeight: 			updates.setHeight,
		setCSS: 			updates.setCSS,
		setFade: 			updates.setFade,

		//responsive
		registerBreakpoints: responsive.registerBreakpoints,
		checkResponsive: 	responsive.checkResponsive,

		//util
		getLeft: 			util.getLeft,
		checkNavigable: 	util.checkNavigable,
		getNavigableIndexes: util.getNavigableIndexes,
		getSlideCount: 		util.getSlideCount,
		getDotCount: 		util.getDotCount,
		asNavFor: 			util.asNavFor,
		swipeDirection: 	util.swipeDirection,
		visibility: 		util.visibility,
		destroy: 			util.destroy,
		unslick: 			util.unslick,
		refresh: 			util.refresh,
		cleanUpRows: 		util.cleanUpRows,
		unload: 			util.unload,
		reinit: 			util.reinit,
		getIndexFromID:     util.getIndexFromID,

		//events
		initializeEvents: 	events.initializeEvents,
		cleanUpEvents: 		events.cleanUpEvents,
		initArrowEvents: 	events.initArrowEvents,
		initDotEvents: 		events.initDotEvents,
		initPaginationEvents: events.initPaginationEvents,
		swipeHandler: 		events.swipeHandler,
		swipeStart: 		events.swipeStart,
		swipeMove: 			events.swipeMove,
		swipeEnd: 			events.swipeEnd,
		slideHandler: 		events.slideHandler,
		clickHandler: 		events.clickHandler,
		keyHandler: 		events.keyHandler,
		selectHandler: 		events.selectHandler,
		orientationChange: 	events.orientationChange,
		resize: 			events.resize,
		focusHandler: 		events.focusHandler,
		hashHandle: 		events.hashHandle,
		
		//slide controllers
		autoPlay: 			slideControllers.autoPlay,
		autoPlayClear: 		slideControllers.autoPlayClear,
		autoPlayIterator: 	slideControllers.autoPlayIterator,
		changeSlide: 		slideControllers.changeSlide,
		setPaused: 			slideControllers.setPaused,
		animateSlide: 		slideControllers.animateSlide,
		applyTransition: 	slideControllers.applyTransition,
		disableTransition: 	slideControllers.disableTransition,
		postSlide: 			slideControllers.postSlide,
		fadeSlideOut: 		slideControllers.fadeSlideOut,
		fadeSlide: 			slideControllers.fadeSlide,
		animateHeight: 		slideControllers.animateHeight,

		//lazyLoad
		lazyLoad: 			lazyLoad.lazyLoad,
		progressiveLazyLoad: lazyLoad.progressiveLazyLoad,

		//slick methods
		addSlide: 			slickMethods.addSlide,
		removeSlide: 		slickMethods.removeSlide,
		getCurrent: 		slickMethods.getCurrent,
		getOption: 			slickMethods.getOption,
		setOption: 			slickMethods.setOption,
		goTo: 				slickMethods.goTo,
		pause: 				slickMethods.pause,
		play: 				slickMethods.play,
		prev: 				slickMethods.prev,
		next: 				slickMethods.next,
		goToID: 			slickMethods.goToID,
		getSlick: 			slickMethods.getSlick,

		slickAdd: 			slickMethods.addSlide,
		slickRemove: 		slickMethods.removeSlide,
		slickCurrentSlide: 	slickMethods.getCurrent,
		slickGetOption: 	slickMethods.getOption,
		slickSetOption: 	slickMethods.setOption,
		slickGoTo: 			slickMethods.goTo,
		slickPause: 		slickMethods.pause,
		slickPlay: 			slickMethods.play,
		slickPrev: 			slickMethods.prev,
		slickNext: 			slickMethods.next,
		slickGoToID: 		slickMethods.goToID
	};

	function setup(element, settings){
		this.defaults = {
			adaptiveHeight: false,
			appendArrows: $(element),
			appendDots: $(element),
			arrows: true,
			asNavFor: null,
			prevArrow: '<button class="slick-prev">Previous</button>',
			nextArrow: '<button class="slick-next">Next</button>',
			autoplay: false,
			autoplaySpeed: 3000,
			cssEase: 'ease',
			customPaging: function(slider, i) {
				return '<button class="slick-number">' + (i + 1) + '</button>';
			},
			dots: false,
			dotsClass: 'slick-dots',
			hashLink: false,
			sliderIDData: 'slick-id',
			draggable: true,
			edgeFriction: 0.35,
			fade: false,
			focusOnSelect: false,
			infinite: false,
			initialSlide: 0,
			lazyLoad: 'ondemand',
			lazyLoadData: 'slick-slide-lazyload',
			lazyLoadCB: null,
			mobileFirst: false,
			pauseOnHover: true,
			pauseOnDotsHover: false,
			respondTo: 'window',
			responsive: null,
			rows: 1,
			slide: '',
			slidesPerRow: 1,
			slidesToShow: 1,
			slidesToScroll: 1,
			speed: 500,
			swipe: true,
			swipeToSlide: false,
			touchMove: true,
			touchThreshold: 5,
			useCSS: true,
			useTransform: true,
			variableWidth: false,
			vertical: false,
			verticalSwiping: false,
			waitForAnimate: true,
			zIndex: 1000,
			pagination: false,
			paginationClass: 'slick-pagination',
			appendPagination: $(element)
		};

		this.initials = {
			animating: false,
			dragging: false,
			autoPlayTimer: null,
			currentDirection: 0,
			currentLeft: null,
			currentSlide: 0,
			direction: 1,
			$dots: null,
			$pagination: null,
			listWidth: null,
			listHeight: null,
			loadIndex: 0,
			$nextArrow: null,
			$prevArrow: null,
			slideCount: null,
			slideWidth: null,
			$slideTrack: null,
			$slides: null,
			sliding: false,
			slideOffset: 0,
			swipeLeft: null,
			$list: null,
			touchObject: {},
			transformsEnabled: false,
			unslicked: false
		};

		$.extend(this, this.initials);

		this.activeBreakpoint = null;
        this.animType = null;
        this.animProp = null;
        this.breakpoints = [];
        this.breakpointSettings = [];
        this.breakpointCallbacks = [];
        this.cssTransitions = false;
        this.hidden = 'hidden';
        this.paused = false;
        this.positionProp = null;
        this.respondTo = null;
        this.rowCount = 1;
        this.shouldClick = true;
        this.$slider = $(element);
        this.$slidesCache = null;
        this.transformType = null;
        this.transitionType = null;
        this.visibilityChange = 'visibilitychange';
        this.windowWidth = 0;
        this.windowTimer = null;

        var dataSettings = $(element).data('slick') || {};

		this.options = $.extend({}, this.defaults, dataSettings, settings);

		this.currentSlide = this.options.initialSlide;

		this.originalSettings = this.options;

		if (typeof document.mozHidden !== 'undefined') {
			this.hidden = 'mozHidden';
			this.visibilityChange = 'mozvisibilitychange';
		} else if (typeof document.webkitHidden !== 'undefined') {
			this.hidden = 'webkitHidden';
			this.visibilityChange = 'webkitvisibilitychange';
		}

		this.autoPlay 			= this.autoPlay.bind(this);
		this.autoPlayClear 		= this.autoPlayClear.bind(this);
		this.autoPlayIterator 	= this.autoPlayIterator.bind(this);
		this.changeSlide 		= this.changeSlide.bind(this);
		this.clickHandler 		= this.clickHandler.bind(this);
		this.selectHandler 		= this.selectHandler.bind(this);
		this.setPosition 		= this.setPosition.bind(this);
		this.swipeHandler 		= this.swipeHandler.bind(this);
		this.disableTransition  = this.disableTransition.bind(this);
		this.focusHandler 		= this.focusHandler.bind(this);
		this.hashHandle 		= this.hashHandle.bind(this);
		
		this.instanceUid = instanceUid++;

		// A simple way to check for HTML strings
		// Strict HTML recognition (must start with <)
		// Extracted from jQuery v1.11 source
		this.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/;


		this.registerBreakpoints();
		this.init(true);
		this.checkResponsive(true);

		return this;
	}

	function init(creation){
        if(!$(this.$slider).hasClass('slick-initialized')){
            $(this.$slider).addClass('slick-initialized');

            this.buildRows();
            this.buildOut();
            this.setProps();
            this.startLoad();
            this.loadSlider();
            this.initializeEvents();
            this.updateArrows();
            this.updateDots();
            this.updatePagination();

            if(this.options.hashLink){
            	this.hashHandle();
            }
        }

        if(creation){
            this.$slider.trigger('init', [this]);
        }
	}	

	return function(){
		var opt = arguments[0],
			args = Array.prototype.slice.call(arguments, 1),
			length = this.length,
			i,
			ret,
			_ = this;

		for (i = 0; i < length; i++) {
			if(typeof opt === 'object' || typeof opt === 'undefined'){
				_[i].slick = Object.create(Slick).setup(_[i], opt);
			}else{
				ret = _[i].slick[opt].apply(_[i].slick, args);
			}	
			if(typeof ret !== 'undefined'){
				return ret;
			}
		}

		return _;
	};
}, jQuery);
