const formData = new FormData();
let fileOrFiles = [];

const fileDropper = $('.file-dropper');
const fileDropperForm = $('.file-dropper-form');
const fileDropperLabel = $('.file-dropper-label');

const handleFileDrop = async (e) => {
  e.preventDefault();
  if (e.type === 'drop') {
    fileOrFiles = e.originalEvent.dataTransfer.files;
    if (fileOrFiles.length > 1) {
      const keys = Object.keys(fileOrFiles);
      keys.forEach(key => {
        formData.append('files', fileOrFiles[key]);
      });
    } else {
      formData.append('file', fileOrFiles[0]);
    }
  }
}

const handleSubmit = async (e) => {
  e.preventDefault();

  const newName = $('.new-name-input').val().replace(/\s+/g, '_');
  const directory = $('.directory-input').val();
  
  if (fileDropper.prop('files').length === 1) {

    formData.append('files', fileDropper.prop('files')[0]);

    const options = {
      method: 'POST',
      body: formData,
    };

    try {
    const response = await fetch(`http://143.244.187.233:3001/rename_one/${newName}/${directory}`, options);
    console.log({ response })
    $('.success-modal').removeClass('hidden');
    setTimeout(() => {
      window.location.reload();
    }, 1500);
    } catch (err) {
      alert(`there was an error: ${err}, ${err.message}`);
    }

  } else if (fileDropper.prop('files').length > 1) {

    const keys = Object.keys(fileDropper.prop('files'));
    keys.forEach(key => {
      formData.append('files', fileDropper.prop('files')[key]);
    });

    const options = {
      method: 'POST',
      body: formData,
    };

    try {
      const response = await fetch(`http://143.244.187.233:3001/rename_multiple/${newName}/${directory}`, options);
      console.log({ response });
      $('.success-modal').removeClass('hidden');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      alert(`there was an error: ${err}, ${err.message}`);
    }

  } else if (fileOrFiles.length === 1) {

    const keys = Object.keys(fileOrFiles);
    keys.forEach(key => {
      formData.append('files', fileOrFiles[key]);
    });

    const options = {
      method: 'POST',
      body: formData,
    };

    try {
      const response = await fetch(`http://143.244.187.233:3001/rename_one/${newName}/${directory}`, options);
      console.log({ response });
      $('.success-modal').removeClass('hidden');
      setTimeout(() => {
        window.location.reload();
      }, 1500)
    } catch (err) {
      alert(`there was an error: ${err}, ${err.message}`);
    }

  } else if (fileOrFiles.length > 1) {

    const keys = Object.keys(fileOrFiles);
    keys.forEach(key => {
      formData.append('files', fileOrFiles[key]);
    })

    const options = {
      method: 'POST',
      body: formData,
    };

    try {
      const response = await fetch(`http://143.244.187.233:3001/rename_multiple/${newName}/${directory}`, options);
      console.log({ response });
      $('.success-modal-wrapper').removeClass('hidden');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      alert(`there was an error: ${err}, ${err.message}`);
    }
  } else {
    alert('something isn\'t right . . . make sure you selected files . . .');
  }
}

const handleEnterButtonPress = (e) => {
  if (e.key.toLowerCase() === 'enter') fileDropperLabel.click();
}

fileDropperLabel.on('dragover', handleFileDrop);
fileDropperLabel.on('dragenter', handleFileDrop);
fileDropperLabel.on('drop', handleFileDrop);
fileDropperLabel.on('keypress', handleEnterButtonPress);
fileDropperForm.on('submit', handleSubmit);
