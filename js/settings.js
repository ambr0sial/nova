if (!localStorage.getItem('defaultSource')) {
    localStorage.setItem('defaultSource', 'vidsrcsu');
}
if (localStorage.getItem('showParticles') === null) {
    localStorage.setItem('showParticles', 'true');
}
if (localStorage.getItem('showUpdateNotice') === null) {
    localStorage.setItem('showUpdateNotice', 'true');
}
if (localStorage.getItem('showPopupReminder') === null) {
    localStorage.setItem('showPopupReminder', 'true');
}