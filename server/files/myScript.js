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


var token = atob(encoded_token_part1+encoded_token_part2);


const myHeaders = new Headers({
	'Authorization': `token ${token}`
});

const myInit = {
	method: 'GET',
	headers: myHeaders,
};

var fetcher_timeout_id;

function playerDataFetcher() {
	var p1URL = 'https://api.github.com/repos/kayas2/kayarepo1/contents/datap1.json?timestamp=' + new Date().getTime();
	
	fetch(p1URL, myInit)
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
	playersJson[0] = myObj;
	
  })
  .catch(error => {
    console.log('Error:', error);
  });

var p2URL = 'https://api.github.com/repos/kayas2/kayarepo1/contents/datap2.json?timestamp=' + new Date().getTime();
	
fetch(p2URL, myInit)
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

	playersJson[1] = myObj;
	
  })
  .catch(error => {
    console.log('Error:', error);
  });
	
var p3URL = 'https://api.github.com/repos/kayas2/kayarepo1/contents/datap3.json?timestamp=' + new Date().getTime();
fetch(p3URL, myInit)
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

	playersJson[2] = myObj;
	
  })
  .catch(error => {
    console.log('Error:', error);
  });
	if(is_first) {
	var wordURL = 'https://api.github.com/repos/kayas2/kayarepo1/contents/worddata.json?timestamp=' + new Date().getTime();
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
	myJson = myObj;
		if(is_first) {
			if(myJson.word.length != 0) {
				setWord(myJson.word);
				$( ".submit_button_inner_2" ).text("RESTART");
				is_game_started = true;
				$( ".player_inner_div:eq("+ (myJson.turn-1) +")" ).addClass("current_player_inner_div");
			} else {
				uploadJSON(myJson);
			}
		}

	is_first = false;
  })
  .catch(error => {
    console.log('Error:', error);
  });
}

	if(trueword != "") {
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
	}

	fetcher_timeout_id = setTimeout(playerDataFetcher, 3000);
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
		$( ".submit_button_inner_2" ).text("RESTART");
	} else {
		clearTimeout(fetcher_timeout_id);
		myJson.word = "";
		myJson.falselets = "";
		myJson.turn = 1;
		trueword = "";
		uploadJSON(myJson);
		setTimeout(function() {
    		uploadJSON(emptyletJson, 1);
		}, 1000);
		setTimeout(function() {
    		uploadJSON(emptyletJson, 2);
		}, 2000);
		setTimeout(function() {
    		uploadJSON(emptyletJson, 3);
		}, 3000);
		deleteCookie("truewordcookiename");
		setWord("");
		$( ".submit_button_inner_2" ).text("SUBMIT");
		setTimeout(playerDataFetcher, 5000);
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
  const repoOwner = 'kayas2';
  var repoName = 'kayarepo1';
	var filePath = "";
	if(arguments.length == 1) {
		filePath = './worddata.json';
	} else {
		filePath = './datap' + playernum + '.json';
	}
  

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
        console.log(json_object);
		  return 0;
      } else {
        throw new Error('Failed to update JSON file');
		  return 1;
      }
    })
    .catch((error) => {
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
