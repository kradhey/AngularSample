declare var $;

export const utils = {
    parseVideo,
    createVideo,
    getVideoThumbnail,
    getVimeoThumbnail
}

function parseVideo (url) {
    // - Supported YouTube URL formats:
    //   - http://www.youtube.com/watch?v=My2FRPA3Gf8
    //   - http://youtu.be/My2FRPA3Gf8
    //   - https://youtube.googleapis.com/v/My2FRPA3Gf8
    // - Supported Vimeo URL formats:
    //   - http://vimeo.com/25451551
    //   - http://player.vimeo.com/video/25451551
    // - Also supports relative URLs:
    //   - //player.vimeo.com/video/25451551

    var type = null;

    url.match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/);

    if (RegExp.$3.indexOf('youtu') > -1) {
        type = 'youtube';
    } else if (RegExp.$3.indexOf('vimeo') > -1) {
        type = 'vimeo';
    }

    return {
        type: type,
        id: RegExp.$6
    };
}

function createVideo (url, width, height) {
    // Returns an iframe of the video with the specified URL.
    let video = parseVideo(url);
    let $iframe = $('<iframe>', { width: width, height: height });

    $iframe.attr('frameborder', 0);

    if (video.type == 'youtube') {
        $iframe.attr('src', '//www.youtube.com/embed/' + video.id);
    } else if (video.type == 'vimeo') {
        $iframe.attr('src', '//player.vimeo.com/video/' + video.id);
    }
    
    return $iframe;
}

function getVimeoThumbnail(id, cb) {
    $.get('//vimeo.com/api/v2/video/' + id + '.json', function(data) {
        cb(data[0].thumbnail_large);
    });
}

function getVideoThumbnail (url, cb) {
    const video = parseVideo(url);

    if (video.type == 'youtube') {
        cb('//img.youtube.com/vi/' + video.id + '/maxresdefault.jpg');
    } else if (video.type == 'vimeo') {
        $.get('//vimeo.com/api/v2/video/' + video.id + '.json', function(data) {
            cb(data[0].thumbnail_large);
        });
    }
}
