var encoded_token_part1 = "Z2hwX3FqMm5NbUNFMDRmb2dJQWt";
var encoded_token_part2 = "wZGxudGY0b2gzYWNCVjJkbHBDSQ==";

var trueword = "ananas";
var hangingpercentage = 0;
var worddatajson = null;
var url = $(location).attr("href");
var player_num = parseInt(url[url.indexOf('?p')+2]);
var playable = false;
var myJson = {
	"letter": "c",
	"playername": ""
};


        var myHeaders = new Headers();
        myHeaders.append('pragma', 'no-cache');
        myHeaders.append('cache-control', 'no-cache');

        var myInit = {
            method: 'GET',
            headers: myHeaders,
        };

        var myRequest = new Request('https://raw.githubusercontent.com/kayas2/kayarepo1/main/datap3.json');

function fetchWordData() {
	fetch('https://raw.githubusercontent.com/kayas2/kayarepo1/main/worddata.json', {  
  method: 'GET', cache: 'no-cache' })
	  .then(response => response.json())
	  .then(myObj => {
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
			for(let i = wordlen; i < currentwordlen; i++) {
				$( ".words_letters_inner:eq("+ i +")" ).remove();
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
				//$( ".words_letters_inner:eq("+ i +")" ).text(worddatajson.word[i]);
		}
		if(falseletcount == 0)
			$(".hangman_draw").css("visibility", "hidden");
		
		for(let i = 0; i < falseletcount; i++) {
			$(".hangman_draw:eq(" + i + ")").css("visibility", "visible");
		}

	  })
	  .catch(error => {
		// Handle any errors that occur during the fetch request
		console.log('Error:', error);
	  });
	setTimeout(fetchWordData, 5000);
}



$( document ).ready(function() {
	fetchWordData();
	//uploadJSON(myJson);
	
	//$(".hangman_header_text").text("test yazı alanı");



	
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
  // Update the data as desired
  /*const updatedData = {
    someKey: 'çok seviyorum'
  };*/
	var token = atob(encoded_token_part1+encoded_token_part2);
  //var token = key;
  const repoOwner = 'kayas2';
  var repoName = 'kayarepo1';
  var filePath = './datap' + player_num + '.json';

  // Convert the updated data to JSON
  const updatedJsonData = JSON.stringify(json_object, null, 2);

  // Fetch the current file details, including SHA
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

      // Remove backslashes before quotes
      //const contentWithoutBackslashes = updatedJsonData.replace(/\\/g, '').replace(/^"(.*)"$/, '$1');
      //const contentWithoutBackslashes = updatedJsonData.replace(/^"(.*)"$/, '$1');
      const contentWithoutBackslashes = updatedJsonData;

      // Encode the JSON data to base64
      const encoder = new TextEncoder();
      const data = encoder.encode(contentWithoutBackslashes);
      const contentBase64 = btoa(String.fromCharCode.apply(null, new Uint8Array(data)));

      // Make an HTTP request to update the file
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
