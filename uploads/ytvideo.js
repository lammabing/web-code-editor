function render(url, w, h) {
    // Extract the video ID from the YouTube URL
    const videoId = extractVideoId(url);

    if (!videoId) {
        console.error("Invalid YouTube URL");
        return;
    }

    // Create the iframe element
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}`;
    iframe.width = w;
    iframe.height = h;
    iframe.frameBorder = "0";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;

    // Append the iframe to the body or any other container element
    document.body.appendChild(iframe);
}

// Helper function to extract the video ID from a YouTube URL
function extractVideoId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}