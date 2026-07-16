function goBack() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = "/"; // Fallback ke home jika tidak ada history
    }
}
