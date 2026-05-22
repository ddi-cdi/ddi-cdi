// global variables
var script_folder = document.currentScript.src.split('/').slice(0, -1).join('/'); // must be before $ ...
$(document).ready(function() {
	// start of diagram in modal part
	function downloadMessage(msg) {
		var isInFullScreen =
			(document.fullscreenElement && document.fullscreenElement !== null) ||
			(document.webkitFullscreenElement &&
				document.webkitFullscreenElement !== null);
		if (isInFullScreen) {
			var el = document.createElement("div");
			el.setAttribute("id", "download-message");
			el.innerHTML = msg;
			setTimeout(function() {
				el.parentNode.removeChild(el);
			}, 5000);
			document.querySelector(".modal-content").prepend(el);
		}
	}
	function openFullScreen() {
		var isInFullScreen =
			(document.fullscreenElement && document.fullscreenElement !== null) ||
			(document.webkitFullscreenElement &&
				document.webkitFullscreenElement !== null);
		if (!isInFullScreen) {
			toggleFullScreen();
		}
	}
	function closeFullScreen() {
		var isInFullScreen =
			(document.fullscreenElement && document.fullscreenElement !== null) ||
			(document.webkitFullscreenElement &&
				document.webkitFullscreenElement !== null);
		if (isInFullScreen) {
			toggleFullScreen();
		}
	}
	//	  var objectTag;
	var svgDocument;
	setTimeout(() => {
		var objectTag = document.querySelector("div#svgDiagram object");
		if (objectTag === null) return; // this is the case if files not with a server
		svgDocument = objectTag.contentDocument; // TODO
		if (svgDocument === null) return; // this is the case if files not with a server
		//	  objectTag.addEventListener('load', function(){
		//    svgDocument = objectTag.contentDocument;
		//	  });
		var rootUri = svgDocument.baseURI.split('/').slice(0, -2).join('/');
		var svgNode = svgDocument.querySelector("svg");
		var svgForModal = svgNode.cloneNode(true);
		var svgAnodes = svgForModal.querySelectorAll("svg a");
		// set uris because the baseURI is different in the clone
		for (const anode of svgAnodes) {
			if (anode.href.baseVal.startsWith('../')) {
				anode.href.baseVal = anode.href.baseVal.replace('..', rootUri);
			}
		}
		var svgForDownload = svgNode.cloneNode(true);
		// tooltip for the modal svg
		svgForModal.querySelector("svg>title").innerHTML = "Pan and zoom the diagram";
		var panzoomArea = document.getElementById("panzoom-area");
		// put a copy of the object svg in the panzoom area
		// Reason: panzoom and object tag result in either pan and no active links or vice versa
		panzoomArea.append(svgForModal);
		var modal = document.getElementById("myModal");
		var closeModal = document.getElementById("closeModal");
		var openModal = document.getElementById("openModal");
		var resetDiagram = document.getElementById("resetDiagram");
		var downloadDiagramPng = document.getElementById("downloadDiagramPng");
		var downloadDiagramSvg = document.getElementById("downloadDiagramSvg");
		/* works for whole diagram but can irritate especially when clicking link 
			  document.querySelector("div#svgDiagram object").contentDocument.querySelector("svg").onclick = function() {
				document.getElementById("myModal").style.display = "block";
			  };
		*/
		/* svg title event works
			  var titleNode = svgDocument.querySelector("svg g>text");
			  titleNode.onclick = function() {
				modal.style.display = "block";
			  };
			  titleNode.style.cursor = "pointer";
		*/
		openModal.onclick = function() {
			openFullScreen();
			modal.style.display = "block";
		};
		closeModal.onclick = function() {
			closeFullScreen();
			modal.style.display = "none";
		};
		// reset panzoom
		resetDiagram.onclick = function() {
			panzoom.reset();
		};
		// download svg as png
		downloadDiagramPng.onclick = function() {
			// code for this and download from https://stackoverflow.com/questions/28226677/save-inline-svg-as-jpeg-png-svg#55013028
			var data = new XMLSerializer().serializeToString(svgForDownload);
			var canvas = document.createElement("canvas");
			var svgTextItems = document.querySelectorAll("svg text");
			var topic = svgTextItems[svgTextItems.length - 1].innerHTML;
			var filename = topic + ".png";
			canvg(canvas, data, {
				renderCallback: function() {
					canvas.toBlob(function(blob) {
						download(filename, blob);
					}, "image/png"); // results in transparent background
					//      }, 'image/jpeg');  // results in black (transparent?) background
				},
			});
			downloadMessage('PNG file downloaded for <br/>' + topic);
		};
		// download svg as svg
		downloadDiagramSvg.onclick = function() {
			const svgAnodes = svgForDownload.querySelectorAll("svg a");
			if (modelDocumentationUrl) {
				for (const anode of svgAnodes) {
					if (anode.href.baseVal.startsWith('../')) {
						anode.href.baseVal = anode.href.baseVal.replace('../', modelDocumentationUrl);
					}
				}
			}
			// code from from https://stackoverflow.com/questions/28226677/save-inline-svg-as-jpeg-png-svg#69067443
			var data = new XMLSerializer().serializeToString(svgForDownload);
			var svgTextItems = document.querySelectorAll("svg text");
			var topic = svgTextItems[svgTextItems.length - 1].innerHTML;
			var filename = topic + ".svg";
			var svgBlob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
			download(filename, svgBlob); // results in save filename
			downloadMessage('SVG file downloaded for <br/>' + topic);
		}
		function download(filename, blob) {
			if (window.navigator.msSaveOrOpenBlob) {
				window.navigator.msSaveBlob(blob, filename);
			} else {
				const elem = window.document.createElement("a");
				elem.href = window.URL.createObjectURL(blob);
				elem.download = filename;
				document.body.appendChild(elem);
				elem.click();
				document.body.removeChild(elem);
			}
		}
		// When the user clicks anywhere outside of the modal, close it
		window.onclick = function(event) {
			if (event.target == modal) {
				modal.style.display = "none";
			}
		};
		// in case of escape, close the modal
		window.addEventListener("keydown", function(event) {
			if (event.key === "Escape") {
				modal.style.display = "none";
			}
		});
		var anchorNodelist = document.querySelectorAll("svg a[target='_top']");
		var anchorArray = Array.from(anchorNodelist);
		var panzoom = Panzoom(document.getElementById("panzoom-area"), {
			canvas: true, // important for pan in whole modal area
			exclude: anchorArray,
			maxScale: 15,
		});
		document
			.getElementById("panzoom-wrapper")
			.addEventListener("wheel", panzoom.zoomWithWheel);
	}, "200");
	// end of diagram in modal part	
	//
	// adjust encoding urls
	$('div.encoding > p > a.external').each(function() {
		changeUrl(this);
	});
	$('section#high-level-documentation > p > a.external').each(function() {
		changeUrl(this);
	});
	function changeUrl(obj) {
		var oldUrl = $(obj).attr("href");
		if (!oldUrl.startsWith('http')) {
			// var newUrl = DOCUMENTATION_OPTIONS["URL_ROOT"] + ".." + oldUrl; URL_ROOT not available anymore 
			var newUrl = script_folder + "/../.." + oldUrl;
		}
		$(obj).attr("href", newUrl);
	}
	// end of adjust encoding urls
	var svgUrl = $('div#diagram object').attr('data');
	//	var svgUrl = $('p.plantuml object').attr('data');
	//	$( 'div#diagram p.plantuml' ).prepend( '<a class="diagram-link" href="' + svgUrl + '" target="_blank">Open diagram in additional window</a>' );
	//	$( 'p.plantuml' ).prepend( '<a class="diagram-link" href="' + svgUrl + '" target="_blank">Open diagram in separate window</a>' );

	// set logo link to external page
	/*
		$("p.logo > a").each(function(){
			$(this).attr('href', modelUrl);
			$(this).attr('target', '_blank');
		});
	*/

	// add tool tips to internal references
	// definition is in additional definition.js created by modelQuery.mtl
	$("a.reference.internal:not(.current)").each(function() {
		//$(":not(li) > a.reference.internal").each(function(){ // but not to TOC
		// strip package name
		term = $(this).text().replace(/[^:]+::/, '');
		tooltip = definition[term];
		if (tooltip === undefined) {
			$(this).attr('title', '');
			//			console.log( term );
		} else {
			$(this).attr('title', tooltip);
/*			$(this).attr('title', ' \n' + tooltip);
			$(this).attr('data-bs-placement', 'right'); // for bootstrap tooltip, right as default
*/		}
	});
	// generic tooltips
	function addTooltip(selector, tooltip) {
		var n = $(selector);
		if (n.length > 0) {
			n.attr('title', tooltip);
		}
	}
	addTooltip('section#diagram > details > summary', definition['tooltip.diagram']);
	addTooltip('section#inheritance > details > summary', definition['tooltip.inheritance']);
	addTooltip('section#attributes > details > summary', definition['tooltip.attribute']);
	addTooltip('section#associations > details > summary', definition['tooltip.association']);
	addTooltip('section#usage > details > summary', definition['tooltip.usage']);
	addTooltip('section#encodings details > summary', definition['tooltip.encoding']);
	addTooltip('section#enumeration-literals > details > summary', definition['tooltip.enumeration-literal']);
	addTooltip('label.sd-tab-label:contains("Canonical XMI"):not(".no-tooltip")', definition['tooltip.canonical-xmi']);
	addTooltip('label.sd-tab-label:contains("XML Schema"):not(".no-tooltip")', definition['tooltip.xml-schema']);
	addTooltip('label.sd-tab-label:contains("JSON Schema"):not(".no-tooltip")', definition['tooltip.json-schema']);
	addTooltip('label.sd-tab-label:contains("Ontology (Turtle)"):not(".no-tooltip")', definition['tooltip.rdf-ontology']);
	addTooltip('label.sd-tab-label:contains("JSON-LD"):not(".no-tooltip")', definition['tooltip.json-ld']);
	addTooltip('label.sd-tab-label:contains("SHACL"):not(".no-tooltip")', definition['tooltip.shacl']);
	addTooltip('label.sd-tab-label:contains("ShEx"):not(".no-tooltip")', definition['tooltip.shex']);
	addTooltip('p#index-0:contains("Fully qualified class")', definition['tooltip.class']);
	addTooltip('p#index-0:contains("Fully qualified datatype")', definition['tooltip.data-type']);
	addTooltip('p#index-0:contains("Fully qualified enumeration")', definition['tooltip.enumeration']);
	addTooltip('div.dt-column-header:has(span.dt-column-title:contains("Coupling"))', definition['tooltip.coupling']);
	addTooltip('section#all-associations th:eq(0)', definition['tooltip.coupling']);
	addTooltip('section#all-associations th:eq(3)', definition['tooltip.navigability']);
	addTooltip('section#all-associations th:eq(4)', definition['tooltip.aggregation-kind']);
	addTooltip('section#all-associations th:eq(5)', definition['tooltip.multiplicity']);
	addTooltip('section#all-associations th:eq(7)', definition['tooltip.multiplicity']);
	addTooltip('section#all-associations th:eq(8)', definition['tooltip.aggregation-kind']);
	addTooltip('section#all-associations th:eq(9)', definition['tooltip.navigability']);
	addTooltip('section#attributes th:eq(4)', definition['tooltip.multiplicity']);
	addTooltip('section#associations th:eq(3)', definition['tooltip.multiplicity']);
	addTooltip('section#associations th:eq(6)', definition['tooltip.multiplicity']);
	addTooltip('section#associations th:eq(7)', definition['tooltip.aggregation-kind']);
	addTooltip('section#usage th:eq(2)', definition['tooltip.classifier']);

	$(function() {
		$('*[title]:not(div#myModal *)').tooltip({
			'placement': 'left',
			'delay': { "show": 500, "hide": 100 }
		});
	});
	// hide page controls if there is only one page
	// see: https://datatables.net/forums/discussion/49572/how-can-i-disable-paging-dynamically
	/*		initComplete: function() {
				alert(this.api().page.info().pages)
				if (this.api().page.info().pages === 1) {
					$('.dataTables_info').hide();
					$('.dataTables_filter').hide();
					$('.dataTables_length').hide();
					$('.dataTables_paginate').hide();
				}
			}
	*/
	// datatables defaults
	$('.main-table').find('colgroup').remove(); // otherwise wrong table width by dt
	$('.main-table').find('th p').contents().unwrap();
	var searchPanesRowsLimit = 5;
	Object.assign(DataTable.defaults, {
		// Don't use responsive: true.
		//   Not all columns are shown and no horizontal scroll bar when using Sphinx Book Theme and Bootstrap.
		layout: {
			top: {
				searchPanes: {
					controls: false, // shows full search item name
					dtOpts: {
						layout: {
							bottom: {
								paging: {
									type: 'numbers'
								},
							},
							bottom: 'info'
						},
						info: true,
						scrollY: '6rem',
						scrollCollapse: true
					},
					i18n: {
						loadMessage: '' // suppress: Loading Search Panes...
					},
					initCollapsed: true,
					layout: 'auto',
					threshold: 1 // default 0.6,
				},
			},
			topStart: 'pageLength',
			topEnd: 'search',
			bottomStart: 'info',
			bottomEnd: 'paging'
		},
		lengthMenu: [[5, 10, 20, -1], [5, 10, 20, "All"]],
		pageLength: 5
	});
	/* OK			Object.assign(DataTable.defaults, {
					// Don't use responsive: true.
					//   Not all columns are shown and no horizontal scroll bar when using Sphinx Book Theme and Bootstrap.
					//   responsive: true
					layout: {
						top: 'searchPanes',
						topStart: 'pageLength',
						topEnd: 'search',
						bottomStart: 'info',
						bottomEnd: 'paging'
					},
					lengthMenu: [[5, 10, 20, -1], [5, 10, 20, "All"]],
					pageLength: 5,
					searchPanes: {
						controls: false,
						dtOpts: {
							layout: {
								bottom: {
									paging: {
										type: 'numbers'
									},
								},
								bottom: 'info'
							},
							info: true,
							scrollY: '7rem'
						},
						i18n: {
							loadMessage: '' // suppress: Loading Search Panes...
						},
						initCollapsed: true,
						threshold: 0.4, // default 0.6,
						layout: 'columns-5'
					},
					select: true
				});
	*/
	function hideForFewRows(dt, selector) {
		if (dt !== undefined) {
			var n = dt.rows().count();
			if (n <= searchPanesRowsLimit) {
				var pc = document.querySelector(selector + ' div.dtsp-panesContainer');
				if (pc !== null) {
					pc.setAttribute('style', 'display: none;')
				}
				var l = document.querySelector(selector + ' div.mt-2:has(div > div.dt-length)');
				if (l !== null) {
					l.setAttribute('style', 'display: none; !important')
					/*				l.setAttribute('style', 'background: blue') */
				}
				var p = document.querySelector(selector + ' div.mt-2:has(div > div.dt-paging)');
				if (p !== null) {
					p.setAttribute('style', 'display: none; !important')
/*					p.setAttribute('style', 'background: blue')
*/				}
			}
		}
	}
/*	var datatable_attributes = $('table#datatable-attributes').DataTable({
*/	var datatable_attributes = $('#attributes-responsive table.main-table').DataTable({
		columnDefs: [
			{ targets: '_all', className: 'dt-head-center' },
			{ targets: [4], className: 'dt-body-center' },
			{ targets: [1, 3], searchPanes: { show: true } },
			{ targets: [0, 2, 4, 5], searchPanes: { show: false } }
		],
		order: [[0, 'asc'], [1, 'asc'], [3, 'asc']],
	});
	hideForFewRows(datatable_attributes, 'section#attributes');
	/*	if (datatable_attributes.rows().count() <= searchPanesRowsLimit) {
			var pc = document.querySelector('div#attributes div.dtsp-panesContainer');
			if (pc !== null) {
				pc.setAttribute('style', 'display: none;')
			}
		}
	*/	// remove markup in table cells REMOVE ?
	/*	$('#datatable-associations').find('th a').contents().unwrap();
		$('#datatable-associations').find('th > p').contents().unwrap();
		
		$('#datatable-associations').find('div.dtsp-searchPanes a').contents().unwrap();
	*/
	//	$('#datatable-associations').find('colgroup').remove(); // otherwise wrong width by dt
	var datatable_associations = $('#associations-responsive table.main-table').DataTable({
		columnDefs: [
			{ targets: '_all', className: 'dt-head-center' },
			{ targets: [0, 3, 6, 7], className: 'narrow-column dt-body-center' },
			{ targets: [2], className: 'description' },
			{ targets: [0, 4, 7, 8], searchPanes: { show: true } },
			{ targets: [1, 2, 3, 5, 6], searchPanes: { show: false } }
		],
		order: [[5, 'asc'], [4, 'asc']]
	});
	hideForFewRows(datatable_associations, 'section#associations');
/*	if (datatable_associations.rows().count() <= searchPanesRowsLimit) {
		var pc = document.querySelector('div#associations div.dtsp-panesContainer');
		if (pc !== null) {
			pc.setAttribute('style', 'display: none;')
		}
		var l = document.querySelector('div.mt-2:has(div > div.dt-length)');
		if (l !== null) {
			l.setAttribute('style', 'display: none; !important')
		}
	}
*/	var datatable_usage = $('#usage-responsive table.main-table').DataTable({
		columnDefs: [
			{ targets: '_all', className: 'dt-head-center' },
			{ targets: [0, 1, 3], searchPanes: { show: true } },
			{ targets: [2], searchPanes: { show: false } }
		],
		order: [[0, 'asc'], [1, 'asc'], [2, 'asc'], [3, 'asc']]
	});
	hideForFewRows(datatable_usage, 'section#usage');
/*	if (datatable_usage.rows().count() <= searchPanesRowsLimit) {
		var pc = document.querySelector('div#usage div.dtsp-panesContainer');
		if (pc !== null) {
			pc.setAttribute('style', 'display: none;')
		}
	}
*/	var datatable_enumeration_literals = $('#enumeration-literals-responsive table.main-table').DataTable({
		columnDefs: [
			{ targets: '_all', className: 'dt-head-center' },
			{ targets: '_all', searchPanes: { show: false } }
		],
		order: [[0, 'asc']]
	});
	hideForFewRows(datatable_enumeration_literals, 'section#enumeration-literals');
	var datatable_classes_list = $('table#datatable-classes-list').DataTable({
		columnDefs: [
			{ targets: '_all', className: 'dt-head-center' },
			{ targets: [3, 4], className: 'dt-body-center' },
			{ targets: [2, 5, 6, 7, 8, 9, 10], className: 'dt-body-reight' },
			{ targets: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], searchPanes: { show: true } },
			{ targets: [0], searchPanes: { show: false } }
		],
		order: [[0, 'asc']]
	});
	hideForFewRows(datatable_classes_list, 'section#all-classes');
/*	if (datatable_classes_list.rows().count() <= searchPanesRowsLimit) {
		var pc = document.querySelector('section.all-classes-list div.dtsp-panesContainer');
		if (pc !== null) {
			pc.setAttribute('style', 'display: none;')
		}
	}
*/	var datatable_associations_list = $('table#datatable-associations-list').DataTable({
		columnDefs: [
			{ targets: '_all', className: 'dt-head-center' },
			{ targets: [0, 3, 4, 5, 7, 8, 9], className: 'dt-body-center narrow-column' }
		],
		order: [[1, 'asc'], [2, 'asc'], [10, 'asc'], [11, 'asc']]
	});
	hideForFewRows(datatable_associations_list, 'section#all-associations');
/*	if (datatable_associations_list.rows().count() <= searchPanesRowsLimit) {
		var pc = document.querySelector('section.all-associations-list div.dtsp-panesContainer');
		if (pc !== null) {
			pc.setAttribute('style', 'display: none;')
		}
	}
*/	var datatable_datatypes_list = $('table#datatable-datatypes-list').DataTable({
		columnDefs: [
			{ targets: '_all', className: 'dt-head-center' },
			{ targets: [4], className: 'dt-body-center' },
			{ targets: [3, 5, 6, 7, 8, 9], className: 'dt-body-right' },
			{ targets: [1, 2, 3, 4, 5, 6, 7, 8, 9], searchPanes: { show: true } },
			{ targets: [0], searchPanes: { show: false } }
		],
		order: [[0, 'asc']]
	});
	hideForFewRows(datatable_datatypes_list, 'section#all-structured-data-types');
	var datatable_enumerations_list = $('table#datatable-enumerations-list').DataTable({
		columnDefs: [
			{ targets: '_all', className: 'dt-head-center' },
			{ targets: [2, 3], className: 'dt-body-center' },
			{ targets: ['_all'], searchPanes: { show: true } },
			{ targets: [], searchPanes: { show: false } }
		],
		order: [[1, 'asc'], [0, 'asc']]
	});
	hideForFewRows(datatable_datatypes_list, 'section#all-enumerations');
/*	if (datatable_datatypes_list.rows().count() <= searchPanesRowsLimit) {
		var pc = document.querySelector('section.all-data-types-list div.dtsp-panesContainer');
		if (pc !== null) {
			pc.setAttribute('style', 'display: none;')
		}
	}
*/	var datatable_packages_list = $('table#datatable-packages-list').DataTable({
		columnDefs: [
			{ targets: '_all', className: 'dt-head-center' },
			{ targets: [2, 3, 4], className: 'dt-body-right' },
			{ targets: [1], searchPanes: { show: true } },
		],
		order: [[1, 'asc'], [0, 'asc']],
	});
	hideForFewRows(datatable_packages_list, 'section#all-packages');
	/*	if (datatable_packages_list.rows().count() <= searchPanesRowsLimit) {
			var pc = document.querySelector('section.all-packages-list div.dtsp-panesContainer');
			if (pc !== null) {
				pc.setAttribute('style', 'display: none;')
			}
		}
	*/

	$("div.dtsp-searchPanes").wrap("<div class='dtsp-searchPanes-wrapper'></div>");
	// open dropdown for fragment identifier
	var fragment = window.location.hash.substring(1);
	if (fragment !== '') {
		openDropdown(fragment);
	}
	function openDropdown(fragment) {
		var selector = 'details.' + fragment + '-dropdown';
		var section = document.querySelector(selector);
		if (section !== null) {
			section.setAttribute('open', true);
		}
		document.getElementById(fragment).scrollIntoView({ behavior: 'smooth' });
	}
	// set section header visible for print if dropdown is open
	window.onbeforeprint = function() { beforeprint() };
	window.onafterprint = function() { afterprint() };
	function beforeprint() {
		headerVisible('inheritance');
		headerVisible('encodings');
	}
	function afterprint() {
		headerHidden('inheritance');
		headerHidden('encodings');
	}
	function headerVisible(sectionIdentifier) {
		var h2 = document.querySelector('section#' + sectionIdentifier + ' > h2');
		var dropdown = document.querySelector('details.' + sectionIdentifier + '-dropdown');
		if (dropdown !== null && dropdown.open === true) {
			h2.setAttribute('style', 'visibility: visible;')
		}
	}
	function headerHidden(sectionIdentifier) {
		var h2 = document.querySelector('section#' + sectionIdentifier + ' > h2');
		if (h2 !== null) {
			h2.setAttribute('style', 'visibility: hidden;')
		}
	}
	// click on anchors opens dropdown
	$('[href="#diagram"]').on('click', function() {
		openDropdown($(this).attr('href').substring(1));
	});
	$('[href="#inheritance"]').on('click', function() {
		openDropdown($(this).attr('href').substring(1));
	});
	$('[href="#attributes"]').on('click', function() {
		openDropdown($(this).attr('href').substring(1));
	});
	$('[href="#associations"]').on('click', function() {
		openDropdown($(this).attr('href').substring(1));
	});
	$('[href="#encodings"]').on('click', function() {
		openDropdown($(this).attr('href').substring(1));
	});
	//	$("div.legend-searchpanes").html('Values in the interactive panel indicate frequencies in all unfiltered rows. Filters can be combined.');
	$("div.legend-allassociations").html("Green underlined links in column 'Package 2' go to the list of associated packages of the clicked package.");

	$('div.dtsp-searchPane div.dtsp-topRow div.dtsp-searchCont input.dtsp-search').each(function(i) {
		var placeholderWithoutHtml = $(this).attr('placeholder').replace(/<p[^>]*>(.+)<\/p>/, "$1");
		//        var placeholderWithoutHtml = $(this).attr('placeholder').replace(/(<([^>]+)>)/gi, '');
		$(this).attr('placeholder', placeholderWithoutHtml);
	});

	// pan and zoom
	// see https://timmywil.com/panzoom/
	/* issue: events are not active in svg area
	const element = document.querySelector('div#id2');
	const panzoom = Panzoom(element, {
		  // options here
	});
	const parent = element.parentElement;
	parent.addEventListener('dblclick', panzoom.reset);
	parent.addEventListener('wheel', function (event) {
	  if (!event.shiftKey) return
	  panzoom.zoomWithWheel(event);
	})
	*/
	// css for all leaf entries
	$('li:not( :has( a[href*="index.html"].reference.internal ) ):not( :has( ul ) )').css('list-style', 'none').addClass('dot');
	// applies the current item hierarchy in the sidebar toc
	//	$('li:has( a[href="#"].reference.internal )').css('color', 'red'); already available as current class

});

