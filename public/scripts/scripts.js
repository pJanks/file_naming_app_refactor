const fileDropperLabel = $('.file-dropper-label');
const fileDropperForm = $('.file-dropper-form');
const fileDropper = $('.file-dropper');

fileDropperLabel.on('dragover dragenter drop', (e) => handleFileDrop(e));
fileDropperLabel.on('keypress', (e) => handleEnterButtonPress(e));
fileDropperForm.on('submit', (e) => handleSubmit(e));

const formData = new FormData();

const appendFormData = (fileOrFilesToAppend) => {
  Object.keys(fileOrFilesToAppend).forEach(key => {
    formData.append('files', fileOrFilesToAppend[key]);
  });
}

const handleFileDrop = async (e) => {
  e.preventDefault();
  if (e.type === 'drop') appendFormData(e.originalEvent.dataTransfer.files);
}

const handleEnterButtonPress = (e) => {
  if (e.key.toLowerCase() === 'enter') fileDropperLabel.click();
}

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const newName = $('.new-name-input').val().replace(/\s+/g, '_');
    const directory = $('.directory-input').val().replace(/\s+/g, '_');
    const startPositionToRemove = Number($('.start-input').val()) - 1;
    const endPositionToRemove = Number($('.end-input').val()) - 1;

    if (startPositionToRemove < -1 || endPositionToRemove < -1) {
      alert('enter valid starting and ending positions of characters to remove or 0');
      return;
    }
    
    if (fileDropper.prop('files').length) appendFormData(fileDropper.prop('files'));

    const options = {
      method: 'POST',
      body: formData,
    };

    await fetch(`http://143.244.187.233:3001/rename/${newName}/${directory}/${startPositionToRemove}/${endPositionToRemove}`, options);

    $('.success-modal-wrapper').removeClass('hidden');
    setTimeout(() => window.location.reload(), 1000);
  } catch (err) {
    alert(`there was an error: ${err}`);
  }
}