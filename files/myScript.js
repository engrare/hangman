







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