// Saves options to chrome.storage
function save_options() {
  var wikiUrl = document.getElementById('url').value;
  chrome.storage.sync.set({
    wikiUrl: wikiUrl,
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Settings saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    wikiUrl: '',
  }, function(items) {
    document.getElementById('url').value = items.wikiUrl;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
