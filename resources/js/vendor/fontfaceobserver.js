'use strict';

import promisePoly from "./es6-promise";

var $dom$SUPPORTS_ADDEVENTLISTENER$$ = !!document.addEventListener;

function $dom$addListener$$($element$$9$$, $callback$$47$$){
	$dom$SUPPORTS_ADDEVENTLISTENER$$ ? $element$$9$$.addEventListener("scroll", $callback$$47$$, !1) : $element$$9$$.attachEvent("scroll", $callback$$47$$);
}

function $dom$waitForBody$$($callback$$48$$) {
	document.body ?
		$callback$$48$$() :
		$dom$SUPPORTS_ADDEVENTLISTENER$$ ?
			document.addEventListener("DOMContentLoaded", $callback$$48$$) :
			document.attachEvent("onreadystatechange", function() {
				"interactive" != document.readyState && "complete" != document.readyState || $callback$$48$$();
			});
}

function $fontface$Ruler$$($text$$11$$) {
	this.$a$ = document.createElement("div");
	this.$a$.setAttribute("aria-hidden", "true");
	this.$a$.appendChild(document.createTextNode($text$$11$$));
	this.$b$ = document.createElement("span");
	this.$c$ = document.createElement("span");
	this.$h$ = document.createElement("span");
	this.$f$ = document.createElement("span");
	this.$g$ = -1;
	this.$b$.style.cssText = "max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";
	this.$c$.style.cssText = "max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";
	this.$f$.style.cssText = "max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";
	this.$h$.style.cssText = "display:inline-block;width:200%;height:200%;font-size:16px;max-width:none;";
	this.$b$.appendChild(this.$h$);
	this.$c$.appendChild(this.$f$);
	this.$a$.appendChild(this.$b$);
	this.$a$.appendChild(this.$c$);
}

function $JSCompiler_StaticMethods_setFont$$($JSCompiler_StaticMethods_setFont$self$$, $font$$3$$) {
	$JSCompiler_StaticMethods_setFont$self$$.$a$.style.cssText = "max-width:none;min-width:20px;min-height:20px;display:inline-block;overflow:hidden;position:absolute;width:auto;margin:0;padding:0;top:-999px;left:-999px;white-space:nowrap;font:" + $font$$3$$ + ";";
}

function $JSCompiler_StaticMethods_fontface_Ruler_prototype$reset$$($JSCompiler_StaticMethods_fontface_Ruler_prototype$reset$self$$) {
	var $offsetWidth$$ = $JSCompiler_StaticMethods_fontface_Ruler_prototype$reset$self$$.$a$.offsetWidth, $width$$13$$ = $offsetWidth$$ + 100;
	$JSCompiler_StaticMethods_fontface_Ruler_prototype$reset$self$$.$f$.style.width = $width$$13$$ + "px";
	$JSCompiler_StaticMethods_fontface_Ruler_prototype$reset$self$$.$c$.scrollLeft = $width$$13$$;
	$JSCompiler_StaticMethods_fontface_Ruler_prototype$reset$self$$.$b$.scrollLeft = $JSCompiler_StaticMethods_fontface_Ruler_prototype$reset$self$$.$b$.scrollWidth + 100;
	return $JSCompiler_StaticMethods_fontface_Ruler_prototype$reset$self$$.$g$ !== $offsetWidth$$ ? ($JSCompiler_StaticMethods_fontface_Ruler_prototype$reset$self$$.$g$ = $offsetWidth$$, !0) : !1;
}

function $JSCompiler_StaticMethods_onResize$$($JSCompiler_StaticMethods_onResize$self$$, $callback$$50$$) {
	function $onScroll$$() {
		var $JSCompiler_StaticMethods_onScroll$self$$inline_34$$ = $that$$;
		$JSCompiler_StaticMethods_fontface_Ruler_prototype$reset$$($JSCompiler_StaticMethods_onScroll$self$$inline_34$$) && null !== $JSCompiler_StaticMethods_onScroll$self$$inline_34$$.$a$.parentNode && $callback$$50$$($JSCompiler_StaticMethods_onScroll$self$$inline_34$$.$g$);
	}
	var $that$$ = $JSCompiler_StaticMethods_onResize$self$$;
	$dom$addListener$$($JSCompiler_StaticMethods_onResize$self$$.$b$, $onScroll$$);
	$dom$addListener$$($JSCompiler_StaticMethods_onResize$self$$.$c$, $onScroll$$);
	$JSCompiler_StaticMethods_fontface_Ruler_prototype$reset$$($JSCompiler_StaticMethods_onResize$self$$);
}

