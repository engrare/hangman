var encoded_token_part1 = "Z2hwX3FqMm5NbUNFMDRmb2dJQWt";
var encoded_token_part2 = "wZGxudGY0b2gzYWNCVjJkbHBDSQ==";


var trueword = "";
var myJson = {
	"word": "",
	"falselets": "",
	"turn": 1
};

var playersJson = [	{},{},{} ];

var emptyletJson = {
	"letter": ""
};

var is_first = true;
var is_game_started = false;




function playerDataFetcher() {
	var p1URL = 'https://api.github.com/repos/kayas2/kayarepo1/contents/datap1.json?timestamp=' + new Date().getTime();
	fetch(p1URL)
.then(response => {
	if (!response.ok) {
		throw new Error('Network response was not ok ' + response.statusText);
	}
	return response.json();
})
.then(data => {
	// The content is base64 encoded, so we need to decode it
	var base64Content = data.content;
	var jsonString = atob(base64Content);
	var myObj = JSON.parse(jsonString);
	playersJson[0] = myObj;
	//console.log(playersJson[0]);
	
  })
  .catch(error => {
    // Handle any errors that occur during the fetch request
    console.log('Error:', error);
  });

var p2URL = 'https://api.github.com/repos/kayas2/kayarepo1/contents/datap2.json?timestamp=' + new Date().getTime();
fetch(p2URL)
.then(response => {
	if (!response.ok) {
		throw new Error('Network response was not ok ' + response.statusText);
	}
	return response.json();
})
.then(data => {
	// The content is base64 encoded, so we need to decode it
	var base64Content = data.content;
	var jsonString = atob(base64Content);
	var myObj = JSON.parse(jsonString);

	playersJson[1] = myObj;
	//console.log(playersJson[1]);
	
  })
  .catch(error => {
    // Handle any errors that occur during the fetch request
    console.log('Error:', error);
  });
	
var p3URL = 'https://api.github.com/repos/kayas2/kayarepo1/contents/datap2.json?timestamp=' + new Date().getTime();
fetch(p3URL)
.then(response => {
	if (!response.ok) {
		throw new Error('Network response was not ok ' + response.statusText);
	}
	return response.json();
	})
	.then(data => {
	// The content is base64 encoded, so we need to decode it
	var base64Content = data.content;
	var jsonString = atob(base64Content);
	var myObj = JSON.parse(jsonString);

	playersJson[2] = myObj;
	//console.log(playersJson[2]);
	
  })
  .catch(error => {
    // Handle any errors that occur during the fetch request
    console.log('Error:', error);
  });
	if(is_first) {
	var wordURL = 'https://api.github.com/repos/kayas2/kayarepo1/contents/datap2.json?timestamp=' + new Date().getTime();
	fetch(wordURL)
	.then(response => {
		if (!response.ok) {
			throw new Error('Network response was not ok ' + response.statusText);
		}
		return response.json();
	})
.then(data => {
	// The content is base64 encoded, so we need to decode it
	var base64Content = data.content;
	var jsonString = atob(base64Content);
	var myObj = JSON.parse(jsonString);
	myJson = myObj;
	if(myJson.word.length != 0) {
		setWord(myJson.word);
		$( ".submit_button_inner_2" ).text("RESTART");
		is_game_started = true;
		$( ".player_inner_div:eq("+ (myJson.turn-1) +")" ).addClass("current_player_inner_div");
	} else {
		uploadJSON(myJson);
	}
	is_first = false;
  })
  .catch(error => {
    // Handle any errors that occur during the fetch request
    console.log('Error:', error);
  });
}

	let inputletter = playersJson[myJson.turn-1].letter;
	let word_changed = false;
	if(inputletter != "") {
		if(trueword.includes(inputletter)) {
			if(!myJson.word.includes(inputletter)) {
				for(let i = 0; i < trueword.length; i++) {
					if(inputletter == trueword[i]) {
						myJson.word = myJson.word.slice(0, i) + trueword[i] + myJson.word.slice(i+1, trueword.length);
						setWord(myJson.word);
						word_changed = true;
					}
				}
			}
		} else {
			if(!myJson.falselets.includes(inputletter)) {
				if (typeof inputletter !== 'undefined') {
					myJson.falselets += inputletter;
					word_changed = true;
					
				}
			}
		}
	}
	if(word_changed) {
		if(myJson.turn == 3) {
			myJson.turn = 1;
		} else {
			myJson.turn++;
		}
		uploadJSON(myJson);
	}
		
	console.log(playersJson[0].letter + " " + playersJson[1].letter + " " + playersJson[2].letter + " " + myJson.word + " ");
	setTimeout(playerDataFetcher, 5000);
}



$( document ).ready(function() {
	trueword = readCookie("truewordcookiename");
	$( ".submit_button_inner_2" ).text("SUBMIT");
	playerDataFetcher();
	
$( ".submit_button_inner_1" ).on( "click", function() {
	if($( ".submit_button_inner_2" ).text() == "SUBMIT") {
		trueword = $(".words_letters_inner").text().toUpperCase();
		setCookie("truewordcookiename", trueword, 100);
		myJson.word = "_";
		for(var i = 1; i < trueword.length; i++) {
			myJson.word += "_";
		}
		setWord(myJson.word);
		uploadJSON(myJson);
		setTimeout(function() {
    		uploadJSON(emptyletJson, 1);
		}, 500);
		setTimeout(function() {
    		uploadJSON(emptyletJson, 2);
		}, 1000);
		setTimeout(function() {
    		uploadJSON(emptyletJson, 3);
		}, 1500);
		$( ".submit_button_inner_2" ).text("RESTART");
	} else {
		myJson.word = "";
		myJson.falselets = "";
		myJson.turn = 1;
			
		setTimeout(playerDataFetcher, 5000);
		uploadJSON(myJson);
		deleteCookie("truewordcookiename");
		setWord("");
		$( ".submit_button_inner_2" ).text("SUBMIT");
	}

});
  
});


function setWord(newword) {
	if(newword == "") {
		$(".words_letters_inner:not(:first)").remove();
		$(".words_letters_inner:first").attr('contenteditable','true').text("TEXT");
	} else {
		$(".words_letters_inner:not(:first)").remove();
		$(".words_letters_inner").text("_").attr('contenteditable','false');
		for(let i = 0; i < newword.length-1; i++) {
			$(".words_letters_inner:first").clone().appendTo(".words_div").text("_");
		}
	}

}





function uploadJSON(json_object, playernum) {
  // Update the data as desired
  /*const updatedData = {
    someKey: 'çok seviyorum'
  };*/
	var token = atob(encoded_token_part1+encoded_token_part2);
  //var token = key;
  const repoOwner = 'kayas2';
  var repoName = 'kayarepo1';
	var filePath = "";
	if(arguments.length == 1) {
		filePath = './worddata.json';
	} else {
		filePath = './datap' + playernum + '.json';
	}
  

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
        console.log(json_object);
		 // $("#warning_for_acc_upload").text("Başarıyla güncelleme yapıldı.").show().fadeOut(1500);
		  return 0;
      } else {
		 // $("#warning_for_acc_upload").text("Güncelleme başarısız oldu.").show().fadeOut(1500);
        throw new Error('Failed to update JSON file');
		  return 1;
      }
    })
    .catch((error) => {
	  //("#warning_for_acc_upload").text("Güncelleme başarısız oldu.").show().fadeOut(1500);
      console.error('Error updating JSON file:', error.message);
    });
}


function deleteCookie(cookieName) {
    document.cookie = cookieName + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function readCookie(cookieName) {
    var name = cookieName + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