// TODO is this not just a package or is it specific to cdi?
function selectPackage(cdiPackage) {
	$('table.dt-allassociations').DataTable().searchPanes.clearSelections();
	selectRow(0, 'yes'); // package coupling
	selectRow(1, cdiPackage);
}

function selectRow(paneNumber, searchString) {
	// Select the desired pane from the dom
	var table = $($('div.dtsp-searchPane div.dataTables_scrollBody table')[paneNumber]).DataTable();
	var rows = table.rows().toArray(); // Get the row data for that pane
	// Iterate over the rows until search string is found, then select that row
	for (var i = 0; i < rows[0].length; i++) {
		var row = table.row(rows[0][i]);
		if (row.data().filter === searchString) {
			row.select();
		}
	}
}

/*
Overwrite of functions in sidebar.js.
Use of sessionStorage instead of document.cookie.
The latter is not allowed for the file protocol in some browsers (i.e. Chrome, Opera)
*/

function collapse_sidebar() {
	sidebarwrapper.hide();
	sidebar.css('width', ssb_width_collapsed);
	bodywrapper.css('margin-left', bw_margin_collapsed);
	sidebarbutton.css({
		'margin-left': '0',
		'height': bodywrapper.height()
	});
	sidebarbutton.find('span').text('»');
	sidebarbutton.attr('title', _('Expand sidebar'));
	//  sessionStorage.setItem("sidebar", "collapsed");
	window.name = "collapsed";
}