// Input 3
function $fontface$Observer$$($family$$, $opt_descriptors$$) {
	var $descriptors$$1$$ = $opt_descriptors$$ || {};
	this.family = $family$$;
	this.style = $descriptors$$1$$.style || "normal";
	this.weight = $descriptors$$1$$.weight || "normal";
	this.stretch = $descriptors$$1$$.stretch || "normal";
}

var $fontface$Observer$HAS_WEBKIT_FALLBACK_BUG$$ = null,
	$fontface$Observer$SUPPORTS_STRETCH$$ = null,
	$fontface$Observer$SUPPORTS_NATIVE$$ = !!window.FontFace;

function $fontface$Observer$supportStretch$$() {
	if (null === $fontface$Observer$SUPPORTS_STRETCH$$) {
		var $div$$ = document.createElement("div");
		try {
			$div$$.style.font = "condensed 100px sans-serif";
		} catch ($e$$6$$) {}
		$fontface$Observer$SUPPORTS_STRETCH$$ = "" !== $div$$.style.font;
	}
	return $fontface$Observer$SUPPORTS_STRETCH$$;
}

function $JSCompiler_StaticMethods_getStyle$$($JSCompiler_StaticMethods_getStyle$self$$, $family$$1$$) {
	return [$JSCompiler_StaticMethods_getStyle$self$$.style, $JSCompiler_StaticMethods_getStyle$self$$.weight, $fontface$Observer$supportStretch$$() ? $JSCompiler_StaticMethods_getStyle$self$$.stretch : "", "100px", $family$$1$$].join(" ");
}

