$(document).ready(function()
{
	var cloudID=1; //for assigning unique ID to every obstacle
	var score=0; 
	var isGameRunning=false;
	var gameInterval; 
	function runGame()
	{
		$('#splash-screen').fadeOut(200);
		$('#gameOver-overlay').fadeOut(200);
		$('#mau,#score').show();
		$('.cloud').remove(); //remove existing obstacles from last game, if any.
		$('#score').html('0'); //reset score.
		isGameRunning=true;
		score=0;
		cloudID=1; //reset unique obstacle ID, doesn't do much.
		gameInterval=setInterval(function(){generateCloud()},1000);
	}
	
	function stopGame()
	{
		isGameRunning=false;
		clearInterval(gameInterval); //stop new obstacles from generating
		$('.cloud').stop();
		$('#final-score').html('Your score: '+score);
		$('#gameOver-overlay').fadeIn(300);
	}
	
	
	$('#over-back').click(function(){  
		$('#mau,#score').hide();
		$('#gameOver-overlay').hide();
		$('.cloud').remove();
		$('#splash-screen').fadeIn(200);
	});
	
	$('#play,#replay').click(function(){
		runGame();
	});
	
	$('#howto-button').click(function(){
		$('#options').fadeToggle(200);
		$('#howto').fadeToggle(200);
	});
	
	$('#howto-back').click(function(){
		$('#options').fadeToggle(200);
		$('#howto').fadeToggle(200);
	})
	
	$('#credits-button').click(function(){
		$('#options').fadeToggle(200);
		$('#credits').fadeToggle(200);
	})
	
	$('#feedback-button').click(function(){
		$('#options').fadeToggle(200);
		$('#feedback').fadeToggle(200);
	})
	
	$('#credits-back').click(function(){
		$('#options').fadeToggle(200);
		$('#credits').fadeToggle(200);
	})
	
	$('#feedback-back').click(function(){
		$('#options').fadeToggle(200);
		$('#feedback').fadeToggle(200);
	})
	
	$('#feedback-submit').click(function(){
		
		/* $.post("https://docs.google.com/forms/d/1A4ujGD57IZAj4AsegpVZBJQg5dBeO7ng5PMZhONBeNg/formResponse",
		{
			'entry.1695216591': $('#user-name').val(),
			'entry.2096742551': $('#user-feedbacl').val()
		},
		function(){
			//alert("Data: " + data + "\nStatus: " + status);
		}); */
		if($('#user-feedback').val().length==0)
		{	
			$('#feedback-success').html('Enter feedback');
			$('#feedback-success').animate({left:'50%'},'fast').delay(1000).animate({left:'150%'},'fast');
			setTimeout(function(){$('#feedback-success').css('left','-50%');},1500);
			return;
		}
		var name=$('#user-name').val().length>0?$('#user-name').val():'Anonymous';
		$.ajax({
			url: 'https://docs.google.com/forms/d/1A4ujGD57IZAj4AsegpVZBJQg5dBeO7ng5PMZhONBeNg/formResponse',
			data: {'entry.1695216591': name, 'entry.2096742551': $('#user-feedback').val()},
			type: "POST",
			dataType: "xml",
			statusCode: {
				0: function() {
					$('#user-feedback').val('');
					$('#feedback-success').html('Thank you.');
					$('#feedback-success').animate({left:'50%'},'fast').delay(1000).animate({left:'150%'},'fast');
					setTimeout(function(){$('#feedback-success').css('left','-50%');},1500);
					
				},
				200: function() {
					$('#user-feedback').val('');
					$('#feedback-success').html('Thank you.');
					$('#feedback-success').animate({left:'50%'},'fast').delay(1000).animate({left:'150%'},'fast');
					setTimeout(function(){$('#feedback-success').css('left','-50%');},1500);
				}
			}
		});
		
	})
	/*
	$(document).on('keydown',function(e){
		
		if(e.which==37)
		{
			if($('#mau').position().left<=1)
				return;
			$('#mau').css('left','-=5');
		}
		
		if(e.which==39)
		{
			if($('#mau').position().left>=249)
				return;
			$('#mau').animate({'left':'+=5'},20);
		}
		
	});
	
	*/
	
	$(document).mousemove(function(e){
		if(!isGameRunning) //if game is not running, move hippo's eyes
		{
			width=$(window).width();
			height=$(window).height();
			
			newWidth=Math.ceil((e.pageX/width)*27);
			newHeight=Math.ceil((e.pageY/height)*27);
			if(newWidth>17)
				newWidth=17;
			if(newHeight>17)
				newHeight=17;
			$('#lEye,#rEye').css({'left':newWidth,top:newHeight});
		}
		else //move the player
		{
			var container= $('#game-container').offset().left;
			var left=e.pageX - container;
			if(left>=249)
				left=249;
			if(left<=1)
				left=1;
			$('#mau').css('left',left+'px');
		}
		
		});
	
	function generateCloud()
	{
		
		var currentID=cloudID;
		var posLeft=Math.floor((Math.random() * 150) + 1);
		//create an img element with random left position
		var cloud="<img class='cloud' src='log.png' style='left:"+posLeft+"px;' id="+currentID+">";
		//add it to the game
		$('#game-container').append(cloud);
		//and animate it to the top of the container
		$('.cloud').animate({'top':'-100px'},2500,'linear');
		//for collision detection
		var interval=setInterval(function(){detect(currentID,interval);},10);
		//clear collision detection for this obstacle and remove it from DOM after the animation is finished
		setTimeout(function()
		{
			if(isGameRunning)
			{
				$('#'+currentID).remove();
				clearInterval(interval);
				$('#score').html(++score);
				//for increasing difficulty
				if(score==10)
				{
					clearInterval(gameInterval);
					gameInterval=setInterval(function(){generateCloud()},800);
				}
				if(score==30)
				{
					clearInterval(gameInterval);
					gameInterval=setInterval(function(){generateCloud()},700);
				}
				
				if(score==50)
				{
					clearInterval(gameInterval);
					gameInterval=setInterval(function(){generateCloud()},600);
				}
			}
		},2500);
		cloudID++;
	}
	
	
	function detect(id,interval)
	{
		if(!document.getElementById(id))
		{
			clearInterval(interval);
			return;
		}
		var mauLeft=$('#mau').position().left;
		var mauRight=$('#mau').position().left+50;
		var mauTop=$('#mau').position().top;
		var mauBottom=$('#mau').position().top+50;
		
		var cloudLeft=$('#'+id).position().left;
		var cloudRight=$('#'+id).position().left+150;
		var cloudTop=$('#'+id).position().top;
		var cloudBottom=$('#'+id).position().top+50;
		
		//var MbottomCtop=(cloudTop<=mauBottom)&&(cloudTop>=mauTop);
		//var MtopCbottom=(cloudBottom>=mauTop)&&(cloudTop<mauTop);
		//var MLeftCleft=(mauLeft>=cloudLeft)&&(mauRight<=cloudRight);
		
		//var leftEdge=(mauRight>=cloudLeft)&&(mauRight<=cloudRight);
		//var rightEdge=(mauLeft<=cloudRight)&&(mauLeft>=cloudLeft);
		
		//if((MbottomCtop||MtopCbottom)&&(MLeftCleft||leftEdge||rightEdge))
			//stopGame();
		
		if (mauLeft < cloudRight &&
			mauRight > cloudLeft &&
			mauTop < cloudBottom &&
			mauBottom > cloudTop)
			stopGame();
	}
	
	
	

});

//https://docs.google.com/forms/d/1A4ujGD57IZAj4AsegpVZBJQg5dBeO7ng5PMZhONBeNg/formResponse?entry.1695216591=hello&entry.2096742551=test&submit=Submit
