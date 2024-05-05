var trueword = "";
const key_cookie = "repokeycookie";
var hangingpercentage = 0;
var myJson = {
	"word": "",
	"falselets": "",
	"turn": 1
};
var myOldJson = null;

var playersJson = [
	{},{},{}
	
	
];

var emptyletJson = {
	"letter": ""
};

var oldletters = ["", "", ""];

var is_first = true;
var is_game_started = false;


function playerDataFetcher() {
	fetch('https://raw.githubusercontent.com/kayas2/kayarepo1/main/datap1.json')
  .then(response => response.json())
  .then(myObj => {
	playersJson[0] = myObj;
	//console.log(playersJson[0]);
	
  })
  .catch(error => {
    // Handle any errors that occur during the fetch request
    console.log('Error:', error);
  });


fetch('https://raw.githubusercontent.com/kayas2/kayarepo1/main/datap2.json?' + new Date().getTime())
  .then(response => response.json())
  .then(myObj => {
	playersJson[1] = myObj;
	//console.log(playersJson[1]);
	
  })
  .catch(error => {
    // Handle any errors that occur during the fetch request
    console.log('Error:', error);
  });

fetch('https://raw.githubusercontent.com/kayas2/kayarepo1/main/datap3.json?' + new Date().getTime())
  .then(response => response.json())
  .then(myObj => {
	playersJson[2] = myObj;
	//console.log(playersJson[2]);
	
  })
  .catch(error => {
    // Handle any errors that occur during the fetch request
    console.log('Error:', error);
  });
	if(is_first) {
	fetch('https://raw.githubusercontent.com/kayas2/kayarepo1/main/worddata.json?' + new Date().getTime())
  .then(response => response.json())
  .then(myObj => {
	myJson = myObj;
	if(myJson.word.length != 0) {
		setWord(myJson.word);
		$( ".submit_button_inner_2" ).text("RESTART");
		is_game_started = true;
		$( ".player_inner_div:eq("+ (myJson.turn-1) +")" ).addClass("current_player_inner_div");
	}
	is_first = false;
  })
  .catch(error => {
    // Handle any errors that occur during the fetch request
    console.log('Error:', error);
  });
}
	
	if(playersJson[myJson.turn-1].letter != oldletters[myJson.turn-1]) {
		
		if(myJson.turn == 3) {
			myJson.turn = 1;
		} else {
			myJson.turn++;
		}
		var is_let_true = false;
		for(let i = 0; i < trueword.length; i++) {
			if(playersJson[myJson.turn-1].letter == trueword[i]) {
				myJson.word = myJson.word.slice(0, i) + trueword[i] + myJson.word.slice(i+1, trueword.length);
				is_let_true = true;
			}
		}
		if(!is_let_true) {
			myJson.falselets += playersJson[myJson.turn-1].letter;
		}
	}
	
	
	setTimeout(playerDataFetcher, 5000);
}



$( document ).ready(function() {
	trueword = readCookie("truewordcookiename");
	$( ".submit_button_inner_2" ).text("SUBMIT");
	playerDataFetcher();
	
$( ".submit_button_inner_1" ).on( "click", function() {
	if($( ".submit_button_inner_2" ).text() == "SUBMIT") {
		trueword = $(".words_letters_inner").text();
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
		for(let i = 0; i < oldletters.length; i++)
			oldletters[i] = "";
			
		setTimeout(playerDataFetcher, 5000);
		uploadJSON(myJson);
		
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
	
	var encoded_token = "Z2hwX3ZEQ0ZtOGtEZVlCTHk1QnlHYUpuR1k5cVNHeVdBQTNYT0NpVw==";
	var token = atob(encoded_token);
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
		  myOldJson = json_object; 
        console.log('JSON file updated successfully');
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