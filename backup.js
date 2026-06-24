function exportData() {
  if (localStorage.length === 0) {
    alert("No data to save yet!");
    return;
  }
  const blob = new Blob([JSON.stringify(localStorage)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `backup-${new Date().toISOString().split('T')}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importData(inputElement) {
  const file = inputElement.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const importedData = JSON.parse(e.target.result);
      if (confirm("This will replace your current data. Continue?")) {
        localStorage.clear();
        Object.keys(importedData).forEach(key => {
          localStorage.setItem(key, importedData[key]);
        });
        alert('Data restored successfully!');
        window.location.reload();
      }
    } catch (error) {
      alert('Invalid backup file format.');
    }
    inputElement.value = ''; 
  };
  reader.readAsText(file);
}
