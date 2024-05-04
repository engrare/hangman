var trueword = "kayanin kedisi";
var hangingpercentage = 0;


fetch('https://raw.githubusercontent.com/eylulberil/encoded_key/main/keys.json')
  .then(response => response.json())
  .then(myObj => {
	encrypted_key = myObj[0];
	console.log(encrypted_key);
	
  })
  .catch(error => {
    // Handle any errors that occur during the fetch request
    console.log('Error:', error);
  });



$( document ).ready(function() {
	var wordlen = trueword.length;
	for(let i = 0; i < wordlen-1; i++) {
		if(trueword[i+1] == " ") {
			$( ".words_letters_inner:first" ).clone().appendTo( ".words_div" ).text(" ");
		} else {
			$( ".words_letters_inner:first" ).clone().appendTo( ".words_div" );

		}
	}


	
$( ".letters_inner" ).on( "click", function() {
	if(!($(this).hasClass( "letters_inner_true" ) || $(this).hasClass( "letters_inner_false" ))) {
		$(".letters_inner").removeClass("letters_inner_selected");
		$(this).addClass("letters_inner_selected");
		
	}
	
});
	
$( ".submit_button_inner_1" ).on( "click", function() {
	if($( ".letters_inner" ).hasClass( "letters_inner_selected" ) && hangingpercentage < 6) {
		let word_txt = $(".letters_inner_selected").text();
		let iswordtrue = false;
		for(let i = 0; i < wordlen; i++) {
			if(trueword[i].toLowerCase() == word_txt.toLowerCase()) {
				$(".words_letters_inner:eq(" + i + ")").text(word_txt);
				iswordtrue = true;
			}
		}
		
		if(iswordtrue == false) {
			$(".letters_inner_selected").addClass("letters_inner_false");
			$(".hangman_draw:eq(" + hangingpercentage + ")").css("visibility", "visible");
			hangingpercentage++;
			if(hangingpercentage == 6) {
				$(".game_over_text").css("display", "block");
			}
		}
		else {
			$(".letters_inner_selected").addClass("letters_inner_true");
			$(".letters_inner_selected").css("background", "blue");
			
		}
		
		$( ".letters_inner_selected" ).removeClass( "letters_inner_selected" );
		}

});

  
});








function uploadJSON(json_object, key, isWebUpload) {
  // Update the data as desired
  /*const updatedData = {
    someKey: 'çok seviyorum'
  };*/

  //const token = 'ghp_ıaıjdfıoahjıthfq3hıahgıahegıfhıaehgodebngo';
  var token = key;
  const repoOwner = 'eylulberil';
  var repoName = 'ristrecded-engrare-data';
  var filePath = './data.json';
	if(arguments.length == 3) {
	  var repoName = 'engrare-data';
	  var filePath = './data.json';
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