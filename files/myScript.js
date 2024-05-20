var encoded_token_part1 = "Z2hwX3FqMm5NbUNFMDRmb2dJQWt";
var encoded_token_part2 = "wZGxudGY0b2gzYWNCVjJkbHBDSQ==";

var worddatajson = null;
var url = $(location).attr("href");
var player_num = parseInt(url[url.indexOf('?p')+2]);
var playable = false;
var myJson = {
	"letter": "c",
	"playername": ""
};
var wordURL = "";

var token = atob(encoded_token_part1+encoded_token_part2);


const myHeaders = new Headers({
	'Authorization': `token ${token}`
});

const myInit = {
	method: 'GET',
	headers: myHeaders,
};

function fetchWordData() {
	wordURL = 'https://api.github.com/repos/kayas2/kayarepo1/contents/worddata.json?timestamp=' + new Date().getTime();
	fetch(wordURL, myInit)
.then(response => {
	if (!response.ok) {
		throw new Error('Network response was not ok ' + response.statusText);
	}
	return response.json();
})
.then(data => {
	
	var base64Content = data.content;
	var jsonString = atob(base64Content);
	var myObj = JSON.parse(jsonString);
		worddatajson = myObj;
		console.log(worddatajson);
		if(worddatajson.turn == player_num) {
			playable = true;
		} else {
			playable = false;
		}
		$( ".player_inner_div" ).removeClass("current_player_inner_div");
		$( ".player_inner_div:eq(" + (worddatajson.turn-1) + ")" ).addClass("current_player_inner_div");
		
		var wordlen = worddatajson.word.length;
		currentwordlen = $( ".words_letters_inner" ).length;
		if(currentwordlen < wordlen) {
			for(let i = currentwordlen; i < wordlen; i++) {
				$( ".words_letters_inner:first" ).clone().appendTo( ".words_div" );
			}
		} else {
			if(wordlen > 1) {			
				for(let i = wordlen; i < currentwordlen; i++) {
					$( ".words_letters_inner:eq("+ i +")" ).remove();
				}
				
			} else {
				$( ".words_letters_inner:not(:first)" ).remove();
				$( ".words_letters_inner:first" ).text("_");
				$(".game_over_text").css("display", "none");
				myJson.letter = "";
			}

		}
		for(let i = 0; i < wordlen; i++) {
			$( ".words_letters_inner:eq("+ i +")" ).text(worddatajson.word[i]);
		}
		var totaltel = $( ".letters_inner" ).length;
		
		var falseletcount = worddatajson.falselets.length;
		var state;
		for(let i = 0; i < totaltel; i++) {
			state = 0;
			for(let j = 0; j < falseletcount; j++) {
				if(worddatajson.falselets[j].toUpperCase() == $( ".letters_inner:eq("+ i +")" ).text().toUpperCase()) {
					$( ".letters_inner:eq("+ i +")" ).addClass("letters_inner_false");
					state++;
				}
			}
			for(let j = 0; j < wordlen; j++) {
				if(worddatajson.word[j].toUpperCase() == $( ".letters_inner:eq("+ i +")" ).text().toUpperCase()) {
					$( ".letters_inner:eq("+ i +")" ).addClass("letters_inner_true");
					state++;
				}
			}
			if(!state) {
				$( ".letters_inner:eq("+ i +")" ).removeClass("letters_inner_false");
				$( ".letters_inner:eq("+ i +")" ).removeClass("letters_inner_true");
				
			}
		}
		if(falseletcount == 0)
			$(".hangman_draw").css("visibility", "hidden");
		
		for(let i = 0; i < falseletcount; i++) {
			$(".hangman_draw:eq(" + i + ")").css("visibility", "visible");
		}
		
		if(falseletcount > 5) {
			$(".game_over_text").css("display", "block");
		}

		
		

	  })
	  .catch(error => {
		console.log('Error:', error);
	  });
	setTimeout(fetchWordData, 5000);
}



$( document ).ready(function() {
	fetchWordData();



	
$( ".letters_inner" ).on( "click", function() {
	if(!($(this).hasClass( "letters_inner_true" ) || $(this).hasClass( "letters_inner_false" ))) {
		$(".letters_inner").removeClass("letters_inner_selected");
		$(this).addClass("letters_inner_selected");
		myJson.letter = $(this).text();
	}
	
});
	
$( ".submit_button_inner_1" ).on( "click", function() {
	if(worddatajson.turn == player_num) {
		uploadJSON(myJson);
	}

});

  
});


function uploadJSON(json_object) {
  const repoOwner = 'kayas2';
  var repoName = 'kayarepo1';
  var filePath = './datap' + player_num + '.json';


  const updatedJsonData = JSON.stringify(json_object, null, 2);


  fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  })
    .then((response) => {
      if (response.ok) {
		  return response.json();
      } else {
		throw new Error('Failed to fetch file details');
      }
    })
    .then((fileData) => {
      const currentSHA = fileData.sha;
      const contentWithoutBackslashes = updatedJsonData;

      const encoder = new TextEncoder();
      const data = encoder.encode(contentWithoutBackslashes);
      const contentBase64 = btoa(String.fromCharCode.apply(null, new Uint8Array(data)));


      return fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Update JSON file',
          content: contentBase64,
          sha: currentSHA
        })
      });
    })
    .then((response) => {
      if (response.ok) {
        console.log('JSON file updated successfully');
		  $("#warning_for_acc_upload").text("Başarıyla güncelleme yapıldı.").show().fadeOut(1500);
		  return 0;
      } else {
		  $("#warning_for_acc_upload").text("Güncelleme başarısız oldu.").show().fadeOut(1500);
        throw new Error('Failed to update JSON file');
		  return 1;
      }
    })
    .catch((error) => {
	  ("#warning_for_acc_upload").text("Güncelleme başarısız oldu.").show().fadeOut(1500);
      console.error('Error updating JSON file:', error.message);
    });
}