function expand_sidebar() {
	bodywrapper.css('margin-left', bw_margin_expanded);
	sidebar.css('width', ssb_width_expanded);
	sidebarwrapper.show();
	sidebarbutton.css({
		'margin-left': ssb_width_expanded - 12,
		'height': bodywrapper.height()
	});
	sidebarbutton.find('span').text('«');
	sidebarbutton.attr('title', _('Collapse sidebar'));
	//  sessionStorage.setItem("sidebar", "expanded");
	window.name = "expanded";
}

function set_position_from_cookie() {
	if (!sessionStorage.sidebar)
		return;
	//  value = sessionStorage.getItem("sidebar");
	value = window.name;
	if ((value == 'collapsed') && (!sidebar_is_collapsed()))
		collapse_sidebar();
	else if ((value == 'expanded') && (sidebar_is_collapsed()))
		expand_sidebar();
}

/**
 * @summary     ConditionalPaging
 * @description Hide paging controls when the amount of pages is <= 1
 * @version     1.0.0
 * @file        dataTables.conditionalPaging.js
 * @author      Matthew Hasbach (https://github.com/mjhasbach)
 * @contact     hasbach.git@gmail.com
 * @copyright   Copyright 2015 Matthew Hasbach
 *
 * License      MIT - http://datatables.net/license/mit
 *
 * This feature plugin for DataTables hides paging controls when the amount
 * of pages is <= 1. The controls can either appear / disappear or fade in / out
 *
 * @example
 *    $('#myTable').DataTable({
 *        conditionalPaging: true
 *    });
 *
 * @example
 *    $('#myTable').DataTable({
 *        conditionalPaging: {
 *            style: 'fade',
 *            speed: 500 // optional
 *        }
 *    });
 */