$fontface$Observer$$.prototype.load = function $$fontface$Observer$$$$load$($text$$12$$, $timeout$$) {
	var $that$$1$$ = this,
		$testString$$ = $text$$12$$ || "BESbswy",
		$timeoutValue$$ = $timeout$$ || 3E3,
		$start$$16$$ = (new Date).getTime();

	return new Promise(function($resolve$$, $reject$$) {
		if ($fontface$Observer$SUPPORTS_NATIVE$$) {
			var $loader$$ = new Promise(function($resolve$$1$$, $reject$$1$$) {
				function $check$$() {
					(new Date).getTime() - $start$$16$$ >= $timeoutValue$$ ? $reject$$1$$() : document.fonts.load($JSCompiler_StaticMethods_getStyle$$($that$$1$$, $that$$1$$.family), $testString$$).then(function($fonts$$) {
							1 <= $fonts$$.length ? $resolve$$1$$() : setTimeout($check$$, 25);
						}, function() {
							$reject$$1$$();
						});
				}
				$check$$();
			}),
			$timer$$ = new Promise(function($resolve$$2$$, $reject$$2$$) {
					setTimeout($reject$$2$$, $timeoutValue$$);
			});

			Promise.race([$timer$$, $loader$$])
			.then(function() {
					$resolve$$($that$$1$$);
				}, function() {
					$reject$$($that$$1$$);
				}
			);
		} else {
			$dom$waitForBody$$(function() {
				function $check$$1$$() {
					var $JSCompiler_temp$$1_JSCompiler_temp$$2_match$$inline_40$$;

					if ($JSCompiler_temp$$1_JSCompiler_temp$$2_match$$inline_40$$ = -1 != $widthA$$ && -1 != $widthB$$ || -1 != $widthA$$ && -1 != $widthC$$ || -1 != $widthB$$ && -1 != $widthC$$) {
						($JSCompiler_temp$$1_JSCompiler_temp$$2_match$$inline_40$$ = $widthA$$ != $widthB$$ && $widthA$$ != $widthC$$ && $widthB$$ != $widthC$$) || (null === $fontface$Observer$HAS_WEBKIT_FALLBACK_BUG$$ && ($JSCompiler_temp$$1_JSCompiler_temp$$2_match$$inline_40$$ = /AppleWebKit\/([0-9]+)(?:\.([0-9]+))/.exec(window.navigator.userAgent), $fontface$Observer$HAS_WEBKIT_FALLBACK_BUG$$ = !!$JSCompiler_temp$$1_JSCompiler_temp$$2_match$$inline_40$$ && (536 > parseInt($JSCompiler_temp$$1_JSCompiler_temp$$2_match$$inline_40$$[1], 10) || 536 === parseInt($JSCompiler_temp$$1_JSCompiler_temp$$2_match$$inline_40$$[1], 10) && 11 >= parseInt($JSCompiler_temp$$1_JSCompiler_temp$$2_match$$inline_40$$[2], 10))), $JSCompiler_temp$$1_JSCompiler_temp$$2_match$$inline_40$$ = $fontface$Observer$HAS_WEBKIT_FALLBACK_BUG$$ && ($widthA$$ == $fallbackWidthA$$ && $widthB$$ == $fallbackWidthA$$ && $widthC$$ == $fallbackWidthA$$ || $widthA$$ == $fallbackWidthB$$ && $widthB$$ == $fallbackWidthB$$ && $widthC$$ == $fallbackWidthB$$ || $widthA$$ == $fallbackWidthC$$ && $widthB$$ == $fallbackWidthC$$ && $widthC$$ == $fallbackWidthC$$)), $JSCompiler_temp$$1_JSCompiler_temp$$2_match$$inline_40$$ = !$JSCompiler_temp$$1_JSCompiler_temp$$2_match$$inline_40$$;
					}
					$JSCompiler_temp$$1_JSCompiler_temp$$2_match$$inline_40$$ && (null !== $container$$.parentNode && $container$$.parentNode.removeChild($container$$), clearTimeout($timeoutId$$), $resolve$$($that$$1$$));
				}

				function $checkForTimeout$$() {
					if ((new Date).getTime() - $start$$16$$ >= $timeoutValue$$) {
						null !== $container$$.parentNode && $container$$.parentNode.removeChild($container$$), $reject$$($that$$1$$);
					} else {
						var $hidden$$ = document.hidden;
						if (!0 === $hidden$$ || void 0 === $hidden$$) {
							$widthA$$ = $rulerA$$.$a$.offsetWidth, $widthB$$ = $rulerB$$.$a$.offsetWidth, $widthC$$ = $rulerC$$.$a$.offsetWidth, $check$$1$$();
						}
						$timeoutId$$ = setTimeout($checkForTimeout$$, 50);
					}
				}

				var $rulerA$$ = new $fontface$Ruler$$($testString$$),
					$rulerB$$ = new $fontface$Ruler$$($testString$$),
					$rulerC$$ = new $fontface$Ruler$$($testString$$),
					$widthA$$ = -1,
					$widthB$$ = -1,
					$widthC$$ = -1,
					$fallbackWidthA$$ = -1,
					$fallbackWidthB$$ = -1,
					$fallbackWidthC$$ = -1,
					$container$$ = document.createElement("div"),
					$timeoutId$$ = 0;

				$container$$.dir = "ltr";
				$JSCompiler_StaticMethods_setFont$$($rulerA$$, $JSCompiler_StaticMethods_getStyle$$($that$$1$$, "sans-serif"));
				$JSCompiler_StaticMethods_setFont$$($rulerB$$, $JSCompiler_StaticMethods_getStyle$$($that$$1$$, "serif"));
				$JSCompiler_StaticMethods_setFont$$($rulerC$$, $JSCompiler_StaticMethods_getStyle$$($that$$1$$, "monospace"));
				$container$$.appendChild($rulerA$$.$a$);
				$container$$.appendChild($rulerB$$.$a$);
				$container$$.appendChild($rulerC$$.$a$);
				document.body.appendChild($container$$);
				$fallbackWidthA$$ = $rulerA$$.$a$.offsetWidth;
				$fallbackWidthB$$ = $rulerB$$.$a$.offsetWidth;
				$fallbackWidthC$$ = $rulerC$$.$a$.offsetWidth;

				$checkForTimeout$$();

				$JSCompiler_StaticMethods_onResize$$($rulerA$$, function($width$$14$$) {
					$widthA$$ = $width$$14$$;
					$check$$1$$();
				});

				$JSCompiler_StaticMethods_setFont$$($rulerA$$, $JSCompiler_StaticMethods_getStyle$$($that$$1$$, '"' + $that$$1$$.family + '",sans-serif'));
				$JSCompiler_StaticMethods_onResize$$($rulerB$$, function($width$$15$$) {
					$widthB$$ = $width$$15$$;
					$check$$1$$();
				});

				$JSCompiler_StaticMethods_setFont$$($rulerB$$, $JSCompiler_StaticMethods_getStyle$$($that$$1$$, '"' + $that$$1$$.family + '",serif'));
				$JSCompiler_StaticMethods_onResize$$($rulerC$$, function($width$$16$$) {
					$widthC$$ = $width$$16$$;
					$check$$1$$();
				});

				$JSCompiler_StaticMethods_setFont$$($rulerC$$, $JSCompiler_StaticMethods_getStyle$$($that$$1$$, '"' + $that$$1$$.family + '",monospace'));
			});
		}
	});
}

export default $fontface$Observer$$;
