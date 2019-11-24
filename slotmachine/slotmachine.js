const SLOTS_PER_REEL = 10;
// radius = Math.round( ( panelWidth / 2) / Math.tan( Math.PI / SLOTS_PER_REEL ) ); 
// current settings give a value of 149, rounded to 150
const REEL_RADIUS = 123;

const Symbols = ["3xBAR", "BAR", "2xBAR", "7", "Cherry", "3xBAR", "BAR", "2xBAR", "7", "Cherry"]

const SpinValues = [-3710, -3746, -3782, -3818, -3854, -3890, -3926, -3962, -3998, -4034];

const LineType = {
    TOP: 'top',
    CENTER: 'center',
    BOTTOM: 'bottom',
}

function createSlots (ring) {
	
	var slotAngle = 360 / SLOTS_PER_REEL;

	for (var i = 0; i < SLOTS_PER_REEL; i ++) {
		var slot = document.createElement('div');
		
		slot.className = 'slot';
		slot.id = 'slot-'+ i;

		// compute and assign the transform for this slot
		var transform = 'rotateX(' + (slotAngle * i) + 'deg)   translateZ(' + REEL_RADIUS + 'px)';

		slot.style.transform = transform;

		// setup the number to show inside the slots
		// the position is randomized to 

		var content = $(slot).append('<img src="images/'+Symbols[i]+'.png" alt="'+Symbols[i]+'" height="60" width="60" >');

		// add the poster to the row
		ring.append(slot);
	}
}

function getSeed() {
	// generate random number smaller than 13 then floor it to settle between 0 and 12 inclusive
	return Math.floor(Math.random()*(SLOTS_PER_REEL));
}

function getIndexOnCenterLine(seed) {
	let degVal = SpinValues[seed];
	let symbolIndex = Math.abs(Math.round((degVal % 360) / 36));
	return symbolIndex;
}

function getIndexOnBottomLine(seed) {
	let degVal = SpinValues[seed];
	let symbolIndex = Math.abs(Math.round((degVal % 360) / 36));
	if(symbolIndex == 0){
	   symbolIndex = 10;	
	}
	return symbolIndex - 1;
}

function getIndexOnTopLine(seed) {
	let degVal = SpinValues[seed];
	let symbolIndex = Math.abs(Math.round((degVal % 360) / 36));
	if(symbolIndex == 9){
	   symbolIndex = -1;	
	}
	return symbolIndex + 1;
}


function calculatePayouts(line, lineType) {
	if (line.toString() == "Cherry,Cherry,Cherry" && lineType === LineType.TOP){
		Blink(1);
		return 2000;
	}else if (line.toString() == "Cherry,Cherry,Cherry" && lineType === LineType.CENTER){
		Blink(2);
		return 1000;
	}else if (line.toString() == "Cherry,Cherry,Cherry" && lineType === LineType.BOTTOM){
	    Blink(3);
		return 4000;
	}else if (line.toString() == "7,7,7"){
		Blink(4);
		return 150;
	}else if (!line.includes("2xBAR") && !line.includes("3xBAR") && !line.includes("BAR")){
		Blink(5);
		return 75;
	}else if (line.toString() == "3xBAR,3xBAR,3xBAR"){
		Blink(6);
		return 50;
	}else if (line.toString() == "2xBAR,2xBAR,2xBAR"){
	    Blink(7);
		return 20;
	}else if (line.toString() == "BAR,BAR,BAR"){
		Blink(8);
		return 10;
	}else if (!line.includes("7") && !line.includes("Cherry")){
	    Blink(9);
		return 5;
	}else {
		return 0;
	}
}



function Blink(rowNum) {
	var interval = setInterval(function(){$('#row'+rowNum).fadeOut(500).fadeIn(500);},500);
    setTimeout(function(){clearInterval(interval);}, 3000);
}

function getPrice(balance) {
	$('#balance').val(balance-1);
}

function addPayouts(sum) {
	let balance = $('#balance').val();
	let total = parseInt(sum) + parseInt(balance);
	$('#balance').val(total);
}

function spin(timer) {
	let balance = $('#balance').val();
	getPrice(balance);

	let sum = 0;
	let centerLine = [];
	let topLine = [];
	let bottomLine = [];
 

	for(var i = 1; i < 4; i ++) {
		var oldSeed = -1;

		var oldClass = $('#ring'+i).attr('class');
		if(oldClass.length > 4) {
			oldSeed = parseInt(oldClass.slice(10));
		}
		var seed = getSeed();
		while(oldSeed == seed) {
			seed = getSeed();
		}
    
	    $('#ring'+i).css('animation','spin-' + seed + ' ' + (timer + i*0.5) + 's')
			        .attr('class','ring spin-' + seed);
	    
		
		var valTop = $('#ring'+i+' #slot-'+getIndexOnTopLine(seed)+' img').attr('alt');	
		var valCenter = $('#ring'+i+' #slot-'+getIndexOnCenterLine(seed)+' img').attr('alt');
		var valBottom = $('#ring'+i+' #slot-'+getIndexOnBottomLine(seed)+' img').attr('alt');

		topLine.push(valTop);
		centerLine.push(valCenter);
		bottomLine.push(valBottom);		
	}
	
	console.log(topLine);
	console.log(centerLine);
	console.log(bottomLine);
	
	sum = calculatePayouts(topLine, LineType.TOP);
	sum = sum + calculatePayouts(centerLine, LineType.CENTER);
	sum = sum + calculatePayouts(bottomLine, LineType.BOTTOM);

	addPayouts(sum); 
}

$(document).ready(function() {
    
 	createSlots($('#ring1'));
 	createSlots($('#ring2'));
 	createSlots($('#ring3'));

 	$('.go').on('click',function(){
 		var timer = 2;
 		spin(timer);
 	})
 
 });