// from https://github.com/DataTables/Plugins/blob/master/features/conditionalPaging/dataTables.conditionalPaging.js
// works! but only for paging control not for info and search
(function(window, document, $) {
	$(document).on('init.dt', function(e, dtSettings) {
		if (e.namespace !== 'dt') {
			return;
		}

		var options = dtSettings.oInit.conditionalPaging || $.fn.dataTable.defaults.conditionalPaging;

		if ($.isPlainObject(options) || options === true) {
			var config = $.isPlainObject(options) ? options : {},
				api = new $.fn.dataTable.Api(dtSettings),
				speed = 'slow',
				conditionalPaging = function(e) {
					var $paging = $(api.table().container())
						.find('div.dataTables_filter, div.dataTables_paginate'),
						// JW                   var $paging = $(api.table().container()).find('div.dataTables_paginate'),
						pages = api.page.info().pages;

					if (e instanceof $.Event) {
						if (pages <= 1) {
							if (config.style === 'fade') {
								$paging.stop().fadeTo(speed, 0);
							}
							else {
								$paging.css('display', 'none');
								// JW                               $paging.css('visibility', 'hidden');
							}
						}
						else {
							if (config.style === 'fade') {
								$paging.stop().fadeTo(speed, 1);
							}
							else {
								$paging.css('display', '');
								// JW                                $paging.css('visibility', '');
							}
						}
					}
					else if (pages <= 1) {
						if (config.style === 'fade') {
							$paging.css('opacity', 0);
						}
						else {
							$paging.css('display', 'none');
							// JW                            $paging.css('visibility', 'hidden');
						}
					}
				};

			if (config.speed !== undefined) {
				speed = config.speed;
			}

			conditionalPaging();

			api.on('draw.dt', conditionalPaging);
		}
	});
})(window, document, jQuery);
// which is better?
// });
